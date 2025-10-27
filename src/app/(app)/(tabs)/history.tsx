import { client } from '@/lib/sanity/client';
import { GetWorkoutsQueryResult } from '@/lib/sanity/types';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { defineQuery } from 'groq';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { formatDuration } from '../../../../lib/utils/date.util';

export const getWorkoutsQuery =
    defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
    _id,
    date,
    duration,
    exercises[] {
        exercise-> {
            _id,
            name,
        },
        sets[] {
            reps,
            weight,
            weightUnit,
            _type,
            _key,
        },
        _type,
        _key,
    }
}`)

export default function History() {
    const { user } = useUser();
    const router = useRouter();
    const { refresh } = useLocalSearchParams<{ refresh: string }>();

    const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWorkouts = async () => {
        if (!user.id) {
            return;
        }

        setLoading(true);

        try {
            const result = await client.fetch(getWorkoutsQuery, { userId: user.id });
            setWorkouts(result);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        void fetchWorkouts();
    }, [user.id]);

    // Handle refresh parameter from deleted workout
    useEffect(() => {
        if (refresh === 'true') {
            void fetchWorkouts();
            // Clear the refresh parameter from the URL
            router.replace('/(app)/(tabs)/history');
        }
    }, [refresh]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-GB', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
        }
    }

    const formatWorkoutDuration = (seconds: number) => {
        if (!seconds || seconds <= 0) {
            return 'Duration not recorded';
        }
        return formatDuration(seconds)
    }

    const getTotalStats = (workout: GetWorkoutsQueryResult[number]) => {
        return (
            workout.exercises.reduce((total, exercise) => {
                return total + (exercise.sets?.length || 0);
            }, 0)
        ) || 0;
    }

    const getExerciseNames = (workout: GetWorkoutsQueryResult[number]) => {
        return (
            workout.exercises.map((exercise) => exercise.exercise.name).filter(Boolean) || []
        )
    }

    const onRefresh = () => {
        setRefreshing(true);
        void fetchWorkouts();
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 gray-50">
                <View className="px-6 py-4 bg-white border-b border-gray-200">
                    <Text className="text-2xl font-bold text-gray-900">
                        Workout History
                    </Text>
                </View>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#3B82F6"/>
                    <Text className="text-gray-600 mt-4">
                        Loading your workouts...
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex flex-1">
            {/* Header */}
            <View className="px-6 py-4 bg-white border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">
                    Workout History
                </Text>
                <Text className="text-gray-600 mt-1">
                    {workouts.length} workout{workouts.length !== 1 ? 's' : ''} completed
                </Text>
            </View>

            {/* Workout List */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }>
                {workouts.length === 0 ? (
                    <View className="bg-white rounded-2xl p-8 items-center">
                        <Ionicons name="barbell-outline" size={64} color="#9CA3AF"/>
                        <Text className="text-xl font-semibold text-gray-900 mt-4">
                            No workouts yet
                        </Text>
                        <Text className="text-gray-600 text-center mt-2">
                            Your completed workouts will appear here
                        </Text>
                    </View>
                ) : (
                    <View className="space-y-4 gap-4">
                        {workouts.map((workout) => (
                            <TouchableOpacity
                                key={workout._id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                                activeOpacity={0.7}
                                onPress={() => {
                                    router.push({
                                        pathname: '/history/workout-record',
                                        params: {
                                            workoutId: workout._id
                                        }
                                    });
                                }}>
                                {/* Workout Header */}
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900">
                                            {formatDate(workout.date) || ''}
                                        </Text>
                                        <View className="flex-row items-center mt-1">
                                            <Ionicons name="time-outline" size={16} color="#6B7280"/>
                                            <Text className="text-gray-600 ml-2">
                                                {formatWorkoutDuration(workout.duration)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                                        <Ionicons name="fitness-outline" size={24} color="#3B82F6"/>
                                    </View>
                                </View>

                                {/* Workout Stats */}
                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center">
                                        <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                                            <Text className="text-sm font-medium text-gray-700">
                                                {workout.exercises.length || 0} exercises
                                            </Text>
                                        </View>
                                        <View className="bg-gray-100 rounded-lg px-3 py-2">
                                            <Text className="text-sm font-medium text-gray-700">
                                                {getTotalStats(workout)} sets
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Exercise List */}
                                {workout.exercises && workout.exercises.length > 0 && (
                                    <View>
                                        <Text className="text-sm font-medium text-gray-700 mb-2">
                                            Exercises:
                                        </Text>
                                        <View className="flex-row flex-wrap">
                                            {getExerciseNames(workout).slice(0, 3).map((name, index) => (
                                                <View
                                                    key={index}
                                                    className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2">
                                                    <Text className="text-blue-700 text-sm font-medium">
                                                        {name}
                                                    </Text>
                                                </View>
                                            ))}
                                            {getExerciseNames(workout).length > 3 && (
                                                <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                                                    <Text className="text-gray-600 text-sm font-medium">
                                                        +{getExerciseNames(workout).length - 3} more
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

