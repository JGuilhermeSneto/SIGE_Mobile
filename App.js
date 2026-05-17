import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  createDrawerNavigator, 
  DrawerContentScrollView, 
  DrawerItemList,
  DrawerItem 
} from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Importando as telas
import HomeScreen from './src/screens/HomeScreen';
import RoteiroScreen from './src/screens/RoteiroScreen';
import MateriaisScreen from './src/screens/MateriaisScreen';
import FrequenciaScreen from './src/screens/FrequenciaScreen';
import NotasScreen from './src/screens/NotasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';

const COLORS = {
  bgBase: '#090e1a',
  bgSurface: '#0f1729',
  bgElevated: '#131e33',
  accentViolet: '#7c6fff',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 18 }}>📖</Text>
          </View>
          <Text style={styles.logoText}>SIGE</Text>
        </View>
        <Text style={styles.versionText}>v3.0.4 - Mobile</Text>
      </View>

      <View style={styles.drawerDivider} />

      <DrawerItemList {...props} />

      <View style={styles.drawerDivider} />
      
      <DrawerItem
        label="Sair da Conta"
        labelStyle={{ color: '#f87171', fontWeight: '700' }}
        icon={({ color, size }) => <MaterialCommunityIcons name="logout" color="#f87171" size={size} />}
        onPress={() => props.navigation.replace('Login')}
      />
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.bgSurface,
          width: 280,
        },
        drawerActiveBackgroundColor: 'rgba(124, 111, 255, 0.1)',
        drawerActiveTintColor: COLORS.accentViolet,
        drawerInactiveTintColor: COLORS.textSecondary,
        drawerLabelStyle: {
          fontWeight: '700',
          marginLeft: -10,
        }
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Painel Inicial',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
        }}
      />
      <Drawer.Screen 
        name="Roteiro" 
        component={RoteiroScreen} 
        options={{
          title: 'Trilha Educacional',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker-path" color={color} size={size} />
        }}
      />
      <Drawer.Screen 
        name="Frequencia" 
        component={FrequenciaScreen} 
        options={{
          title: 'Frequência',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-check-outline" color={color} size={size} />
        }}
      />
      <Drawer.Screen 
        name="Notas" 
        component={NotasScreen} 
        options={{
          title: 'Notas e Médias',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="chart-box-outline" color={color} size={size} />
        }}
      />
      <Drawer.Screen 
        name="Materiais" 
        component={MateriaisScreen} 
        options={{
          title: 'Materiais de Aula',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="folder-open-outline" color={color} size={size} />
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{
          title: 'Meu Perfil',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} />
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: COLORS.bgSurface,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 30,
    marginBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  versionText: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginVertical: 15,
    marginHorizontal: 20,
  }
});
