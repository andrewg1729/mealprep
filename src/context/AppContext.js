import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [mealPlan, setMealPlan] = useState([]);
    const [dailyIntake, setDailyIntake] = useState({
        calories: 1240,
        protein: 85,
        carbs: 120,
        fat: 45,
    });
    const [goals, setGoals] = useState({
        calories: 2200,
        protein: 150,
        carbs: 250,
        fat: 70,
    });

    const addToPlan = (recipe) => {
        setMealPlan((prev) => [...prev, recipe]);
    };

    const removeFromPlan = (recipeId) => {
        setMealPlan((prev) => prev.filter((r) => r.id !== recipeId));
    };

    const logMeal = (recipe) => {
        setDailyIntake(prev => ({
            calories: prev.calories + recipe.calories,
            protein: prev.protein + recipe.protein,
            carbs: prev.carbs + recipe.carbs,
            fat: prev.fat + recipe.fat,
        }));
    };

    return (
        <AppContext.Provider
            value={{
                mealPlan,
                dailyIntake,
                goals,
                addToPlan,
                removeFromPlan,
                logMeal,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
