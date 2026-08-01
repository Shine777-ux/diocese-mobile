import { Stack } from 'expo-router';
import { COLORS } from '../../../src/constants/theme';

export default function DiocesesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Dioceses' }} />
      <Stack.Screen name="[id]" options={{ title: 'Diocese Details' }} />
    </Stack>
  );
}
