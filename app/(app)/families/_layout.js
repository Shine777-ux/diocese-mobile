import { Stack } from 'expo-router';
import { COLORS } from '../../../src/constants/theme';

export default function FamiliesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Families' }} />
      <Stack.Screen name="[id]" options={{ title: 'Family Details' }} />
    </Stack>
  );
}
