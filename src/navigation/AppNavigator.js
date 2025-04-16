import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddBirthdayScreen from '../screens/AddBirthdayScreen';
import EditBirthdayScreen from '../screens/EditBirthdayScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    height: 60
  },
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontWeight: '600',
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
};

const HomeStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      ...screenOptions,
      headerStyle: {
        ...screenOptions.headerStyle,
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    }}>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ title: 'Recordatorios' }}
      />
      <Stack.Screen 
        name="AddBirthday" 
        component={AddBirthdayScreen}
        options={{ title: 'Agregar Recordatorio' }}
      />
      <Stack.Screen 
        name="EditBirthday" 
        component={EditBirthdayScreen}
        options={{ title: 'Editar Recordatorio' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      ...screenOptions,
      headerStyle: {
        ...screenOptions.headerStyle,
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    }}>
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{
      ...screenOptions,
      headerStyle: {
        ...screenOptions.headerStyle,
        backgroundColor: colors.background,
      },
      headerTintColor: colors.text,
    }}>
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Registro' }}
      />
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={36} color="#0000ff" />
      </View>
    );
  }

  return user ? <TabNavigator /> : <AuthStack />;
} 