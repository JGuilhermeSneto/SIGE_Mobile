import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBoletim } from '../services/api';

const cores = {
  fundoPrincipal: "#050811",
  fundoCartao: "#0a0f1d",
  fundoCartao2: "#0d1526",
  roxo: "#4a4295",
  roxoClaro: "#6259b8",
  verde: "#00e673",
  ciano: "#00e8fd",
  cinza: "#475468",
  cinzaClaro: "#8896a8",
  branco: "#e8edf5",
  vermelho: "#e04040",
  borda: "rgba(255,255,255,0.06)",
  bordaRoxo: "rgba(74,66,149,0.28)",
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
        <StatusBar barStyle="light-content" backgroundColor="rgba(5,8,17,0.97)" />
        <ActivityIndicator size="large" color={cores.ciano} />
      </SafeAreaView>
    );
  }

  const totalFaltas = boletimData ? boletimData.boletim.reduce((acc, curr) => acc + (curr.faltas || 0), 0) : 0;
  const totalAulas = boletimData ? boletimData.boletim.reduce((acc, curr) => acc + (curr.total || 0), 0) : 0;
  const totalPresencas = totalAulas - totalFaltas;
  const frequenciaGeral = boletimData ? (boletimData.frequencia_total ?? 100) : 100;

  return (
    <SafeAreaView style={estilos.tela}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(5,8,17,0.97)" />

      {/* Barra superior */}
      <View style={estilos.barraSuperior}>
        <View style={estilos.logoEnvolto}>
          <View style={estilos.logoBox}>
            <Text style={{ fontSize: 18 }}>📖</Text>
          </View>
          <Text style={estilos.logoTexto}>SIGE</Text>
        </View>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarText}>A</Text>
        </View>
      </View>

      <ScrollView style={estilos.conteudo} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={14} color={cores.cinzaClaro} />
          <Text style={estilos.textoBotaoVoltar}>Voltar ao Painel</Text>
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
                <MaterialCommunityIcons name="calendar-remove" size={28} color={cores.cinza} style={{opacity: 0.7}} />
              </View>
              <Text style={estilos.textoVazio}>
                {error || "Nenhuma informação de frequência disponível ainda."}
              </Text>
            </View>
          ) : (
            <View style={{ padding: 22, alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 48, fontWeight: '800', color: cores.ciano }}>{frequenciaGeral}%</Text>
              <Text style={{ fontSize: 12, color: cores.cinzaClaro, textAlign: 'center', lineHeight: 18 }}>
                Você compareceu a <Text style={{ color: cores.verde, fontWeight: '700' }}>{totalPresencas}</Text> de <Text style={{ fontWeight: '700' }}>{totalAulas}</Text> aulas registradas.
              </Text>
            </View>
          )}
        </View>

        {!error && boletimData && boletimData.boletim.length > 0 && (
          <>
            <View style={estilos.gradeResumo}>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(cores.vermelho)}>{totalFaltas}</Text>
                <Text style={estilos.rotuloResumo}>Total de Faltas</Text>
              </View>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(cores.verde)}>{totalPresencas}</Text>
                <Text style={estilos.rotuloResumo}>Presenças</Text>
              </View>
              <View style={estilos.itemResumo}>
                <Text style={estilosDinamicos.valorResumo(cores.ciano)}>{frequenciaGeral}%</Text>
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
                <Text style={[estilos.porcentagemDisciplina, { color: d.freq >= 75 ? cores.verde : cores.vermelho }]}>
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
  tela: { flex: 1, backgroundColor: cores.fundoPrincipal },
  barraSuperior: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: 'rgba(5,8,17,0.97)', borderBottomWidth: 1, borderBottomColor: cores.borda },
  logoEnvolto: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#131e33', alignItems: 'center', justifyContent: 'center' },
  logoTexto: { fontSize: 18, fontWeight: '700', color: cores.branco, letterSpacing: 3, textTransform: 'uppercase' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: cores.vermelho, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  conteudo: { flex: 1 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 14, marginTop: 14, backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8, alignSelf: 'flex-start' },
  textoBotaoVoltar: { color: cores.cinzaClaro, fontSize: 12, fontWeight: '600' },
  cartaoFrequencia: { margin: 14, borderRadius: 14, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.fundoCartao, overflow: 'hidden' },
  cabecalhoFrequencia: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: cores.borda },
  linhasTituloFrequencia: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pontoFrequencia: { width: 10, height: 10, borderRadius: 5, backgroundColor: cores.roxoClaro },
  tituloFrequencia: { fontSize: 15, fontWeight: '700', color: cores.branco },
  subtituloFrequencia: { fontSize: 10, color: cores.cinza, marginTop: 3, paddingLeft: 18 },
  emblemaFrequencia: { width: 30, height: 30, borderRadius: 15, backgroundColor: cores.roxo, alignItems: 'center', justifyContent: 'center' },
  estadoVazio: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, paddingHorizontal: 20, gap: 12 },
  iconeVazio: { width: 56, height: 56, backgroundColor: "rgba(71,84,104,0.15)", borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  textoVazio: { fontSize: 13, color: cores.cinza, textAlign: 'center', lineHeight: 18 },
  gradeResumo: { flexDirection: 'row', gap: 10, marginHorizontal: 14, marginBottom: 14 },
  itemResumo: { flex: 1, backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 10, alignItems: 'center' },
  rotuloResumo: { fontSize: 10, color: cores.cinza, textAlign: 'center' },
  rotuloSecao: { fontSize: 10, fontWeight: '700', color: cores.cinza, textTransform: 'uppercase', letterSpacing: 1.2, paddingHorizontal: 14, paddingBottom: 8 },
  linhaDisciplina: { marginHorizontal: 14, marginBottom: 8, backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoDisciplina: { flex: 1 },
  nomeDisciplina: { fontSize: 13, fontWeight: '600', color: cores.branco },
  professorDisciplina: { fontSize: 10, color: cores.cinza, marginTop: 2 },
  fundoBarra: { height: 5, borderRadius: 5, backgroundColor: cores.fundoCartao2, borderWidth: 1, borderColor: cores.borda, marginTop: 8, overflow: 'hidden' },
  rotuloBarra: { fontSize: 10, color: cores.cinza, marginTop: 3, fontStyle: 'italic' },
  porcentagemDisciplina: { fontSize: 20, fontWeight: '700', color: cores.cinza, minWidth: 42, textAlign: 'right' },
});

const estilosDinamicos = {
  valorResumo: (cor) => ({ fontSize: 24, fontWeight: '700', lineHeight: 28, marginBottom: 6, color: cor }),
  preenchimentoBarra: (porcentagem) => ({ height: "100%", borderRadius: 5, width: `${porcentagem}%`, backgroundColor: cores.roxoClaro }),
};
