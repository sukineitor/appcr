import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const configurePushNotifications = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export const scheduleReminderNotification = async (birthday) => {
  // Notificación para el día anterior al cumpleaños
  const birthdayDate = new Date(birthday.birthday_date);
  const now = new Date();
  
  // Configurar para el próximo cumpleaños
  const nextBirthday = new Date(birthdayDate);
  nextBirthday.setFullYear(now.getFullYear());
  
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  
  // Configurar la notificación para el día anterior
  const reminderDate = new Date(nextBirthday);
  reminderDate.setDate(reminderDate.getDate() - 1);
  reminderDate.setHours(9, 0, 0); // Notificar a las 9 AM

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Recordatorio de cumpleaños!',
      body: `Mañana es el cumpleaños de ${birthday.name}`,
      data: { birthdayId: birthday.id },
    },
    trigger: {
      date: reminderDate,
    },
  });
};

export const showNewReminderNotification = async (birthday) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nuevo recordatorio agregado',
      body: `Se ha agregado el recordatorio para ${birthday.name}`,
    },
    trigger: null, // Mostrar inmediatamente
  });
};

export const showUpdatedReminderNotification = async (birthday) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio actualizado',
      body: `Se ha actualizado el recordatorio de ${birthday.name}`,
    },
    trigger: null, // Mostrar inmediatamente
  });
};

export const showLoginNotification = async (email) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Bienvenido!',
      body: `Has iniciado sesión como ${email}`,
    },
    trigger: null, // Mostrar inmediatamente
  });
};

export const programarNotificacion = async (recordatorio) => {
  try {
    const notificaciones = [];
    const fechaRecordatorio = new Date(recordatorio.birthday_date);
    const ahora = new Date();
    
    // Calcular los días hasta el recordatorio
    const diasHastaRecordatorio = getDaysUntilBirthday(recordatorio.birthday_date);
    
    // Si la fecha ya pasó, no programamos notificaciones
    if (diasHastaRecordatorio < 0) {
      return null;
    }

    // Programar notificación diaria que verifica los próximos recordatorios
    const notificacionDiaria = await Notifications.scheduleNotificationAsync({
      content: {
        title: '¡Recordatorio!',
        body: `${diasHastaRecordatorio === 0 ? 
          '¡Hoy' : 
          diasHastaRecordatorio === 1 ? 
          '¡Mañana' : 
          `¡En ${diasHastaRecordatorio} días`} es el recordatorio de ${recordatorio.name}!`,
        data: { recordatorioId: recordatorio.id },
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
    
    notificaciones.push(notificacionDiaria);
    
    return notificaciones.join(',');
  } catch (error) {
    console.error('Error al programar notificación:', error);
    return null;
  }
};

// Función para verificar y reprogramar todas las notificaciones
export const verificarYReprogramarNotificaciones = async (recordatorios) => {
  try {
    // Cancelar todas las notificaciones existentes
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Reprogramar notificaciones para cada recordatorio
    for (const recordatorio of recordatorios) {
      await programarNotificacion(recordatorio);
    }
  } catch (error) {
    console.error('Error al reprogramar notificaciones:', error);
  }
};

export const cancelarNotificacion = async (identificadores) => {
  try {
    if (!identificadores) return;
    
    // Separar los IDs y cancelar cada notificación
    const ids = identificadores.split(',');
    for (const id of ids) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  } catch (error) {
    console.error('Error al cancelar notificación:', error);
  }
};

export const getDaysUntilBirthday = (birthdayDate) => {
  const today = new Date();
  const birthday = new Date(birthdayDate);
  
  // Establecer la hora a medianoche para comparar solo fechas
  today.setHours(0, 0, 0, 0);
  birthday.setHours(0, 0, 0, 0);

  // Obtener el año actual
  const currentYear = today.getFullYear();
  
  // Crear fecha del cumpleaños para este año
  const thisYearBirthday = new Date(birthday);
  thisYearBirthday.setFullYear(currentYear);
  
  // Si el cumpleaños de este año ya pasó, calcular para el próximo año
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(currentYear + 1);
  }
  
  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getColorByDays = (days) => {
  if (days === 0) {
    return '#007AFF'; // Azul para hoy
  } else if (days >= 1 && days <= 5) {
    return '#FF3B30'; // Rojo para 1-5 días
  } else if (days >= 6 && days <= 10) {
    return '#FF9500'; // Anaranjado para 6-10 días
  } else {
    return '#34C759'; // Verde para 11+ días
  }
}; 