import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { BirthdayProvider } from './src/context/BirthdayContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddBirthdayScreen from './src/screens/AddBirthdayScreen';
import EditBirthdayScreen from './src/screens/EditBirthdayScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { navigationConfig } from './src/navigation/config';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={navigationConfig}>
      <Stack.Screen 
        name="Home" 
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
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={navigationConfig}>
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Configuración' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Recordatorios' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user } = React.useContext(AuthContext);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Stack.Navigator 
      screenOptions={{
        ...navigationConfig,
        headerStyle: {
          ...navigationConfig.headerStyle,
          backgroundColor: '#1A1A1A'
        },
        headerTintColor: '#FFFFFF',
        contentStyle: {
          backgroundColor: '#1A1A1A'
        }
      }}
    >
      {user ? (
        <Stack.Screen 
          name="MainApp" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <NavigationContainer>
      <AuthProvider>
        <BirthdayProvider>
          <StatusBar style="light" />
          <Navigation />
        </BirthdayProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
