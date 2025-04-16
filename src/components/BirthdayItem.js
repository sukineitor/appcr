import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const BirthdayItem = ({ birthday, onPress }) => {
  const { textColor } = useTheme();

  const getDaysUntilBirthday = (birthdayDate) => {
    const today = new Date();
    const birthday = new Date(birthdayDate);
    
    // Comparar solo mes y día
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const birthMonth = birthday.getMonth();
    const birthDay = birthday.getDate();
    
    // Si es hoy
    if (todayMonth === birthMonth && todayDay === birthDay) {
      return 0;
    }
    
    // Para calcular días restantes
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(birthdayDate);
    nextBirthday.setFullYear(currentYear);
    
    // Si ya pasó este año, usar el próximo
    if (nextBirthday < today) {
      nextBirthday.setFullYear(currentYear + 1);
    }
    
    const diffTime = nextBirthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getColorByDays = (days) => {
    if (days === 0) return '#FF3B30'; // Hoy
    if (days === 1) return '#FF9500'; // Mañana
    if (days <= 5) return '#FFCC00'; // 5 días
    if (days <= 10) return '#34C759'; // 10 días
    return '#007AFF'; // Más de 10 días
  };

  const date = new Date(birthday.birthday_date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const daysUntil = getDaysUntilBirthday(birthday.birthday_date);
  const statusColor = getColorByDays(daysUntil);
  
  let daysText = '';
  if (daysUntil === 0) {
    daysText = '¡Hoy!';
  } else if (daysUntil === 1) {
    daysText = '¡Mañana!';
  } else if (daysUntil > 0) {
    daysText = `Faltan ${daysUntil} días`;
  } else {
    daysText = 'Ya pasó';
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: 'rgba(255,255,255,0.1)' },
        { borderLeftWidth: 5, borderLeftColor: statusColor }
      ]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: statusColor + '40' }]}>
            <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
              {birthday.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.name, { color: '#FFFFFF' }]}>{birthday.name}</Text>
            <Text style={[styles.date, { color: '#FFFFFF80' }]}>{formattedDate}</Text>
            <Text style={[styles.daysUntil, { color: statusColor }]}>{daysText}</Text>
          </View>
        </View>
        
        {birthday.location && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#FFFFFF80" />
            <Text style={[styles.detailText, { color: '#FFFFFF80' }]}>{birthday.location}</Text>
          </View>
        )}
        
        {birthday.phone && (
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color="#FFFFFF80" />
            <Text style={[styles.detailText, { color: '#FFFFFF80' }]}>{birthday.phone}</Text>
          </View>
        )}

        {birthday.area && (
          <View style={styles.detailRow}>
            <Ionicons name="home-outline" size={16} color="#FFFFFF80" />
            <Text style={[styles.detailText, { color: '#FFFFFF80' }]}>
              {birthday.area} m²
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  daysUntil: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default BirthdayItem; 