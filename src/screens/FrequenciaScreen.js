import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

const disciplinasFrequencia = [
  { id: 1, nome: "Matematica",        professor: "Prof. Fernanda Costa Vieira",   porcentagem: 0 },
  { id: 2, nome: "Lingua Portuguesa", professor: "Prof. Davi Alves Guedes",       porcentagem: 0 },
  { id: 3, nome: "Fisica",            professor: "Prof. Eduardo Pereira Pereira", porcentagem: 0 },
];

export default function FrequenciaScreen({ navigation }) {
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
              <Text style={estilos.subtituloFrequencia}>1o Ano B (2025) — Manhã</Text>
            </View>
            <View style={estilos.emblemaFrequencia}>
              <MaterialCommunityIcons name="information-variant" size={16} color="#fff" />
            </View>
          </View>

          <View style={estilos.estadoVazio}>
            <View style={estilos.iconeVazio}>
              <MaterialCommunityIcons name="calendar-remove" size={28} color={cores.cinza} style={{opacity: 0.7}} />
            </View>
            <Text style={estilos.textoVazio}>
              Nenhuma informação de frequência disponível ainda.
            </Text>
          </View>
        </View>

        <View style={estilos.gradeResumo}>
          <View style={estilos.itemResumo}>
            <Text style={estilosDinamicos.valorResumo(cores.vermelho)}>—</Text>
            <Text style={estilos.rotuloResumo}>Total de Faltas</Text>
          </View>
          <View style={estilos.itemResumo}>
            <Text style={estilosDinamicos.valorResumo(cores.verde)}>—</Text>
            <Text style={estilos.rotuloResumo}>Presenças</Text>
          </View>
          <View style={estilos.itemResumo}>
            <Text style={estilosDinamicos.valorResumo(cores.ciano)}>—%</Text>
            <Text style={estilos.rotuloResumo}>Frequência Geral</Text>
          </View>
        </View>

        <Text style={estilos.rotuloSecao}>Por Disciplina</Text>

        {disciplinasFrequencia.map((d) => (
          <View key={d.id} style={estilos.linhaDisciplina}>
            <View style={estilos.infoDisciplina}>
              <Text style={estilos.nomeDisciplina}>{d.nome}</Text>
              <Text style={estilos.professorDisciplina}>{d.professor}</Text>
              <View style={estilos.fundoBarra}>
                <View style={estilosDinamicos.preenchimentoBarra(d.porcentagem)} />
              </View>
              <Text style={estilos.rotuloBarra}>
                {d.porcentagem === 0 ? "Sem registros" : `${d.porcentagem}% de frequência`}
              </Text>
            </View>
            <Text style={estilos.porcentagemDisciplina}>
              {d.porcentagem === 0 ? "—%" : `${d.porcentagem}%`}
            </Text>
          </View>
        ))}
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
  emblemaFrequencia: { width: 30, height: 30, borderRadius: 15, backgroundColor: cores.vermelho, alignItems: 'center', justifyContent: 'center' },
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
