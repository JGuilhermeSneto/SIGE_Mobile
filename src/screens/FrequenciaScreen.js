import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBoletim } from '../services/api';

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

export default function FrequenciaScreen({ navigation }) {
  const [boletimData, setBoletimData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFrequencia = async () => {
    try {
      setIsLoading(true);
      const data = await getBoletim();
      setBoletimData(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a frequência.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFrequencia();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[estilos.tela, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
        <ActivityIndicator size="large" color={COLORS.accentCyan} />
      </SafeAreaView>
    );
  }

  const totalFaltas = boletimData ? boletimData.boletim.reduce((acc, curr) => acc + (curr.faltas || 0), 0) : 0;
  const totalAulas = boletimData ? boletimData.boletim.reduce((acc, curr) => acc + (curr.total || 0), 0) : 0;
  const totalPresencas = totalAulas - totalFaltas;
  const frequenciaGeral = boletimData ? (boletimData.frequencia_total ?? 100) : 100;

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />

      {/* Header Fixo */}
      <View style={estilos.appHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={estilos.menuBtn}>
          <MaterialCommunityIcons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={estilos.appTitle}>Controle de Frequência</Text>
        <TouchableOpacity style={estilos.actionBtn}>
          <MaterialCommunityIcons name="calendar-check-outline" size={22} color={COLORS.accentCyan} />
        </TouchableOpacity>
      </View>

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={14} color={COLORS.textMuted} />
          <Text style={estilos.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>

        {/* Cartão de frequência */}
        <View style={estilos.cartaoFrequencia}>
          <View style={estilos.cabecalhoFrequencia}>
            <View>
              <View style={estilos.linhasTituloFrequencia}>
                <View style={estilos.pontoFrequencia} />
                <Text style={estilos.tituloFrequencia}>Minha Frequência</Text>
              </View>
              <Text style={estilos.subtituloFrequencia}>Frequência geral do ano letivo</Text>
            </View>
            <View style={estilos.emblemaFrequencia}>
              <MaterialCommunityIcons name="calendar-check" size={16} color="#fff" />
            </View>
          </View>

          {error || !boletimData || boletimData.boletim.length === 0 ? (
            <View style={estilos.estadoVazio}>
              <View style={estilos.iconeVazio}>
                <MaterialCommunityIcons name="calendar-remove" size={28} color={COLORS.textDim} style={{opacity: 0.7}} />
              </View>
              <Text style={estilos.textoVazio}>
                {error || "Nenhuma informação de frequência disponível ainda."}
              </Text>
            </View>
          ) : (
            <View style={{ padding: 22, alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 48, fontWeight: '900', color: COLORS.accentCyan }}>{frequenciaGeral}%</Text>
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 18 }}>
                Você compareceu a <Text style={{ color: COLORS.accentEmerald, fontWeight: '800' }}>{totalPresencas}</Text> de <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>{totalAulas}</Text> aulas registradas.
              </Text>
            </View>
          )}
        </View>

        {!error && boletimData && boletimData.boletim.length > 0 && (
          <>
            <View style={estilos.gradeResumo}>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(COLORS.accentRuby)}>{totalFaltas}</Text>
                <Text style={estilos.rotuloResumo}>Total de Faltas</Text>
              </View>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(COLORS.accentEmerald)}>{totalPresencas}</Text>
                <Text style={estilos.rotuloResumo}>Presenças</Text>
              </View>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(COLORS.accentCyan)}>{frequenciaGeral}%</Text>
                <Text style={estilos.rotuloResumo}>Frequência Geral</Text>
              </View>
            </View>

            <Text style={estilos.rotuloSecao}>Por Disciplina</Text>

            {boletimData.boletim.map((d) => (
              <View key={d.id} style={estilos.linhaDisciplina}>
                <View style={estilos.infoDisciplina}>
                  <Text style={estilos.nomeDisciplina}>{d.nome}</Text>
                  <Text style={estilos.professorDisciplina}>{d.prof}</Text>
                  <View style={estilos.fundoBarra}>
                    <View style={estilosDinamicos.preenchimentoBarra(d.freq)} />
                  </View>
                  <Text style={estilos.rotuloBarra}>
                    {d.faltas} {d.faltas === 1 ? "falta" : "faltas"} em {d.total} aulas registradas
                  </Text>
                </View>
                <Text style={[estilos.porcentagemDisciplina, { color: d.freq >= 75 ? COLORS.accentEmerald : COLORS.accentRuby }]}>
                  {d.freq}%
                </Text>
              </View>
            ))}
          </>
        )}
        <View style={{height: 40}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: COLORS.bgBase },
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
  conteudo: { flex: 1, paddingHorizontal: 20 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14, alignSelf: 'flex-start', paddingVertical: 7, paddingHorizontal: 14, backgroundColor: COLORS.bgSurface, borderWidth: 1, borderColor: COLORS.borderSubtle, borderRadius: 8 },
  textoBotaoVoltar: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  cartaoFrequencia: { marginTop: 14, marginBottom: 14, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderSubtle, backgroundColor: COLORS.bgSurface, overflow: 'hidden' },
  cabecalhoFrequencia: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  linhasTituloFrequencia: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pontoFrequencia: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.accentViolet },
  tituloFrequencia: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  subtituloFrequencia: { fontSize: 11, color: COLORS.textMuted, marginTop: 3, paddingLeft: 18 },
  emblemaFrequencia: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.accentViolet, alignItems: 'center', justifyContent: 'center' },
  estadoVazio: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20, gap: 12 },
  iconeVazio: { width: 56, height: 56, backgroundColor: "rgba(148,163,184,0.15)", borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  textoVazio: { fontSize: 13, color: COLORS.textDim, textAlign: 'center', lineHeight: 18 },
  gradeResumo: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  itemResumo: { flex: 1, backgroundColor: COLORS.bgSurface, borderWidth: 1, borderColor: COLORS.borderSubtle, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center' },
  rotuloResumo: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', fontWeight: '600' },
  rotuloSecao: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, textTransform: 'uppercase', letterSpacing: 0.5, paddingBottom: 10 },
  linhaDisciplina: { marginBottom: 10, backgroundColor: COLORS.bgSurface, borderWidth: 1, borderColor: COLORS.borderSubtle, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoDisciplina: { flex: 1 },
  nomeDisciplina: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  professorDisciplina: { fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontWeight: '600' },
  fundoBarra: { height: 6, borderRadius: 3, backgroundColor: COLORS.bgElevated, marginTop: 10, overflow: 'hidden' },
  rotuloBarra: { fontSize: 11, color: COLORS.textDim, marginTop: 6, fontWeight: '500' },
  porcentagemDisciplina: { fontSize: 22, fontWeight: '800', minWidth: 50, textAlign: 'right' },
});

const estilosDinamicos = {
  valorResumo: (cor) => ({ fontSize: 24, fontWeight: '900', lineHeight: 28, marginBottom: 6, color: cor }),
  preenchimentoBarra: (porcentagem) => ({ height: "100%", borderRadius: 3, width: `${porcentagem}%`, backgroundColor: porcentagem >= 75 ? COLORS.accentEmerald : COLORS.accentRuby }),
};
