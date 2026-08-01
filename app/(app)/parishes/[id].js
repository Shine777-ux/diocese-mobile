import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ParishDetailScreen() {
  const { id } = useLocalSearchParams();
  const [parish, setParish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParish = async () => {
      try {
        const response = await apiClient.get(`/api/parishes/${id}`);
        setParish(response.data);
      } catch (error) {
        console.error('Failed to fetch parish details', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchParish();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!parish) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Parish not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <MaterialIcons name="church" size={48} color={COLORS.surface} style={styles.icon} />
        <Text style={styles.title}>{parish.name}</Text>
        <Text style={styles.detailText}>Pastor: {parish.pastor || 'N/A'}</Text>
        {parish.assistant_pastor ? (
          <Text style={styles.detailText}>Asst. Pastor: {parish.assistant_pastor}</Text>
        ) : null}
        <Text style={styles.detailText}>{parish.email} | {parish.phone}</Text>
        <Text style={styles.detailText}>{parish.address}</Text>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{parish.wards?.length || 0}</Text>
          <Text style={styles.statLabel}>Wards</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{parish.groups?.length || 0}</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <MaterialIcons name="info-outline" size={24} color={COLORS.primary} style={{marginRight: 8}}/>
        <Text style={styles.infoText}>Families and Members details will be available in Phase 3.</Text>
      </View>
      
    </ScrollView>
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
    backgroundColor: COLORS.accent,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailText: {
    color: COLORS.surface,
    opacity: 0.9,
    fontSize: SIZES.md,
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    margin: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: COLORS.surface,
    width: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: COLORS.primaryDark,
    fontSize: SIZES.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  }
});
