import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AtividadesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Atividades</Text>
      <Text style={styles.subtext}>Aqui o aluno verá as atividades e provas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  }
});
