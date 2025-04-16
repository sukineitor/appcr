import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import * as Notifications from 'expo-notifications';
import { AuthContext } from './AuthContext';

export const BirthdayContext = createContext();

export const BirthdayProvider = ({ children }) => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchBirthdays = async () => {
    try {
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .eq('user_id', user.id)
        .order('birthday_date', { ascending: true });

      if (error) throw error;

      const birthdaysWithNotifications = await Promise.all(
        data.map(async (birthday) => {
          const daysUntilBirthday = calculateDaysUntilBirthday(birthday.birthday_date);
          const notificationStatus = getNotificationStatus(daysUntilBirthday);
          
          return {
            ...birthday,
            notification_status: notificationStatus,
          };
        })
      );

      setBirthdays(birthdaysWithNotifications);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBirthdays();
      const subscription = supabase
        .channel('birthdays_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'birthdays' }, () => {
          fetchBirthdays();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const calculateDaysUntilBirthday = (birthdayDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const birthday = new Date(birthdayDate);
    const currentYear = today.getFullYear();
    birthday.setFullYear(currentYear);
    
    // Si la fecha ya pasó este año, usar el próximo año
    if (birthday < today) {
      birthday.setFullYear(currentYear + 1);
    }
    
    birthday.setHours(0, 0, 0, 0);
    const diffTime = birthday - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getNotificationStatus = (daysUntilBirthday) => {
    if (daysUntilBirthday === 0) return 'today';
    if (daysUntilBirthday === 1) return 'tomorrow';
    if (daysUntilBirthday === 5) return 'five_days';
    if (daysUntilBirthday === 10) return 'ten_days';
    return 'none';
  };

  const scheduleNotification = async (birthday, daysUntilBirthday) => {
    if (daysUntilBirthday < 0 || daysUntilBirthday > 10) return;

    const notificationStatus = getNotificationStatus(daysUntilBirthday);
    if (notificationStatus === 'none') return;

    const notificationId = `birthday_${birthday.id}_${notificationStatus}`;
    
    let message = '';
    switch (notificationStatus) {
      case 'today':
        message = `¡Hoy es el cumpleaños de ${birthday.name}! 🎉`;
        break;
      case 'tomorrow':
        message = `¡Mañana es el cumpleaños de ${birthday.name}!`;
        break;
      case 'five_days':
        message = `¡Faltan 5 días para el cumpleaños de ${birthday.name}!`;
        break;
      case 'ten_days':
        message = `¡Faltan 10 días para el cumpleaños de ${birthday.name}!`;
        break;
      default:
        return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Recordatorio de Cumpleaños',
          body: message,
          sound: true,
        },
        trigger: {
          seconds: 1,
        },
        identifier: notificationId,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const addBirthday = async (birthdayData) => {
    try {
      const { data, error } = await supabase
        .from('birthdays')
        .insert([{ ...birthdayData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      const daysUntilBirthday = calculateDaysUntilBirthday(birthdayData.birthday_date);
      await scheduleNotification(data, daysUntilBirthday);

      setBirthdays([...birthdays, data]);
      return data;
    } catch (error) {
      console.error('Error adding birthday:', error);
      throw error;
    }
  };

  const updateBirthday = async (id, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('birthdays')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const daysUntilBirthday = calculateDaysUntilBirthday(updatedData.birthday_date);
      await scheduleNotification(data, daysUntilBirthday);

      setBirthdays(birthdays.map(b => b.id === id ? data : b));
      return data;
    } catch (error) {
      console.error('Error updating birthday:', error);
      throw error;
    }
  };

  const deleteBirthday = async (id) => {
    try {
      const { error } = await supabase
        .from('birthdays')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBirthdays(birthdays.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting birthday:', error);
      throw error;
    }
  };

  return (
    <BirthdayContext.Provider value={{
      birthdays,
      loading,
      fetchBirthdays,
      addBirthday,
      updateBirthday,
      deleteBirthday,
    }}>
      {children}
    </BirthdayContext.Provider>
  );
}; 