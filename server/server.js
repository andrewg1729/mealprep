const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = 3006;
const DB_PATH = path.join(__dirname, 'recipes.db');

app.use(cors());
app.use(express.json());

let db;
try {
    db = new Database(DB_PATH, { fileMustExist: false });
    console.log('Connected to recipes database.');
} catch (err) {
    console.error('Failed to connect to database:', err);
}

// Search Endpoint
app.get('/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();

    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    try {
        let results;
        if (!query) {
            results = db.prepare('SELECT * FROM recipes LIMIT 50').all();
        } else {
            // Use LIKE for substring search on title
            results = db.prepare('SELECT * FROM recipes WHERE title LIKE ? LIMIT 50')
                .all(`%${query}%`);
        }

        // Format results to match frontend expectations
        const formatted = results.map(r => {
            let ingredients = [];
            try {
                // Handle both Python-style (single quotes) and standard JSON
                const sanitized = r.ingredients.replace(/'/g, '"');
                ingredients = JSON.parse(sanitized);
            } catch (e) {
                // Fallback for simple comma-separated or malformed strings
                ingredients = r.ingredients.split(',').map(s => s.trim().replace(/[\[\]"]/g, ''));
            }

            return {
                id: r.id.toString(),
                title: r.title,
                image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80&keywords=${encodeURIComponent(r.title)}`,
                calories: r.calories,
                protein: r.protein,
                carbs: r.carbs,
                fat: r.fat,
                time: '25m',
                ingredients: ingredients
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
