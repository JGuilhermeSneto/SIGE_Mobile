import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [showLogoutFeedback, setShowLogoutFeedback] = useState(false);
  const feedbackFade = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.8)).current;

  const handleLogout = () => {
    navigation.replace('Splash', { 
      nextScreen: 'Login',
      message: 'Encerrando sessão segura'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <Text style={styles.header}>Menu</Text>
        
        <TouchableOpacity onPress={() => navigation.navigate('Frequencia')}>
          <Text style={styles.link}>Frequência</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Notas')}>
          <Text style={styles.link}>Notas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Atividades')}>
          <Text style={styles.link}>Atividades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Materiais')}>
          <Text style={styles.link}>Materiais</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Text style={styles.link}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Overlay mantido para manter a animação solicitada anteriormente */}
      {showLogoutFeedback && (
        <Animated.View style={[styles.feedbackOverlay, { opacity: feedbackFade }]}>
          <Animated.View style={[styles.feedbackBox, { transform: [{ scale: feedbackScale }] }]}>
            <View style={styles.feedbackIconWrap}>
              <MaterialCommunityIcons name="lock-reset" size={40} color="#f87171" />
            </View>
            <Text style={styles.feedbackMsg}>Encerrando Sessão</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  content: {
    flex: 1,
    marginTop: 50,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  link: {
    fontSize: 18,
    color: '#000',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutBtn: {
    marginTop: 40,
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  feedbackIconWrap: {
    marginBottom: 15,
  },
  feedbackMsg: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  }
});
