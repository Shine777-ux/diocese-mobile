import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import apiClient, { BASE_URL } from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function MembersScreen() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchMembers = async (searchQuery = '') => {
    setLoading(true);
    try {
      const url = searchQuery ? `/api/members?search=${encodeURIComponent(searchQuery)}` : '/api/members';
      const response = await apiClient.get(url);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = () => {
    fetchMembers(search);
  };

  const handleExport = async (format = 'excel') => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const exportUrl = `${BASE_URL}/api/export/members?format=${format}`;
      await WebBrowser.openBrowserAsync(exportUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) {
      Alert.alert('Export', 'Opening export download in browser...');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/(app)/members/${item.id}`)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.first_name} {item.last_name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.badgeText}>{item.role || 'Laity'}</Text>
          {item.parish_name ? (
            <Text style={styles.parishText} numberOfLines={1}>• {item.parish_name}</Text>
          ) : null}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search parishioners..." 
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('excel')}>
          <MaterialIcons name="file-download" size={20} color={COLORS.surface} />
          <Text style={styles.exportBtnText}>Excel</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Members Found within your scope</Text>
          }
        />
      )}
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 46,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: SIZES.md,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
    ...SHADOWS.small,
  },
  exportBtnText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: SIZES.xs,
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  parishText: {
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 6,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.textLight,
  },
});
