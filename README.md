Hey Antigravity, please help me completely replace my existing backend server with the high-performance 2M+ recipe backend from this project. My frontend is ready, but I need the new SQLite-powered search engine. Please follow these exact steps:

1. **Purge Old Backend**: 
    - Completely delete my existing `server/` directory and any old `recipes.csv` or `recipes.db` files in the workspace to ensure no remnants of the old, low-quality datasets remain.
2. **Install New Backend**:
    - Create a new `/server` directory.
    - Download/Clone `server.js`, `import_recipes.js`, `download_dataset.py`, and `package.json` from `https://github.com/andrewg1729/mealprep.git` into this new directory.
3. **Setup Logic**:
    - Inside `/server`, run `npm install`.
    - Ensure `kagglehub` is installed via `pip install kagglehub`.
    - Run `python download_dataset.py`.
    - Using the path from the download script, run the importer: `node import_recipes.js <PATH_TO_CSV>`.
    - *Note*: This will process 2.2M recipes and will take about 5-10 minutes.
4. **Launch & Connect**:
    - Start the new server with `npm start`.
    - Verify it connects to the new SQLite database and listens on port 3006.
5. **Final Confirmation**: Test a search for "Chicken" in my frontend to verify that 2.2 million high-quality recipes are now searchable.
