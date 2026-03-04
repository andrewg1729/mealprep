Hey Antigravity, please help me set up a backend searchable database for my existing FitFeast frontend using a 2M+ recipe dataset. I have my frontend already in place, so DO NOT overwrite any files in the root directory. Please follow these steps:

1. **Get the Server Code**: Download or clone only the `/server` directory from `https://github.com/andrewg1729/mealprep.git` into a folder named `/server` in my current workspace.
2. **Setup Dependencies**:
    - Enter the `/server` folder.
    - Run `npm install` (this will install Express, Better-SQLite3, and CSV Parser).
    - Ensure `pip` is available and run `pip install kagglehub`.
3. **Download & Import the 2.2M Recipe Dataset**:
    - Run `python download_dataset.py` to fetch the dataset from Kaggle.
    - Capturing the output path from the python script, run: `node import_recipes.js <PATH_TO_CSV>`.
    - **Wait** for the importer to finish (this will take 5-10 minutes to process 2 million recipes into a SQLite database).
4. **Start & Verify**:
    - Start the server on port 3006 using `npm start`.
    - Verify it says "Connected to recipes database."
5. **Final Check**: Confirm the backend is ready at `http://localhost:3006/search` so my frontend can start querying it.
