import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../../src/api/client';
import { COLORS, SIZES, SHADOWS } from '../../../src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function FamiliesScreen() {
  const [families, setFamilies] = useState([]);
  const [filteredFamilies, setFilteredFamilies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await apiClient.get('/api/families');
        setFamilies(response.data);
        setFilteredFamilies(response.data);
      } catch (error) {
        console.error('Failed to fetch families', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (!text.trim()) {
      setFilteredFamilies(families);
      return;
    }
    const q = text.toLowerCase();
    const filtered = families.filter(f => 
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.head_name && f.head_name.toLowerCase().includes(q)) ||
      (f.parish_name && f.parish_name.toLowerCase().includes(q))
    );
    setFilteredFamilies(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/(app)/families/${item.id}`)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name="family-restroom" size={22} color={COLORS.secondary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>Head: {item.head_name || 'N/A'}</Text>
        {item.parish_name ? (
          <Text style={styles.cardParish}>• {item.parish_name}</Text>
        ) : null}
      </View>
      <MaterialIcons name="chevron-right" size={22} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Streamlined Search Toolbar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.textLight} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search families..." 
            placeholderTextColor={COLORS.textLight} 
            value={search}
            onChangeText={handleSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="close" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredFamilies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Families Found</Text>
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
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  searchContainer: {
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
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
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
  cardSubtitle: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  cardParish: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: COLORS.textLight,
    fontSize: SIZES.sm,
  },
});
