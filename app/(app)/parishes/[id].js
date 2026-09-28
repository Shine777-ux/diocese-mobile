import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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

    if (id) fetchParish();
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
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="church" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>{parish.name}</Text>
        <Text style={styles.detailText}>Pastor: {parish.pastor || 'N/A'}</Text>
        <Text style={styles.detailText}>{parish.email || ''} {parish.phone ? `• ${parish.phone}` : ''}</Text>
        {parish.address ? <Text style={styles.detailText}>{parish.address}</Text> : null}
      </LinearGradient>

      <View style={styles.content}>
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
          <MaterialIcons name="info-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
          <Text style={styles.infoText}>Parishioners directory and sacramental registers are synced with the Diocesan Chancery.</Text>
        </View>
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
    padding: 24,
    paddingTop: 36,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  detailText: {
    color: COLORS.textLight,
    fontSize: SIZES.xs,
    marginBottom: 3,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: COLORS.surface,
    width: '48%',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.xs,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  }
});
