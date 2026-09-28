import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DioceseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [diocese, setDiocese] = useState(null);
  const [deaneries, setDeaneries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [dioceseRes, deaneriesRes] = await Promise.all([
          apiClient.get(`/api/dioceses/${id}`),
          apiClient.get(`/api/deaneries?diocese_id=${id}`)
        ]);
        setDiocese(dioceseRes.data);
        setDeaneries(deaneriesRes.data);
      } catch (error) {
        console.error('Failed to fetch diocese details', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!diocese) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Diocese not found</Text>
      </View>
    );
  }

  const renderDeanery = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="business" size={22} color={COLORS.secondary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Dean: {item.dean || 'N/A'}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerCard}>
        <Text style={styles.title}>{diocese.name}</Text>
        <Text style={styles.detailText}>Bishop: {diocese.bishop || 'N/A'}</Text>
        <Text style={styles.detailText}>Founded: {diocese.founded || 'N/A'}</Text>
        <Text style={styles.detailText}>{diocese.email} {diocese.phone ? `• ${diocese.phone}` : ''}</Text>
        {diocese.address ? <Text style={styles.detailText}>{diocese.address}</Text> : null}
      </LinearGradient>

      {/* No count in title header */}
      <Text style={styles.sectionTitle}>Deaneries / Vicariates</Text>
      
      <FlatList
        data={deaneries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderDeanery}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Deaneries Found</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  detailText: {
    color: COLORS.textLight,
    fontSize: SIZES.xs,
    marginBottom: 3,
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
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
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
    marginTop: 30,
    fontSize: SIZES.xs,
  }
});
