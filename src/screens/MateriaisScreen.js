import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Linking, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMateriais } from '../services/api';

const COLORS = {
  bgBase: '#090e1a',
  bgSurface: '#0f1729',
  bgElevated: '#131e33',
  bgHover: '#1a2844',
  accentViolet: '#7c6fff',
  accentCyan: '#22d3ee',
  accentEmerald: '#34d399',
  accentAmber: '#fbbf24',
  accentRuby: '#f87171',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderMid: 'rgba(255, 255, 255, 0.11)',
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
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
        <ActivityIndicator size="large" color={COLORS.accentViolet} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
      
      {/* Header Fixo */}
      <View style={styles.appHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
          <MaterialCommunityIcons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Materiais de Aula</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="folder-outline" size={22} color={COLORS.accentCyan} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={14} color={COLORS.textMuted} />
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.cabecalhoPagina}>
          <Text style={styles.tituloPagina}>
            Meus <Text style={styles.tituloPaginaDestaque}>Materiais</Text>
          </Text>
          <Text style={styles.subtituloPagina}>
            Consulte arquivos, links e referências postados por seus professores.
          </Text>
        </View>

        {error || disciplinas.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 13, textAlign: 'center' }}>
              {error || "Nenhum material de aula publicado."}
            </Text>
          </View>
        ) : (
          disciplinas.map((d) => (
            <View key={d.id} style={styles.cartaoDisciplina}>
              <View style={styles.cabecalhoDisciplina}>
                <Text style={styles.nomeDisciplina}>{d.nome}</Text>
                <View style={styles.etiquetaProfessor}>
                  <MaterialCommunityIcons name="account" size={12} color={COLORS.accentViolet} />
                  <Text style={styles.textoProfessor} numberOfLines={1}>{d.professor}</Text>
                </View>
              </View>
              <View style={styles.corpoDisciplina}>
                {d.arquivos.map((arquivo, i) => (
                  <TouchableOpacity key={i} style={styles.itemArquivo} onPress={() => handleOpenUrl(arquivo.url)}>
                    <View style={styles.iconePdf}>
                      <MaterialCommunityIcons name={arquivo.tipo === "LINK" ? "link-variant" : "file-pdf-box"} size={22} color={COLORS.accentEmerald} />
                    </View>
                    <View style={styles.infoArquivo}>
                      <Text style={styles.nomeArquivo}>{arquivo.nome}</Text>
                      <Text style={styles.metaArquivo}>{arquivo.meta}</Text>
                      <Text style={styles.contagemArquivo}>
                        <MaterialCommunityIcons name="arrow-down" size={10} color={COLORS.accentEmerald} /> {arquivo.tipo === "LINK" ? "Acessar Link" : "Baixar arquivo"}
                      </Text>
                    </View>
                    <View style={styles.setaArquivo}>
                      <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.accentViolet} />
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
  container: { flex: 1, backgroundColor: COLORS.bgBase },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.bgBase,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle
  },
  menuBtn: { padding: 5, marginLeft: -5 },
  appTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 0.5 },
  actionBtn: { padding: 5, marginRight: -5 },
  scroll: { flex: 1, paddingHorizontal: 20 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, alignSelf: 'flex-start', paddingVertical: 7, paddingHorizontal: 14, backgroundColor: COLORS.bgSurface, borderWidth: 1, borderColor: COLORS.borderSubtle, borderRadius: 8 },
  textoBotaoVoltar: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  cabecalhoPagina: { paddingTop: 22, paddingBottom: 14 },
  tituloPagina: { fontSize: 23, fontWeight: '700', color: COLORS.textPrimary },
  tituloPaginaDestaque: { color: COLORS.accentViolet },
  subtituloPagina: { fontSize: 12, color: COLORS.textDim, marginTop: 4, lineHeight: 18 },
  cartaoDisciplina: { marginBottom: 14, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderSubtle, backgroundColor: COLORS.bgSurface, overflow: 'hidden' },
  cabecalhoDisciplina: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  nomeDisciplina: { fontSize: 13, fontWeight: '800', color: COLORS.accentViolet, letterSpacing: 0.5, textTransform: 'uppercase' },
  etiquetaProfessor: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: `${COLORS.accentViolet}15`, borderWidth: 1, borderColor: `${COLORS.accentViolet}30`, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10, maxWidth: 180 },
  textoProfessor: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  corpoDisciplina: { paddingHorizontal: 16, paddingVertical: 12 },
  itemArquivo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.borderSubtle, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8 },
  iconePdf: { width: 40, height: 44, backgroundColor: `${COLORS.accentEmerald}15`, borderWidth: 1, borderColor: `${COLORS.accentEmerald}30`, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoArquivo: { flex: 1 },
  nomeArquivo: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  metaArquivo: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  contagemArquivo: { fontSize: 11, color: COLORS.accentEmerald, marginTop: 4, fontWeight: '700' },
  setaArquivo: { width: 30, height: 30, backgroundColor: `${COLORS.accentViolet}20`, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});

