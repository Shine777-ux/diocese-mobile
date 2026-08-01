import { Stack } from 'expo-router';
import { COLORS } from '../../../src/constants/theme';

export default function ParishesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Parishes' }} />
      <Stack.Screen name="[id]" options={{ title: 'Parish Details' }} />
    </Stack>
  );
}
