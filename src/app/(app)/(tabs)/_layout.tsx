import { useUser } from '@clerk/clerk-expo';
import { AntDesign } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function Layout() {
    const { user } = useUser();

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" color={color} size={size}/>
                    )
                }}
            />
            <Tabs.Screen
                name="exercises"
                options={{
                    title: 'Exercises',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="book" color={color} size={size}/>
                    )
                }}
            />
            <Tabs.Screen
                name="workout"
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="pluscircle" color={color} size={size}/>
                    )
                }}
            />
            <Tabs.Screen
                name="active-workout"
                options={{
                    title: 'Active Workout',
                    href: null,
                    tabBarStyle: {
                        display: 'none',
                    },
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="clockcircleo" color={color} size={size}/>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: () => (
                        <Image
                            source={{
                                uri: user?.imageUrl ?? user?.externalAccounts[0]?.imageUrl
                            }}
                            className="rounded-full"
                            style={{ width: 28, height: 28, borderRadius: 100 }}
                        />
                    )
                }}
            />
        </Tabs>
    )
}
