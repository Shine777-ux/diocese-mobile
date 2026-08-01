import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

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

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>{diocese.name}</Text>
        <Text style={styles.detailText}>Bishop: {diocese.bishop || 'N/A'}</Text>
        <Text style={styles.detailText}>Founded: {diocese.founded || 'N/A'}</Text>
        <Text style={styles.detailText}>{diocese.email} | {diocese.phone}</Text>
        <Text style={styles.detailText}>{diocese.address}</Text>
      </View>

      <Text style={styles.sectionTitle}>Deaneries in this Diocese</Text>
      
      <FlatList
        data={deaneries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="business" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Dean: {item.dean || 'N/A'}</Text>
            </View>
          </View>
        )}
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
    backgroundColor: COLORS.primary,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
  },
  detailText: {
    color: COLORS.surface,
    opacity: 0.9,
    fontSize: SIZES.md,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  }
});
