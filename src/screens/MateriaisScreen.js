import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMateriais } from '../services/api';

const COLORS = {
  fundoPrincipal: "#050811",
  fundoCartao: "#0a0f1d",
  fundoCartao2: "#0d1526",
  roxo: "#4a4295",
  roxoClaro: "#6259b8",
  verde: "#00e673",
  cinza: "#475468",
  cinzaClaro: "#8896a8",
  branco: "#e8edf5",
  vermelho: "#e04040",
  borda: "rgba(255,255,255,0.06)",
  bordaRoxo: "rgba(74,66,149,0.28)",
};

export default function MateriaisScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMateriais = async () => {
    try {
      setIsLoading(true);
      const data = await getMateriais();
      setDisciplinas(data || []);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os materiais.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriais();
  }, []);

  const handleOpenUrl = (url) => {
    if (!url) {
      Alert.alert("Aviso", "URL do material não disponível.");
      return;
    }
    Linking.openURL(url).catch((err) => {
      console.error("Erro ao abrir URL:", err);
      Alert.alert("Erro", "Não foi possível abrir o link.");
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.tela, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="rgba(5,8,17,0.97)" />
        <ActivityIndicator size="large" color={COLORS.roxoClaro} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(5,8,17,0.97)" />
      
      {/* Barra superior */}
      <View style={styles.barraSuperior}>
        <View style={styles.logoEnvolto}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 18 }}>📖</Text>
          </View>
          <Text style={styles.logoTexto}>SIGE</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
      </View>

      <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={14} color={COLORS.cinzaClaro} />
          <Text style={styles.textoBotaoVoltar}>Voltar ao Painel</Text>
        </TouchableOpacity>

        <View style={styles.cabecalhoPagina}>
          <Text style={styles.tituloPagina}>
            Meus <Text style={styles.tituloPaginaDestaque}>Materiais de Aula</Text>
          </Text>
          <Text style={styles.subtituloPagina}>
            Consulte arquivos, links e referências postados por seus professores para suas disciplinas.
          </Text>
        </View>

        {error || disciplinas.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.cinzaClaro, fontSize: 13, textAlign: 'center' }}>
              {error || "Nenhum material de aula publicado."}
            </Text>
          </View>
        ) : (
          disciplinas.map((d) => (
            <View key={d.id} style={styles.cartaoDisciplina}>
              <View style={styles.cabecalhoDisciplina}>
                <Text style={styles.nomeDisciplina}>{d.nome}</Text>
                <View style={styles.etiquetaProfessor}>
                  <MaterialCommunityIcons name="account" size={11} color={COLORS.roxoClaro} />
                  <Text style={styles.textoProfessor} numberOfLines={1}>{d.professor}</Text>
                </View>
              </View>
              <View style={styles.corpoDisciplina}>
                {d.arquivos.map((arquivo, i) => (
                  <TouchableOpacity key={i} style={styles.itemArquivo} onPress={() => handleOpenUrl(arquivo.url)}>
                    <View style={styles.iconePdf}>
                      <MaterialCommunityIcons name={arquivo.tipo === "LINK" ? "link-variant" : "file-pdf-box"} size={20} color={COLORS.verde} />
                    </View>
                    <View style={styles.infoArquivo}>
                      <Text style={styles.nomeArquivo}>{arquivo.nome}</Text>
                      <Text style={styles.metaArquivo}>{arquivo.meta}</Text>
                      <Text style={styles.contagemArquivo}>
                        <MaterialCommunityIcons name="arrow-down" size={10} color={COLORS.verde} /> {arquivo.tipo === "LINK" ? "Acessar Link" : "Baixar arquivo"}
                      </Text>
                    </View>
                    <View style={styles.setaArquivo}>
                      <MaterialCommunityIcons name="chevron-right" size={14} color={COLORS.roxoClaro} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
        <View style={{height: 40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: COLORS.fundoPrincipal },
  barraSuperior: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: 'rgba(5,8,17,0.97)', borderBottomWidth: 1, borderBottomColor: COLORS.borda },
  logoEnvolto: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#131e33', alignItems: 'center', justifyContent: 'center' },
  logoTexto: { fontSize: 18, fontWeight: '700', color: COLORS.branco, letterSpacing: 3, textTransform: 'uppercase' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.vermelho, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  conteudo: { flex: 1 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 18, marginTop: 14, alignSelf: 'flex-start', paddingVertical: 7, paddingHorizontal: 14, backgroundColor: COLORS.fundoCartao, borderWidth: 1, borderColor: COLORS.borda, borderRadius: 8 },
  textoBotaoVoltar: { color: COLORS.cinzaClaro, fontSize: 12, fontWeight: '600' },
  cabecalhoPagina: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 14 },
  tituloPagina: { fontSize: 23, fontWeight: '700', color: COLORS.branco },
  tituloPaginaDestaque: { color: COLORS.roxoClaro },
  subtituloPagina: { fontSize: 12, color: COLORS.cinza, marginTop: 4, lineHeight: 18 },
  cartaoDisciplina: { marginHorizontal: 14, marginBottom: 14, borderRadius: 14, borderWidth: 1, borderColor: COLORS.borda, backgroundColor: COLORS.fundoCartao, overflow: 'hidden' },
  cabecalhoDisciplina: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.borda },
  nomeDisciplina: { fontSize: 13, fontWeight: '700', color: COLORS.roxoClaro, letterSpacing: 0.5, textTransform: 'uppercase' },
  etiquetaProfessor: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: "rgba(74,66,149,0.15)", borderWidth: 1, borderColor: COLORS.bordaRoxo, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, maxWidth: 180 },
  textoProfessor: { fontSize: 10, color: COLORS.cinzaClaro },
  corpoDisciplina: { paddingHorizontal: 16, paddingVertical: 12 },
  itemArquivo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.fundoCartao2, borderWidth: 1, borderColor: COLORS.borda, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8 },
  iconePdf: { width: 38, height: 44, backgroundColor: "rgba(0,230,115,0.1)", borderWidth: 1, borderColor: "rgba(0,230,115,0.25)", borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  infoArquivo: { flex: 1 },
  nomeArquivo: { fontSize: 13, fontWeight: '600', color: COLORS.branco },
  metaArquivo: { fontSize: 10, color: COLORS.cinza, marginTop: 2 },
  contagemArquivo: { fontSize: 10, color: COLORS.verde, marginTop: 4, fontWeight: '600' },
  setaArquivo: { width: 28, height: 28, backgroundColor: "rgba(74,66,149,0.2)", borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
