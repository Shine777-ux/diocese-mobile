import { Stack } from 'expo-router';
import { COLORS } from '../../../src/constants/theme';

export default function MembersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Members' }} />
      <Stack.Screen name="[id]" options={{ title: 'Member Details' }} />
    </Stack>
  );
}
