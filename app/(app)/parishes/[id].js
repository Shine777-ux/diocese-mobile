import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInDown, FadeInUp } from '../../../src/components/FadeInView';

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
      <FadeInDown duration={600}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="church" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>{parish.name}</Text>
          <Text style={styles.detailText}>Pastor: {parish.pastor || 'N/A'}</Text>
          {parish.assistant_pastor ? (
            <Text style={styles.detailText}>Asst. Pastor: {parish.assistant_pastor}</Text>
          ) : null}
          <Text style={styles.detailText}>{parish.email} | {parish.phone}</Text>
          <Text style={styles.detailText}>{parish.address}</Text>
        </LinearGradient>
      </FadeInDown>

      <FadeInUp duration={600} delay={200}>
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
          <MaterialIcons name="info-outline" size={24} color={COLORS.primary} style={{marginRight: 12}}/>
          <Text style={styles.infoText}>Families and Members details will be available in Phase 3.</Text>
        </View>
      </FadeInUp>
      
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
    padding: 32,
    borderBottomLeftRadius: SIZES.radius.xl,
    borderBottomRightRadius: SIZES.radius.xl,
    alignItems: 'center',
    ...SHADOWS.medium,
    paddingTop: 60, // approximate safe area top
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: SIZES.md,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    margin: 24,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: COLORS.surface,
    width: '45%',
    padding: 24,
    borderRadius: SIZES.radius.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  statValue: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoBox: {
    flexDirection: 'row',
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.small,
  },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.sm,
    fontWeight: '500',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  }
});
