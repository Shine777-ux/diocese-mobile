import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../src/constants/theme';
import apiClient from '../../src/api/client';
import { MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value !== undefined ? value : '...'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.username || 'User'}</Text>
          <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Overview</Text>
      
      <View style={styles.grid}>
        <StatCard title="Dioceses" value={stats?.dioceses} icon="account-balance" color={COLORS.primary} />
        <StatCard title="Deaneries" value={stats?.deaneries} icon="business" color={COLORS.secondary} />
        <StatCard title="Parishes" value={stats?.parishes} icon="church" color={COLORS.accent} />
        <StatCard title="Wards" value={stats?.wards} icon="map" color="#8B5CF6" />
        <StatCard title="Families" value={stats?.families} icon="family-restroom" color="#EC4899" />
        <StatCard title="Members" value={stats?.members} icon="groups" color="#14B8A6" />
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginTop: 4,
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: COLORS.error + '15',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: COLORS.surface,
    width: '46%',
    marginHorizontal: '2%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardContent: {
    marginTop: 4,
  },
  cardTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  }
});
