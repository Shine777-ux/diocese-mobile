import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await apiClient.get(`/api/members/${id}`);
        setMember(response.data);
      } catch (error) {
        console.error('Failed to fetch member details', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMember();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Member not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerCard}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.name}>{member.first_name} {member.last_name}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleText}>{member.role || 'Parishioner'}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Information</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="church" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Parish:</Text>
            <Text style={styles.infoValue}>{member.parish_name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{member.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{member.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{member.dob || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="wc" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{member.gender || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sacramental Records</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="water-drop" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Baptism:</Text>
            <Text style={styles.infoValue}>{member.baptism_date || 'Registered'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="local-florist" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Holy Communion:</Text>
            <Text style={styles.infoValue}>{member.first_communion_date || 'Completed'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="verified" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Confirmation:</Text>
            <Text style={styles.infoValue}>{member.confirmation_date || 'Completed'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="favorite" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Marriage:</Text>
            <Text style={styles.infoValue}>{member.marriage_date || 'N/A'}</Text>
          </View>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  name: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  roleTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  infoLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginLeft: 8,
    width: 105,
  },
  infoValue: {
    fontSize: SIZES.xs,
    color: COLORS.text,
    flex: 1,
    fontWeight: '500',
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: SIZES.md,
  }
});
