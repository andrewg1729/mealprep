const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3006;
const DB_PATH = path.join(__dirname, 'recipes.db');

const axios = require('axios');

app.use(cors());
app.use(express.json());

let db;
try {
    db = new Database(DB_PATH, { fileMustExist: false });
    console.log('Connected to recipes database.');
} catch (err) {
    console.error('Failed to connect to database:', err);
}

// Premium Category-Based Fallbacks (High Quality Unsplash Photos)
const CATEGORY_IMAGES = {
    chicken: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b',
    beef: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c',
    steak: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c',
    pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    dessert: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94',
    soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    breakfast: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    fish: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    seafood: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    taco: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
    veggie: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    drink: 'https://images.unsplash.com/photo-1544145945-f904253db0ad',
    cocktail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b'
};

function getSemanticFallback(title) {
    const lowerTitle = title.toLowerCase();
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
        if (lowerTitle.includes(key)) return `${url}?auto=format&fit=crop&w=600&q=80`;
    }
    // Generic high-quality food photo if no category matches
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80&sig=${encodeURIComponent(title)}`;
}

// Function to extract high-quality images from a URL
async function fetchRecipeImage(id, url) {
    if (!url) return null;
    try {
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        const response = await axios.get(fullUrl, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });
        const html = response.data;

        let imageUrl = null;

        // 1. OpenGraph
        const ogMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
            html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
        if (ogMatch) imageUrl = ogMatch[1];

        // 2. Twitter
        if (!imageUrl) {
            const twMatch = html.match(/<meta[^>]+name="twitter:image"[^>]+content="([^"]+)"/i) ||
                html.match(/<meta[^>]+content="([^"]+)"[^>]+name="twitter:image"/i);
            if (twMatch) imageUrl = twMatch[1];
        }

        // 3. JSON-LD
        if (!imageUrl) {
            const jsonMatch = html.match(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
            if (jsonMatch) {
                try {
                    const data = JSON.parse(jsonMatch[1]);
                    const obj = Array.isArray(data) ? data.find(item => item["@type"] === "Recipe") : data;
                    if (obj && obj.image) {
                        imageUrl = Array.isArray(obj.image) ? obj.image[0] : (typeof obj.image === 'object' ? obj.image.url : obj.image);
                    }
                } catch (e) { }
            }
        }

        if (imageUrl) {
            if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
            else if (imageUrl.startsWith('/')) {
                const urlObj = new URL(fullUrl);
                imageUrl = urlObj.origin + imageUrl;
            }
            imageUrl = imageUrl.split('?')[0];
            db.prepare('UPDATE recipes SET image_cache = ? WHERE id = ?').run(imageUrl, id);
            return imageUrl;
        }
    } catch (e) { }
    return null;
}

// Search Endpoint
app.get('/search', async (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        let results;
        if (!query) {
            results = db.prepare('SELECT * FROM recipes LIMIT 50').all();
        } else {
            results = db.prepare('SELECT * FROM recipes WHERE title LIKE ? LIMIT 50').all(`%${query}%`);
        }

        const formatted = await Promise.all(results.map(async (r, index) => {
            let image = r.image_cache;

            // Only scrape the top 10 results to keep response fast
            if (!image && query && index < 10) {
                // Background fetch if possible would be better, but for MVP we parallel scrape 10
                image = await fetchRecipeImage(r.id, r.link);
            }

            // High-quality semantic fallback if scraper fails or for lower results
            const fallback = getSemanticFallback(r.title);

            return {
                id: r.id.toString(),
                title: r.title,
                image: image || fallback,
                calories: r.calories,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat,
                time: '25m',
                link: r.link
            };
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/recipe/:id', (req, res) => {
    try {
        const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

        let ingredients = [];
        let directions = [];
        try {
            ingredients = JSON.parse(recipe.ingredients.replace(/'/g, '"'));
            directions = JSON.parse(recipe.directions.replace(/'/g, '"'));
        } catch (e) {
            ingredients = recipe.ingredients.split(',').map(s => s.trim().replace(/[\[\]"]/g, ''));
            directions = recipe.directions.split(',').map(s => s.trim().replace(/[\[\]"]/g, ''));
        }

        res.json({ ...recipe, ingredients, directions });
    } catch (err) {
        console.error('Details error:', err);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
