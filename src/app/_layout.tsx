import '../global.css';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';

export default function Layout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <Slot
                screenOptions={{
                    headerShown: false,
                }}>
            </Slot>
        </ClerkProvider>
    );
}
