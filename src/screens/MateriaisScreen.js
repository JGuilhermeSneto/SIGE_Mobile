import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MateriaisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Materiais</Text>
      <Text style={styles.subtext}>Arquivos e links de aula serão listados aqui.</Text>
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
