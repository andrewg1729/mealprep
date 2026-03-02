import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppProvider } from './src/context/AppContext';
import { theme } from './src/theme';
import { Utensils, Calendar, Activity, ShoppingBasket } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

// Screens
import DiscoverScreen from './src/screens/DiscoverScreen';
import PlannerScreen from './src/screens/PlannerScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import GroceryScreen from './src/screens/GroceryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.surfaceLight,
              height: 90,
              paddingBottom: 30,
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textMuted,
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Discover') return <Utensils size={size} color={color} />;
              if (route.name === 'Plan') return <Calendar size={size} color={color} />;
              if (route.name === 'Track') return <Activity size={size} color={color} />;
              if (route.name === 'Grocery') return <ShoppingBasket size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Discover" component={DiscoverScreen} />
          <Tab.Screen name="Plan" component={PlannerScreen} />
          <Tab.Screen name="Track" component={TrackerScreen} />
          <Tab.Screen name="Grocery" component={GroceryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
