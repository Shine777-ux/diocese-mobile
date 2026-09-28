import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FamilyDetailScreen() {
  const { id } = useLocalSearchParams();
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const response = await apiClient.get(`/api/families/${id}`);
        setFamily(response.data);
      } catch (error) {
        console.error('Failed to fetch family details', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFamily();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!family) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Family not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="family-restroom" size={36} color={COLORS.secondary} />
        </View>
        <Text style={styles.title}>{family.name}</Text>
        <Text style={styles.detailText}>Head: {family.head_name || 'N/A'}</Text>
        <Text style={styles.detailText}>{family.address || ''} {family.phone ? `• ${family.phone}` : ''}</Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Family Members</Text>

      <FlatList
        data={family.members || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/(app)/members/${item.id}`)}
          >
            <View style={styles.memberIcon}>
              <MaterialIcons name="person" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.cardSubtitle}>Role: {item.role || 'Parishioner'}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Members Registered in this Family</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerCard: {
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  detailText: {
    color: COLORS.textLight,
    fontSize: SIZES.xs,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  memberIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
    fontSize: SIZES.xs,
  }
});
