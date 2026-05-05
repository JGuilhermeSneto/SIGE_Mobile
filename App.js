import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importando as telas (que serão criadas a seguir)
import HomeScreen from './src/screens/HomeScreen';
import AtividadesScreen from './src/screens/AtividadesScreen';
import MateriaisScreen from './src/screens/MateriaisScreen';
import FrequenciaScreen from './src/screens/FrequenciaScreen';
import NotasScreen from './src/screens/NotasScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Painel do Aluno' }} 
        />
        <Stack.Screen 
          name="Atividades" 
          component={AtividadesScreen} 
          options={{ title: 'Minhas Atividades' }} 
        />
        <Stack.Screen 
          name="Materiais" 
          component={MateriaisScreen} 
          options={{ title: 'Materiais de Aula' }} 
        />
        <Stack.Screen 
          name="Frequencia" 
          component={FrequenciaScreen} 
          options={{ title: 'Minha Frequência' }} 
        />
        <Stack.Screen 
          name="Notas" 
          component={NotasScreen} 
          options={{ title: 'Minhas Notas' }} 
        />
        <Stack.Screen 
          name="Perfil" 
          component={PerfilScreen} 
          options={{ title: 'Meu Perfil' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
