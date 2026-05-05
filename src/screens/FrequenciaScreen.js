import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FrequenciaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Frequência</Text>
      <Text style={styles.subtext}>Resumo de presenças e faltas.</Text>
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
