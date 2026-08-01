import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

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
    
    if (id) {
      fetchMember();
    }
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

  const Sacraments = () => (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Sacraments</Text>
      <View style={styles.sacramentRow}>
        <MaterialIcons name={member.baptism_received ? "check-circle" : "cancel"} size={20} color={member.baptism_received ? COLORS.success : COLORS.error} />
        <Text style={styles.sacramentText}>Baptism {member.baptism_date ? `(${member.baptism_date})` : ''}</Text>
      </View>
      <View style={styles.sacramentRow}>
        <MaterialIcons name={member.communion_received ? "check-circle" : "cancel"} size={20} color={member.communion_received ? COLORS.success : COLORS.error} />
        <Text style={styles.sacramentText}>Communion {member.communion_date ? `(${member.communion_date})` : ''}</Text>
      </View>
      <View style={styles.sacramentRow}>
        <MaterialIcons name={member.confirmation_received ? "check-circle" : "cancel"} size={20} color={member.confirmation_received ? COLORS.success : COLORS.error} />
        <Text style={styles.sacramentText}>Confirmation {member.confirmation_date ? `(${member.confirmation_date})` : ''}</Text>
      </View>
      <View style={styles.sacramentRow}>
        <MaterialIcons name={member.marriage_received ? "check-circle" : "cancel"} size={20} color={member.marriage_received ? COLORS.success : COLORS.error} />
        <Text style={styles.sacramentText}>Marriage {member.marriage_date ? `(${member.marriage_date})` : ''}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{member.first_name[0]}{member.last_name[0]}</Text>
        </View>
        <Text style={styles.title}>{member.first_name} {member.last_name}</Text>
        <Text style={styles.roleBadge}>{member.role || 'Laity'}</Text>
        <Text style={styles.detailText}>{member.phone || 'No Phone'}</Text>
        <Text style={styles.detailText}>{member.email || 'No Email'}</Text>
        <Text style={styles.detailText}>DOB: {member.dob || 'Unknown'}</Text>
      </View>

      <View style={styles.content}>
        <Sacraments />
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
    backgroundColor: COLORS.primary,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    color: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailText: {
    color: COLORS.surface,
    opacity: 0.9,
    fontSize: SIZES.md,
    marginBottom: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  cardHeader: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  sacramentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sacramentText: {
    marginLeft: 12,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 20,
  }
});
