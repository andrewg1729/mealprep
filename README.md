Hey Antigravity, please help me set up the FitFeast project from GitHub and get it running in a mobile preview with the full 1M+ recipe database. Please follow these exact steps:

1. **Clone the Project**: Clone the repository from `https://github.com/andrewg1729/mealprep.git` into the current workspace.
2. **Setup Backend**:
    - Navigate to the `server/` directory.
    - Run `npm install`.
    - Download the full 32MB dataset to `server/recipes.csv` from: `https://huggingface.co/datasets/AkashPS11/recipes_data_food.com/resolve/main/recipes.csv?download=true`.
    - Start the backend server on port 3006 using `npm start`.
3. **Setup Frontend**:
    - Return to the root directory and run `npm install`.
    - Start the app on port 3005 using `npx expo start --web --port 3005 --non-interactive`.
4. **Mobile Preview**: Open a browser window to `http://localhost:3005`. Resize the window to an iPhone 14 aspect ratio (**390x844**), wait for the app to load, and verify that I can search for "chicken" and get real results from the backend.
5. **Report Ready**: Let me know once everything is running and accessible.
