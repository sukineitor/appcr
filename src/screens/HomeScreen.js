import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BirthdayContext } from '../context/BirthdayContext';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getDaysUntilBirthday, getColorByDays } from '../services/NotificationService';
import BirthdayItem from '../components/BirthdayItem';

const { width } = Dimensions.get('window');

const FILTERS = [
  { id: 'all', label: 'Todos', icon: 'calendar-outline' },
  { id: 'today', label: 'Hoy', icon: 'today-outline' },
  { id: 'tomorrow', label: 'Mañana', icon: 'time-outline' },
  { id: 'week', label: 'Esta Semana', icon: 'calendar-outline' },
];

export default function HomeScreen({ navigation }) {
  const { birthdays, fetchBirthdays, loading } = useContext(BirthdayContext);
  const { user } = useContext(AuthContext);
  const { themeColor, textColor } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    if (user) {
      try {
        await fetchBirthdays();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
  };

  const getFilteredBirthdays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return birthdays
      .map(birthday => {
        const birthdayDate = new Date(birthday.birthday_date);
        const currentYear = today.getFullYear();
        
        // Ajustar el año para la fecha del cumpleaños
        birthdayDate.setFullYear(currentYear);
        if (birthdayDate < today) {
          birthdayDate.setFullYear(currentYear + 1);
        }
        
        const diffTime = birthdayDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          ...birthday,
          daysUntil: diffDays
        };
      })
      .filter(birthday => {
        switch (selectedFilter) {
          case 'today':
            return birthday.daysUntil === 0;
          case 'tomorrow':
            return birthday.daysUntil === 1;
          case 'week':
            return birthday.daysUntil >= 0 && birthday.daysUntil <= 7;
          default:
            return true;
        }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const renderFilterButton = (filter) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        selectedFilter === filter.id && styles.selectedFilter,
        { backgroundColor: selectedFilter === filter.id ? '#007AFF' : 'rgba(255,255,255,0.1)' }
      ]}
      onPress={() => setSelectedFilter(filter.id)}
    >
      <Ionicons 
        name={filter.icon} 
        size={16} 
        color={selectedFilter === filter.id ? '#FFFFFF' : '#FFFFFF80'} 
      />
      <Text style={[
        styles.filterText,
        { color: selectedFilter === filter.id ? '#FFFFFF' : '#FFFFFF80' }
      ]}>
        {filter.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#FFFFFF80" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar recordatorio..."
          placeholderTextColor="#FFFFFF80"
          value={searchQuery}
          onChangeText={setSearchQuery}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.selectedFilter,
              { backgroundColor: selectedFilter === filter.id ? '#007AFF' : 'rgba(255,255,255,0.1)' }
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Ionicons 
              name={filter.icon} 
              size={16} 
              color={selectedFilter === filter.id ? '#FFFFFF' : '#FFFFFF80'} 
            />
            <Text style={[
              styles.filterText,
              { color: selectedFilter === filter.id ? '#FFFFFF' : '#FFFFFF80' }
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {getFilteredBirthdays().length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="calendar-outline" size={80} color="#FFFFFF80" />
          </View>
          <Text style={styles.emptyText}>
            No hay cumpleaños para mostrar
          </Text>
          <Text style={styles.emptySubtext}>
            Toca el botón + para agregar uno nuevo
          </Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredBirthdays()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BirthdayItem
              birthday={item}
              onPress={() => navigation.navigate('EditBirthday', { birthday: item })}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddBirthday')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 15,
    width: (width - 32) / 4 - 10,
    justifyContent: 'center',
  },
  selectedFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#FFFFFF80',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 