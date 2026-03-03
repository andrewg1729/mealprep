import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { Plus, Clock, Zap, Search } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const API_URL = 'http://localhost:3006';

export default function DiscoverScreen() {
    const { addToPlan } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecipes = async (query = '') => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleSearch = () => {
        fetchRecipes(searchQuery);
    };

    const renderRecipe = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.meta}>
                    <View style={styles.metaItem}>
                        <Clock size={14} color={theme.colors.textMuted} />
                        <Text style={styles.metaText}>{item.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Zap size={14} color={theme.colors.accent} />
                        <Text style={styles.metaText}>{item.calories} kcal</Text>
                    </View>
                </View>
                <View style={styles.macros}>
                    <Text style={styles.macroText}>P: {item.protein}g</Text>
                    <Text style={styles.macroText}>C: {item.carbs}g</Text>
                    <Text style={styles.macroText}>F: {item.fat}g</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToPlan(item)}
                >
                    <Plus size={20} color="white" />
                    <Text style={styles.addButtonText}>Add to Plan</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Discover Meals</Text>
                <Text style={styles.headerSubtitle}>Search 1M+ recipes from Food.com</Text>

                <View style={styles.searchBar}>
                    <Search size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search recipes (e.g. chicken alfredo)"
                        placeholderTextColor={theme.colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Searching our massive database...</Text>
                </View>
            ) : (
                <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recipes found for "{searchQuery}"</Text>
                        </View>
                    }
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
        color: theme.colors.brightPink,
    },
    headerSubtitle: {
        fontSize: 16,
        color: theme.colors.textMuted,
        marginTop: 4,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.md,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: theme.colors.textMuted,
        marginTop: 12,
        fontSize: 16,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: 16,
        textAlign: 'center',
    },
    list: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: theme.spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 8,
    },
    meta: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        color: theme.colors.textMuted,
        fontSize: 14,
        marginLeft: 4,
    },
    macros: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surfaceLight,
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    macroText: {
        color: theme.colors.text,
        fontSize: 12,
        marginRight: 12,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: theme.roundness.md,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
