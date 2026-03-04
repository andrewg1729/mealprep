Hey Antigravity, please help me completely replace my existing backend server with the new 2.2M recipe "Scraper Backend" from this repository. My frontend UI is ready, but I need the high-performance search engine that pulls real images from the web. Please follow these exact steps:

1. **Purge the Old Backend**: 
    - Completely delete my current `server/` folder and any `recipes.db` or `recipes.csv` files to avoid dataset corruption.
2. **Re-Initialize Server**:
    - Download the new `server.js`, `import_recipes.js`, `download_dataset.py`, and `package.json` from `https://github.com/andrewg1729/mealprep.git` into a fresh `/server` directory.
3. **Automated Setup**:
    - Inside `/server`, run `npm install` (installs express, better-sqlite3, axios, etc.).
    - Ensure `kagglehub` is installed via `pip install kagglehub`.
    - Run `python download_dataset.py` to fetch the 2.2M-recipe archive.
    - Run the importer: `node import_recipes.js <LOCAL_CSV_PATH>` (This takes ~5-10 minutes to process 2.2 million recipes).
4. **Launch & Connect**:
    - Start the server: `npm start`.
    - Verify it says "Connected to recipes database."
5. **Real-Time Image Check**: 
    - Search for a recipe in my frontend. The backend will now automatically scrape the original recipe website for a high-quality "Open Graph" image and cache it for future use. My app will look premium with real food photography!
