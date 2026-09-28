import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import apiClient, { BASE_URL } from '../../../src/api/client';
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

  const handleDownloadCertificate = async (certType) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const url = `${BASE_URL}/api/members/${id}/certificate/${certType}`;
      await WebBrowser.openBrowserAsync(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      Alert.alert('Certificate', 'Opening certificate PDF...');
    }
  };

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
        <Text style={styles.emptyText}>Member not found or outside your authorized parish scope.</Text>
      </View>
    );
  }

  const SacramentItem = ({ title, received, date, certType }) => (
    <View style={styles.sacramentItem}>
      <View style={styles.sacramentLeft}>
        <MaterialIcons 
          name={received ? "check-circle" : "radio-button-unchecked"} 
          size={22} 
          color={received ? COLORS.success : COLORS.textLight} 
        />
        <View style={styles.sacramentTextContainer}>
          <Text style={styles.sacramentTitle}>{title}</Text>
          <Text style={styles.sacramentDate}>{received ? (date || 'Date not recorded') : 'Not Received'}</Text>
        </View>
      </View>
      {received ? (
        <TouchableOpacity 
          style={styles.certBtn} 
          onPress={() => handleDownloadCertificate(certType)}
        >
          <MaterialIcons name="print" size={16} color={COLORS.primary} />
          <Text style={styles.certBtnText}>Certificate</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(member.first_name?.[0] || '') + (member.last_name?.[0] || '')}
          </Text>
        </View>
        <Text style={styles.title}>{member.first_name} {member.last_name}</Text>
        <Text style={styles.roleBadge}>{member.role || 'Laity'}</Text>
        
        {member.parish_name ? (
          <View style={styles.headerChip}>
            <MaterialIcons name="church" size={14} color={COLORS.surface} style={{ marginRight: 4 }} />
            <Text style={styles.headerChipText}>{member.parish_name}</Text>
          </View>
        ) : null}

        <Text style={styles.detailText}>{member.phone || 'No Phone'}</Text>
        <Text style={styles.detailText}>{member.email || 'No Email'}</Text>
        <Text style={styles.detailText}>DOB: {member.dob || 'Unknown'}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Sacramental Records & Certificates</Text>
          <SacramentItem 
            title="Holy Baptism" 
            received={member.baptism_received} 
            date={member.baptism_date}
            certType="baptism" 
          />
          <SacramentItem 
            title="First Holy Communion" 
            received={member.communion_received} 
            date={member.communion_date}
            certType="communion" 
          />
          <SacramentItem 
            title="Confirmation" 
            received={member.confirmation_received} 
            date={member.confirmation_date}
            certType="confirmation" 
          />
          <SacramentItem 
            title="Holy Matrimony" 
            received={member.marriage_received} 
            date={member.marriage_date}
            certType="marriage" 
          />
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
    padding: 20,
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
    marginBottom: 12,
  },
  avatarText: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 6,
  },
  roleBadge: {
    backgroundColor: COLORS.accent,
    color: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  headerChipText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  detailText: {
    color: COLORS.surface,
    opacity: 0.9,
    fontSize: SIZES.sm,
    marginBottom: 2,
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
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  sacramentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sacramentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sacramentTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sacramentTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  sacramentDate: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  certBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  certBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: SIZES.md,
  }
});
