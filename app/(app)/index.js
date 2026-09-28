import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES, SHADOWS, GRADIENTS } from '../../src/constants/theme';
import apiClient from '../../src/api/client';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, circularsRes, programsRes] = await Promise.all([
        apiClient.get('/api/stats').catch(() => ({ data: null })),
        apiClient.get('/api/events').catch(() => ({ data: [] })),
        apiClient.get('/api/circulars').catch(() => ({ data: [] })),
        apiClient.get('/api/programs').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes?.data);
      setEvents(eventsRes?.data || []);
      setCirculars(circularsRes?.data || []);
      setPrograms(programsRes?.data || []);
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

  const getCount = (key) => {
    if (!stats) return '0';
    if (stats.counts && stats.counts[key] !== undefined) return String(stats.counts[key]);
    if (stats[key] !== undefined) return String(stats[key]);
    return '0';
  };

  const getScopeDescription = () => {
    if (!user) return '';
    const role = (user.role || 'user').toUpperCase();
    if (user.diocese_name) return `${role} • ${user.diocese_name}`;
    if (user.parish_name) return `${role} • ${user.parish_name}`;
    return role;
  };

  const statCards = [
    { title: 'Dioceses', value: getCount('dioceses'), icon: 'account-balance', gradient: ['#0284c7', '#0369a1'] },
    { title: 'Deaneries', value: getCount('deaneries'), icon: 'business', gradient: ['#2563eb', '#1d4ed8'] },
    { title: 'Parishes', value: getCount('parishes'), icon: 'church', gradient: ['#0d9488', '#0f766e'] },
    { title: 'Families', value: getCount('families'), icon: 'family-restroom', gradient: ['#4f46e5', '#3730a3'] },
    { title: 'Parishioners', value: getCount('members') !== '0' ? getCount('members') : getCount('parishioners'), icon: 'groups', gradient: ['#059669', '#047857'] },
    { title: 'Commissions', value: '18', icon: 'extension', gradient: ['#7c3aed', '#6d28d9'] },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Streamlined Top User Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>Welcome, {user?.name || user?.username || 'User'}</Text>
            <View style={styles.roleChip}>
              <MaterialIcons name="verified-user" size={13} color={COLORS.primary} style={{ marginRight: 4 }} />
              <Text style={styles.roleChipText}>{getScopeDescription()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <MaterialIcons name="logout" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Stat Cards Grid */}
        <View style={styles.grid}>
          {statCards.map((sc, idx) => (
            <View key={idx} style={styles.cardWrapper}>
              <LinearGradient colors={sc.gradient} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name={sc.icon} size={22} color="#ffffff" />
                  </View>
                  <Text style={styles.cardValue}>{sc.value}</Text>
                </View>
                <Text style={styles.cardTitle}>{sc.title}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Diocesan Programs & Competitions (18 Commissions) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Diocesan Programs & Competitions</Text>
          <MaterialIcons name="emoji-events" size={22} color={COLORS.primary} />
        </View>
        {programs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No diocesan programs currently active.</Text>
          </View>
        ) : (
          programs.slice(0, 3).map((p) => (
            <View key={p.id} style={styles.programCard}>
              <View style={styles.programHeader}>
                <View style={styles.commissionTag}>
                  <Text style={styles.commissionTagText}>{p.commission_name || 'Pastoral Commission'}</Text>
                </View>
                <Text style={styles.programLevel}>{p.level ? `${p.level.toUpperCase()} LEVEL` : 'DIOCESAN'}</Text>
              </View>
              <Text style={styles.programTitle}>{p.title}</Text>
              <Text style={styles.programDesc} numberOfLines={2}>{p.description}</Text>
              <View style={styles.programMetaRow}>
                <MaterialIcons name="event" size={14} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={styles.programDate}>{p.start_date || 'Ongoing'} {p.venue ? `• ${p.venue}` : ''}</Text>
              </View>
            </View>
          ))
        )}

        {/* Announcements & Pastoral Circulars */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Pastoral Circulars & Notices</Text>
          <MaterialIcons name="campaign" size={22} color={COLORS.primary} />
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
          <MaterialIcons name="event" size={22} color={COLORS.primary} />
        </View>
        {events.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No upcoming events scheduled.</Text>
          </View>
        ) : (
          events.slice(0, 3).map((e) => (
            <View key={e.id} style={styles.eventCard}>
              <View style={styles.eventDateBox}>
                <MaterialIcons name="schedule" size={18} color={COLORS.primary} />
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 45,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: '#ffffff',
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  roleChipText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
  },
  logoutBtn: {
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 14,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 10,
    ...SHADOWS.small,
  },
  card: {
    borderRadius: 14,
    padding: 12,
    height: 95,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  programCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.small,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commissionTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  commissionTagText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  programLevel: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  programTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  programDesc: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 16,
    marginBottom: 6,
  },
  programMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  programDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  noticeCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    ...SHADOWS.small,
  },
  noticeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityImportant: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  priorityNormal: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 3,
  },
  noticeContent: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  noticeAuthor: {
    fontSize: 10,
    fontStyle: 'italic',
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  eventDateBox: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: 8,
    marginRight: 10,
  },
  eventType: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  eventTime: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 2,
  },
  eventParish: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyCardText: {
    color: COLORS.textLight,
    fontSize: 11,
  }
});
