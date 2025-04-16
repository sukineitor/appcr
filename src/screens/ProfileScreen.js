import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { BirthdayContext } from '../context/BirthdayContext';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { birthdays } = useContext(BirthdayContext);
  const { themeColor, textColor } = useTheme();

  const stats = [
    {
      title: 'Recordatorios',
      value: birthdays.length,
      icon: 'calendar-outline',
    },
    {
      title: 'Miembro desde',
      value: new Date(user?.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      }),
      icon: 'time-outline',
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          {!user?.email_confirmed_at && (
            <View style={styles.verificationBadge}>
              <Ionicons name="warning-outline" size={16} color="#856404" />
              <Text style={styles.verificationText}>Email no verificado</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View 
            key={index} 
            style={styles.statCard}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={stat.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statValue}>
              {stat.value}
            </Text>
            <Text style={styles.statTitle}>
              {stat.title}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#007AFF' }]}>
                <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.menuItemText}>
                Ajustes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF80" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>
          Versión 1.2.7
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    marginLeft: 6,
    color: '#856404',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#FFFFFF80',
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#2A2A2A',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#FFFFFF80',
  },
}); 