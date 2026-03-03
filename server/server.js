const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());

let recipes = [];

// Helper to parse R-style "c(...)" vectors
function parseRVector(vectorStr) {
    if (!vectorStr || !vectorStr.startsWith('c(')) return [];
    const inner = vectorStr.substring(2, vectorStr.length - 1);
    const items = inner.match(/\"(.*?)\"/g);
    return items ? items.map(item => item.replace(/\"/g, '')) : [];
}

function parseTime(isoDuration) {
    if (!isoDuration || isoDuration === 'NA') return '0m';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return isoDuration;
    const h = match[1] ? `${match[1]}h ` : '';
    const m = match[2] ? `${match[2]}m` : '';
    return (h + m).trim() || '0m';
}

console.log('Loading recipes from CSV...');
const csvPath = path.join(__dirname, 'recipes.csv');

fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
        // Only parse name for fast searching; parse full row when accessed?
        // Actually search is most common action, let's just parse the full object.
        const imageList = parseRVector(row.Images);
        const imageUrl = imageList[0] || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80';

        recipes.push({
            id: row.RecipeId,
            title: row.Name,
            image: imageUrl,
            calories: Math.round(parseFloat(row.Calories) || 0),
            protein: Math.round(parseFloat(row.ProteinContent) || 0),
            carbs: Math.round(parseFloat(row.CarbohydrateContent) || 0),
            fat: Math.round(parseFloat(row.FatContent) || 0),
            time: parseTime(row.CookTime),
            ingredients: parseRVector(row.RecipeIngredientParts)
        });
    })
    .on('end', () => {
        console.log(`Successfully loaded ${recipes.length} recipes.`);
    })
    .on('error', (err) => {
        console.error('Error loading CSV:', err);
    });

// Search Endpoint
app.get('/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();

    if (!query) {
        // Return sample if no query
        return res.json(recipes.slice(0, 50));
    }

    const results = recipes
        .filter(r => r.title.toLowerCase().includes(query))
        .slice(0, 50);

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
