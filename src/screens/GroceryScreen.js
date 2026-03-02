import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, CheckCircle2, Circle } from 'lucide-react-native';

export default function GroceryScreen() {
    const { mealPlan } = useAppContext();
    const [checkedItems, setCheckedItems] = useState({});

    // Flatten ingredients from all planned meals
    const ingredients = mealPlan.reduce((acc, recipe) => {
        recipe.ingredients.forEach(ing => {
            if (!acc.includes(ing)) acc.push(ing);
        });
        return acc;
    }, []);

    const toggleItem = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const renderIngredient = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => toggleItem(item)}
        >
            {checkedItems[item] ? (
                <CheckCircle2 size={24} color={theme.colors.primary} />
            ) : (
                <Circle size={24} color={theme.colors.surfaceLight} />
            )}
            <Text style={[
                styles.itemText,
                checkedItems[item] && styles.itemTextChecked
            ]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Grocery List</Text>
                <Text style={styles.headerSubtitle}>Items needed for your plan</Text>
            </View>

            {ingredients.length === 0 ? (
                <View style={styles.emptyState}>
                    <ShoppingCart size={64} color={theme.colors.surfaceLight} />
                    <Text style={styles.emptyTitle}>List is empty</Text>
                    <Text style={styles.emptyText}>Add meals to your plan to generate a grocery list automatically.</Text>
                </View>
            ) : (
                <FlatList
                    data={ingredients}
                    renderItem={renderIngredient}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    list: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 100,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    itemText: {
        fontSize: 16,
        color: theme.colors.text,
        marginLeft: 16,
    },
    itemTextChecked: {
        color: theme.colors.textMuted,
        textDecorationLine: 'line-through',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginTop: 8,
    },
});
