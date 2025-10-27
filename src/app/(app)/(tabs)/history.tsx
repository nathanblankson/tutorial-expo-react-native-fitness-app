import { client } from '@/lib/sanity/client';
import { GetWorkoutsQueryResult } from '@/lib/sanity/types';
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { defineQuery } from 'groq';
import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
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

    const onRefresh = () => {
        setRefreshing(true);
        void fetchWorkouts();
    }

    return (
        <SafeAreaView className="flex flex-1">
            <Text>History</Text>
        </SafeAreaView>
    );
}

