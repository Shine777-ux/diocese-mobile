import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInDown, FadeInRight } from '../../../src/components/FadeInView';

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

  const renderDeanery = ({ item, index }) => (
    <FadeInRight delay={index * 100} duration={500}>
      <TouchableOpacity activeOpacity={0.8} style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="business" size={24} color={COLORS.secondary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>Dean: {item.dean || 'N/A'}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
      </TouchableOpacity>
    </FadeInRight>
  );

  return (
    <View style={styles.container}>
      <FadeInDown duration={600}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.headerCard}>
          <Text style={styles.title}>{diocese.name}</Text>
          <Text style={styles.detailText}>Bishop: {diocese.bishop || 'N/A'}</Text>
          <Text style={styles.detailText}>Founded: {diocese.founded || 'N/A'}</Text>
          <Text style={styles.detailText}>{diocese.email} | {diocese.phone}</Text>
          <Text style={styles.detailText}>{diocese.address}</Text>
        </LinearGradient>
      </FadeInDown>

      <Text style={styles.sectionTitle}>Deaneries in this Diocese</Text>
      
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
    padding: 32,
    paddingTop: 60,
    borderBottomLeftRadius: SIZES.radius.xl,
    borderBottomRightRadius: SIZES.radius.xl,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: SIZES.md,
    marginBottom: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    margin: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: SIZES.radius.md,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radius.sm,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 40,
    fontSize: SIZES.md,
  }
});
