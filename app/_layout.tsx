import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

// Stripe publishable key - replace with your actual key
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      primary: colors.gold,
    },
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="modal" />
          <Stack.Screen name="onboarding-charisma" />
          <Stack.Screen name="onboarding-emotions" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-entry" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="subscription" />
          <Stack.Screen name="auth-sign-in" />
          <Stack.Screen 
            name="entry/[id]" 
            options={{ 
              headerShown: true,
              title: 'Entry Details',
              headerBackTitle: 'Back',
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.gold,
            }} 
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </StripeProvider>
  );
}
