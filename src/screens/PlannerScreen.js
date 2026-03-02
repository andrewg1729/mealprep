import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme';
import { useAppContext } from '../context/AppContext';
import { Trash2, Calendar, CheckCircle } from 'lucide-react-native';

export default function PlannerScreen() {
    const { mealPlan, removeFromPlan, logMeal } = useAppContext();

    const renderPlannedMeal = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => logMeal(item)}
                            style={styles.logButton}
                        >
                            <CheckCircle size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeFromPlan(item.id)}>
                            <Trash2 size={20} color={theme.colors.danger} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.subtitle}>{item.calories} kcal • {item.protein}g Protein</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Weekly Plan</Text>
                <Text style={styles.headerSubtitle}>Manage your scheduled meals</Text>
            </View>

            {mealPlan.length === 0 ? (
                <View style={styles.emptyState}>
                    <Calendar size={64} color={theme.colors.surfaceLight} />
                    <Text style={styles.emptyTitle}>Your plan is empty</Text>
                    <Text style={styles.emptyText}>Add some delicious recipes from the Discover tab to get started!</Text>
                </View>
            ) : (
                <FlatList
                    data={mealPlan}
                    renderItem={renderPlannedMeal}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
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
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    image: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: theme.spacing.md,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
        marginRight: 8,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textMuted,
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
