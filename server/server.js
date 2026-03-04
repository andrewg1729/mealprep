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

// Function to extract og:image from a URL
async function fetchRecipeImage(id, url) {
    if (!url) return null;
    try {
        const fullUrl = url.startsWith('http') ? url : `http://${url}`;
        const response = await axios.get(fullUrl, {
            timeout: 2000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = response.data;
        // Search for og:image meta tag
        const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
            html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);

        if (match && match[1]) {
            const imageUrl = match[1];
            // Update cache in DB
            db.prepare('UPDATE recipes SET image_cache = ? WHERE id = ?').run(imageUrl, id);
            return imageUrl;
        }
    } catch (e) {
        // Skip on error
    }
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
            results = db.prepare('SELECT * FROM recipes WHERE title LIKE ? LIMIT 50')
                .all(`%${query}%`);
        }

        const formatted = await Promise.all(results.map(async (r) => {
            let image = r.image_cache;

            // Only try to fetch if not cached AND we have a query (active user searching)
            if (!image && query && results.indexOf(r) < 15) {
                // background fetch if possible or sequential for simplicity here
                image = await fetchRecipeImage(r.id, r.link);
            }

            const fallback = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80&keywords=${encodeURIComponent(r.title)}`;

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

// Recipe Details Endpoint
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

        res.json({
            ...recipe,
            ingredients,
            directions
        });
    } catch (err) {
        console.error('Details error:', err);
        res.status(500).json({ error: 'Failed to fetch details' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
