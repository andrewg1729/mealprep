Hey Antigravity, please help me set up a backend searchable database for my existing FitFeast frontend. I have my frontend already in place, so DO NOT overwrite any files in the root directory. Please follow these steps:

1. **Get the Server Code**: Download or clone only the `/server` directory from `https://github.com/andrewg1729/mealprep.git` into a folder named `/server` in my current workspace.
2. **Setup Dependencies**:
    - Enter the `/server` folder.
    - Run `npm install` to get Express and the CSV parser.
3. **Download the 1M+ Recipe Dataset**:
    - Download the full 32MB CSV to `server/recipes.csv` using this direct link: 
      `https://huggingface.co/datasets/AkashPS11/recipes_data_food.com/resolve/main/recipes.csv?download=true`
4. **Start & Verify**:
    - Start the server on port 3006 using `npm start`.
    - **Wait** for the console to log: "Successfully loaded 1048543 recipes."
5. **Final Check**: Confirm the backend is ready at `http://localhost:3006/search` so my frontend can start querying it.
