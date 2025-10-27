import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }}/>
            <Stack.Screen
                name="workout-record"
                options={{
                    headerShown: true,
                    title: 'Workout Record',
                    headerBackTitle: 'Workouts',
                }}
            />
        </Stack>
    )
}

