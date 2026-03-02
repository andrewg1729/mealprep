import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme';
import { useAppContext } from '../context/AppContext';
import { Target } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

export default function TrackerScreen() {
    const { dailyIntake, goals } = useAppContext();

    const MacroRing = ({ label, current, goal, color, size = 100 }) => {
        const radius = size / 2 - 10;
        const circumference = 2 * Math.PI * radius;
        const progress = Math.min(current / goal, 1);
        const strokeDashoffset = circumference - progress * circumference;

        return (
            <View style={styles.ringContainer}>
                <Svg height={size} width={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={theme.colors.surfaceLight}
                        strokeWidth="8"
                        fill="transparent"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
                <View style={styles.ringTextContainer}>
                    <Text style={styles.ringLabel}>{label}</Text>
                    <Text style={styles.ringValue}>{current}g</Text>
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Daily Tracker</Text>
                <Text style={styles.headerSubtitle}>Keep pushing towards your goals</Text>
            </View>

            <View style={styles.mainProgress}>
                <View style={styles.calorieStats}>
                    <Text style={styles.calorieRemaining}>
                        {goals.calories - dailyIntake.calories}
                    </Text>
                    <Text style={styles.calorieLabel}>Calories Left</Text>
                </View>
                <View style={styles.progressRow}>
                    <View style={styles.progressItem}>
                        <Text style={styles.progressValue}>{dailyIntake.calories}</Text>
                        <Text style={styles.progressSub}>Consumed</Text>
                    </View>
                    <View style={[styles.progressItem, { borderLeftWidth: 1, borderColor: theme.colors.surfaceLight }]}>
                        <Text style={styles.progressValue}>{goals.calories}</Text>
                        <Text style={styles.progressSub}>Goal</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Macros Breakdown</Text>
            <View style={styles.ringsRow}>
                <MacroRing
                    label="Prot"
                    current={dailyIntake.protein}
                    goal={goals.protein}
                    color={theme.colors.primary}
                />
                <MacroRing
                    label="Carb"
                    current={dailyIntake.carbs}
                    goal={goals.carbs}
                    color={theme.colors.accent}
                />
                <MacroRing
                    label="Fat"
                    current={dailyIntake.fat}
                    goal={goals.fat}
                    color={theme.colors.danger}
                />
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                    <Target size={24} color={theme.colors.primary} />
                    <View style={styles.summaryContent}>
                        <Text style={styles.summaryTitle}>Weekly Streak</Text>
                        <Text style={styles.summaryText}>5 days in a row hit goals!</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
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
        marginBottom: theme.spacing.lg,
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
    mainProgress: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.md,
        borderRadius: theme.roundness.xl,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    calorieStats: {
        alignItems: 'center',
        marginBottom: 24,
    },
    calorieRemaining: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    calorieLabel: {
        fontSize: 18,
        color: theme.colors.textMuted,
        fontWeight: '600',
    },
    progressRow: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    progressItem: {
        flex: 1,
        alignItems: 'center',
    },
    progressValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    progressSub: {
        color: theme.colors.textMuted,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    ringsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        marginBottom: theme.spacing.xl,
    },
    ringContainer: {
        alignItems: 'center',
        width: 100,
    },
    ringTextContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    ringLabel: {
        fontSize: 10,
        color: theme.colors.textMuted,
        textTransform: 'uppercase',
    },
    ringValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    summaryCard: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.md,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        marginBottom: 100,
        borderWidth: 1,
        borderColor: theme.colors.surfaceLight,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryContent: {
        marginLeft: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    summaryText: {
        color: theme.colors.textMuted,
        marginTop: 2,
    },
});
