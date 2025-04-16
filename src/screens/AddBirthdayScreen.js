import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BirthdayContext } from '../context/BirthdayContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function AddBirthdayScreen({ navigation }) {
  const { addBirthday } = useContext(BirthdayContext);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [acquisitionMonth, setAcquisitionMonth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
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
      const result = await addBirthday({
        name,
        birthday_date: date.toISOString(),
        location,
        phone,
        area: area,
        acquisition_month: acquisitionMonth,
      });

      if (!result) {
        throw new Error('No se pudo guardar el recordatorio');
      }

      Alert.alert(
        '¡Éxito!',
        'Recordatorio guardado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.getParent()?.navigate('Home');
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el recordatorio');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre del propietario"
              placeholderTextColor="#FFFFFF80"
              value={name}
              onChangeText={setName}
              autoComplete="off"
              textContentType="none"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha</Text>
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
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChange}
              textColor="#FFFFFF"
              locale="es-ES"
              style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Dirección"
              placeholderTextColor="#FFFFFF80"
              value={location}
              onChangeText={setLocation}
              autoComplete="off"
              textContentType="fullStreetAddress"
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Número de teléfono"
              placeholderTextColor="#FFFFFF80"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="off"
              textContentType="telephoneNumber"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Área construida</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#FFFFFF80" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Área en m²"
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
              placeholder="Mes de adquisición"
              placeholderTextColor="#FFFFFF80"
              value={acquisitionMonth}
              onChangeText={setAcquisitionMonth}
              autoComplete="off"
              textContentType="none"
              autoCapitalize="words"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { opacity: isSaving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar</Text>
          )}
        </TouchableOpacity>
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
  datePickerIOS: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 