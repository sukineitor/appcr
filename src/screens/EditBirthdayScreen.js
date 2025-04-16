import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { BirthdayContext } from '../context/BirthdayContext';
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function EditBirthdayScreen({ route, navigation }) {
  const { birthday } = route.params;
  const { updateBirthday, deleteBirthday } = useContext(BirthdayContext);
  const { themeColor, textColor } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [name, setName] = useState(birthday.name);
  const [date, setDate] = useState(new Date(birthday.birthday_date));
  const [location, setLocation] = useState(birthday.location || '');
  const [phone, setPhone] = useState(birthday.phone || '');
  const [area, setArea] = useState(birthday.area ? birthday.area.toString() : '');
  const [acquisitionMonth, setAcquisitionMonth] = useState(birthday.acquisition_month || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Error', 'Por favor ingresa una ubicación');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono');
      return;
    }

    if (!area.trim()) {
      Alert.alert('Error', 'Por favor ingresa el área construida');
      return;
    }

    if (!acquisitionMonth.trim()) {
      Alert.alert('Error', 'Por favor ingresa el mes de adquisición');
      return;
    }

    setIsSaving(true);
    try {
      await updateBirthday(birthday.id, {
        name,
        birthday_date: date.toISOString(),
        location,
        phone,
        area: area,
        acquisition_month: acquisitionMonth,
      });
      
      Alert.alert(
        '¡Éxito!',
        'Recordatorio actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsSaving(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
              });
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Error', 'No se pudo actualizar el recordatorio. Por favor intenta de nuevo.');
      console.error('Error updating birthday:', error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteBirthday(birthday.id);
              setIsDeleting(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
              });
            } catch (error) {
              setIsDeleting(false);
              Alert.alert('Error', 'No se pudo eliminar el recordatorio');
              console.error('Error deleting birthday:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#1A1A1A' }]}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#FFFFFF80"
              value={name}
              onChangeText={setName}
              autoComplete="off"
              textContentType="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha de cumpleaños</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={showDatepicker}
          >
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ubicación"
              placeholderTextColor="#FFFFFF80"
              value={location}
              onChangeText={setLocation}
              autoComplete="off"
              textContentType="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Número de Teléfono"
              placeholderTextColor="#FFFFFF80"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="off"
              textContentType="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área construida</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Área Construida (m²)"
              placeholderTextColor="#FFFFFF80"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
              autoComplete="off"
              textContentType="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mes de adquisición</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mes de Adquisición"
              placeholderTextColor="#FFFFFF80"
              value={acquisitionMonth}
              onChangeText={setAcquisitionMonth}
              autoComplete="off"
              textContentType="none"
            />
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            textColor="#FFFFFF"
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { opacity: isSaving ? 0.7 : 1 }
            ]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.deleteButton,
              { opacity: isDeleting ? 0.7 : 1 }
            ]}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Eliminar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 