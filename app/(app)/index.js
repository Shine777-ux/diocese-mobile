import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../src/constants/theme';
import apiClient from '../../src/api/client';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeInUp, FadeInRight } from '../../src/components/FadeInView';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, circularsRes] = await Promise.all([
        apiClient.get('/api/stats').catch(() => ({ data: null })),
        apiClient.get('/api/events').catch(() => ({ data: [] })),
        apiClient.get('/api/circulars').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes?.data);
      setEvents(eventsRes?.data || []);
      setCirculars(circularsRes?.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Safe stat count extraction
  const getCount = (key) => {
    if (!stats) return '...';
    if (stats.counts && stats.counts[key] !== undefined) return stats.counts[key];
    if (stats[key] !== undefined) return stats[key];
    return '0';
  };

  const getScopeDescription = () => {
    const role = (user?.role || '').toLowerCase();
    if (['admin', 'administrator'].includes(role)) return 'Diocese Administrator';
    if (role === 'bishop') return 'Diocese Bishop';
    if (role === 'dean') return `Dean (Deanery #${user?.deanery_id || 'Assigned'})`;
    return `${user?.role || 'Parishioner'} (Parish #${user?.parish_id || 'Assigned'})`;
  };

  const StatCard = ({ title, value, icon, gradient, index }) => (
    <FadeInRight delay={index * 80} duration={500} style={styles.cardWrapper}>
      <TouchableOpacity activeOpacity={0.85}>
        <LinearGradient colors={gradient} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons name={icon} size={26} color={COLORS.surface} />
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.7)" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </FadeInRight>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENTS.primary} style={styles.headerBackground} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.surface} />}
      >
        <FadeInUp duration={600} style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Hello, {user?.username || 'User'}</Text>
            <View style={styles.roleChip}>
              <MaterialIcons name="verified-user" size={14} color="#FEF3C7" style={{ marginRight: 4 }} />
              <Text style={styles.roleChipText}>{getScopeDescription()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <MaterialIcons name="logout" size={22} color={COLORS.surface} />
          </TouchableOpacity>
        </FadeInUp>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.grid}>
            <StatCard index={0} title="Dioceses" value={getCount('dioceses')} icon="account-balance" gradient={GRADIENTS.primary} />
            <StatCard index={1} title="Deaneries" value={getCount('deaneries')} icon="business" gradient={GRADIENTS.secondary} />
            <StatCard index={2} title="Parishes" value={getCount('parishes')} icon="church" gradient={['#06B6D4', '#3B82F6']} />
            <StatCard index={3} title="Members" value={getCount('members')} icon="groups" gradient={['#10B981', '#059669']} />
          </View>

          {/* Announcements & Pastoral Circulars */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pastoral Circulars & Notices</Text>
            <MaterialIcons name="campaign" size={24} color={COLORS.primary} />
          </View>
          {circulars.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No announcements posted yet.</Text>
            </View>
          ) : (
            circulars.slice(0, 3).map((c) => (
              <View key={c.id} style={styles.noticeCard}>
                <View style={styles.noticeTop}>
                  <View style={[styles.priorityBadge, c.priority === 'Important' ? styles.priorityImportant : styles.priorityNormal]}>
                    <Text style={styles.priorityText}>{c.priority || 'Notice'}</Text>
                  </View>
                  <Text style={styles.noticeDate}>{c.publish_date}</Text>
                </View>
                <Text style={styles.noticeTitle}>{c.title}</Text>
                <Text style={styles.noticeContent} numberOfLines={3}>{c.content}</Text>
                <Text style={styles.noticeAuthor}>— {c.author || 'Chancery Office'}</Text>
              </View>
            ))
          )}

          {/* Upcoming Events & Masses */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming Events & Masses</Text>
            <MaterialIcons name="event" size={24} color={COLORS.primary} />
          </View>
          {events.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>No upcoming events scheduled.</Text>
            </View>
          ) : (
            events.slice(0, 3).map((e) => (
              <View key={e.id} style={styles.eventCard}>
                <View style={styles.eventDateBox}>
                  <MaterialIcons name="schedule" size={20} color={COLORS.primary} />
                  <Text style={styles.eventType}>{e.event_type || 'Event'}</Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <Text style={styles.eventTime}>{e.start_time} {e.location ? `• ${e.location}` : ''}</Text>
                  {e.parish_name ? <Text style={styles.eventParish}>{e.parish_name}</Text> : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    borderBottomLeftRadius: SIZES.radius.xl,
    borderBottomRightRadius: SIZES.radius.xl,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 55,
    marginBottom: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.surface,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleChipText: {
    fontSize: SIZES.xs,
    color: COLORS.surface,
    fontWeight: '700',
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radius.md,
  },
  contentSection: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.radius.xl,
    borderTopRightRadius: SIZES.radius.xl,
    paddingTop: 20,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
    ...SHADOWS.medium,
  },
  card: {
    borderRadius: SIZES.radius.lg,
    padding: 16,
    height: 125,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginTop: 'auto',
  },
  cardTitle: {
    fontSize: SIZES.xs,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginTop: 2,
  },
  cardValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  noticeCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    ...SHADOWS.small,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  noticeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityImportant: {
    backgroundColor: '#FEE2E2',
  },
  priorityNormal: {
    backgroundColor: '#E0E7FF',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noticeDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  noticeTitle: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  noticeContent: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  noticeAuthor: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.textLight,
    marginTop: 6,
    textAlign: 'right',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  eventDateBox: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: 10,
    marginRight: 12,
  },
  eventType: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  eventTime: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginTop: 2,
  },
  eventParish: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyCardText: {
    color: COLORS.textLight,
    fontSize: SIZES.sm,
  }
});
