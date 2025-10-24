import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

const Layout = () => {
    const {
        isLoaded,
        isSignedIn,
        userId,
        sessionId,
        getToken,
    } = useAuth();

    if (!isLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        )
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="(tabs)"/>
            </Stack.Protected>

            <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen name="sign-in"/>
                <Stack.Screen name="sign-up"/>
            </Stack.Protected>
        </Stack>
    )
}
export default Layout
