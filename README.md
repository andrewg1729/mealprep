# FitFeast Setup Prompt

If you are setting up this project for the first time in a new Antigravity workspace, copy and paste the text below as your initial prompt:

---

### Antigravity Setup Instructions

"Hey Antigravity, please help me set up the FitFeast project from GitHub and get it running in a mobile preview. Please follow these steps:

1. **Clone the Project**: Clone the repository from `https://github.com/andrewg1729/mealprep.git` into the current workspace.
2. **Install Dependencies**: Run `npm install` to set up all React Native and Expo dependencies.
3. **Start the Web Server**: Run the app on port 3005 using `npx expo start --web --port 3005 --non-interactive`.
4. **Mobile Preview**: Open a browser window to `http://localhost:3005`. Resize the window to an iPhone 14 aspect ratio (**390x844**) and wait for the app to load.
5. **Report Ready**: Let me know once the app is visible and ready for development."

---

## Project Overview
FitFeast is a hybrid mobile app combining **Mealime-style** meal planning with **MyFitnessPal-style** calorie and macro tracking.

- **Stack**: React Native (Expo), React Navigation, Lucide Icons.
- **Key Features**: Discover Recipes, Weekly Planner, Macro Tracker (SVG Rings), and an automated Grocery List.

## Dev Commands
```bash
# Run on Web (Port 3005)
npx expo start --web --port 3005

# Run for Android
npx expo start --android

# Run for iOS
npx expo start --ios
```
