Hey Antigravity, please help me set up the FitFeast backend server to provide a searchable database of 1M+ recipes. My frontend is already set up, but I need the backend exactly like the one in this repository. Please follow these steps:

1. **Clone the Project**: Clone the repository from `https://github.com/andrewg1729/mealprep.git` into a temporary directory or directly into a `/server` folder in my workspace.
2. **Setup Backend**:
    - Navigate to the `server/` directory.
    - Run `npm install`.
    - Download the full 32MB dataset to `server/recipes.csv` from: `https://huggingface.co/datasets/AkashPS11/recipes_data_food.com/resolve/main/recipes.csv?download=true`.
3. **Start the Server**:
    - Start the backend server on port 3006 using `npm start`.
    - Verify it says "Successfully loaded 1048543 recipes."
4. **Connect My Frontend**:
    - Ensure my frontend code is pointing to `http://localhost:3006` for recipe searches.
