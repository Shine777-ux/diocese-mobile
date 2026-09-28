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
      activeOpacity={0.7}
      onPress={() => router.push(`/(app)/members/${item.id}`)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={22} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.first_name} {item.last_name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.badgeText}>{item.role || 'Parishioner'}</Text>
          {item.parish_name ? (
            <Text style={styles.parishText} numberOfLines={1}>• {item.parish_name}</Text>
          ) : null}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Streamlined Single-Line Search & Export Toolbar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search parishioners..." 
            placeholderTextColor={COLORS.textLight} 
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={() => { setSearch(''); fetchMembers(''); }}>
              <MaterialIcons name="close" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('excel')}>
          <MaterialIcons name="file-download" size={16} color="#ffffff" />
          <Text style={styles.exportBtnText}>Excel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBtn, { marginLeft: 6, backgroundColor: COLORS.secondary }]} onPress={() => handleExport('csv')}>
          <MaterialIcons name="file-download" size={16} color="#ffffff" />
          <Text style={styles.exportBtnText}>CSV</Text>
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
            <Text style={styles.emptyText}>No Parishioners Found</Text>
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: SIZES.sm,
    color: COLORS.text,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    marginLeft: 8,
    ...SHADOWS.small,
  },
  exportBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 3,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
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
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  parishText: {
    fontSize: 10,
    color: COLORS.textLight,
    marginLeft: 4,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.textLight,
    fontSize: SIZES.sm,
  },
});
