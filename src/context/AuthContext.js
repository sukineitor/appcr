import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await AsyncStorage.setItem('user', JSON.stringify(session.user));
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await AsyncStorage.setItem('user', JSON.stringify(session.user));
      } else {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const { data: { user: currentUser }, error } = await supabase.auth.getUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            await AsyncStorage.removeItem('user');
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
      await AsyncStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Error de autenticación:', error.message);
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        return { data };
      } else {
        return { 
          error: { 
            message: 'No se pudo obtener la información del usuario' 
          } 
        };
      }
    } catch (error) {
      console.log('Error inesperado en signIn:', error.message);
      return { 
        error: { 
          message: 'Error inesperado durante el inicio de sesión' 
        } 
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Registro Exitoso',
        'Por favor, verifica tu correo electrónico para activar tu cuenta.',
        [{ text: 'OK' }]
      );
      
      return data.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      signIn,
      signOut,
      signUp,
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 