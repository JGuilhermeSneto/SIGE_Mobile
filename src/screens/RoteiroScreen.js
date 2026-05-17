import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal } from 'react-native';
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

const materias = [
  { id: "mat", nome: "Matematica",        professor: "Prof. Fernanda Costa Vieira" },
  { id: "por", nome: "Lingua Portuguesa", professor: "Prof. Davi Alves Guedes" },
  { id: "fis", nome: "Fisica",            professor: "Prof. Eduardo Pereira Pereira" },
  { id: "qui", nome: "Quimica",           professor: "Prof. Mariana Santos Ribeiro" },
  { id: "bio", nome: "Biologia",          professor: "Prof. Igor Rocha Alves" },
  { id: "his", nome: "Historia",          professor: "Prof. Leandro Neto Castro" },
  { id: "geo", nome: "Geografia",         professor: "Prof. Fernanda Oliveira Gomes" },
  { id: "flo", nome: "Filosofia",         professor: "Prof. Gabriela Lima Castro" },
];

const dadosAulas = {
  mat: [
    { data: "Terça-Feira, 10 De Março De 2026", situacao: "concluida", assunto: "Equações do 2° grau", topicos: "Discriminante — Fórmula de Bháskara" },
    { data: "Quinta-Feira, 12 De Março De 2026", situacao: "concluida", assunto: "Geometria Plana", topicos: "Áreas de figuras planas — Triângulos e quadriláteros" },
    { data: "Terça-Feira, 17 De Março De 2026", situacao: "pendente",  assunto: "Progressão Aritmética", topicos: "Definição — Fórmula do termo geral" },
  ],
  por: [
    { data: "Segunda-Feira, 09 De Março De 2026", situacao: "concluida", assunto: "Interpretação de Texto", topicos: "Coesão e coerência textual" },
    { data: "Quarta-Feira, 11 De Março De 2026",  situacao: "pendente",  assunto: "Gramática", topicos: "Concordância nominal e verbal" },
  ],
  fis: [
    { data: "Terça-Feira, 10 De Março De 2026", situacao: "concluida", assunto: "Cinemática", topicos: "MRU — Velocidade média" },
    { data: "Sexta-Feira, 13 De Março De 2026",  situacao: "pendente",  assunto: "Dinâmica", topicos: "Leis de Newton — Força resultante" },
  ],
  qui: [
    { data: "Quarta-Feira, 11 De Março De 2026", situacao: "concluida", assunto: "Tabela Periódica", topicos: "Grupos e períodos — Propriedades periódicas" },
  ],
  bio: [
    { data: "Quinta-Feira, 12 De Março De 2026", situacao: "pendente", assunto: "Citologia", topicos: "Estrutura celular — Organelas" },
  ],
  his: [
    { data: "Segunda-Feira, 09 De Março De 2026", situacao: "concluida", assunto: "Revolução Industrial", topicos: "Causas e consequências — Trabalho infantil" },
  ],
  geo: [
    { data: "Terça-Feira, 10 De Março De 2026", situacao: "pendente", assunto: "Geopolítica Mundial", topicos: "Blocos econômicos — Globalização" },
  ],
  flo: [
    { data: "Sexta-Feira, 06 De Março De 2026", situacao: "concluida", assunto: "Filosofia Antiga", topicos: "Sócrates — Método maiêutico" },
  ],
};

function CartaoAula({ aula }) {
  return (
    <View style={styles.cartaoAula}>
      <View style={styles.barraDataAula}>
        <Text style={styles.dataAula}>{aula.data}</Text>
        <View style={aula.situacao === "concluida" ? styles.emblemaConcluida : styles.emblemaPendente}>
          <Text style={aula.situacao === "concluida" ? styles.textoEmblemaConcluida : styles.textoEmblemaPendente}>
            {aula.situacao === "concluida" ? "Aula Concluída" : "Pendente"}
          </Text>
        </View>
      </View>
      <View style={styles.corpoAula}>
        <Text style={styles.rotuloCampo}>Assunto / Tópicos</Text>
        <View style={styles.valorCampo}>
          <Text style={styles.textoValorCampo}>{aula.assunto} — {aula.topicos}</Text>
        </View>
      </View>
    </View>
  );
}

export default function RoteiroScreen({ navigation }) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);

  const materiaAtual = materias[indiceAtual];
  const aulas = dadosAulas[materiaAtual.id] || [];

  function selecionarMateria(indice) {
    setIndiceAtual(indice);
    setMenuAberto(false);
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
        <View style={styles.linhaTopoAcoes}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={14} color={cores.cinzaClaro} />
            <Text style={styles.textoBotaoVoltar}>Voltar ao Painel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.etiquetaAtiva} onPress={() => setMenuAberto(true)}>
            <MaterialCommunityIcons name="menu" size={14} color={cores.roxoClaro} />
            <Text style={styles.textoEtiquetaAtiva} numberOfLines={1}>{materiaAtual.nome}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.conteudoTrilha}>
          <View style={styles.cabecalhoTrilha}>
            <View style={styles.iconeTrilha}>
              <MaterialCommunityIcons name="map-marker-path" size={20} color={cores.ciano} />
            </View>
            <View style={styles.textoCabecalhoTrilha}>
              <Text style={styles.tituloTrilha}>
                Trilha Educacional: <Text style={styles.destaqueNomeTrilha}>{materiaAtual.nome}</Text>
              </Text>
              <Text style={styles.subtituloTrilha}>
                Veja abaixo o que o(a) professor(a) <Text style={styles.destaqueProfessor}>{materiaAtual.professor}</Text> preparou de material ou assuntos para as aulas (Passadas e Futuras).
              </Text>
            </View>
          </View>

          {aulas.length === 0 ? (
            <View style={styles.semAulas}>
              <Text style={styles.textoSemAulas}>Nenhuma aula cadastrada ainda.</Text>
            </View>
          ) : (
            aulas.map((aula, i) => (
              <CartaoAula key={i} aula={aula} />
            ))
          )}
        </View>
        <View style={{height: 40}}/>
      </ScrollView>

      {/* Menu Modal */}
      <Modal visible={menuAberto} transparent={true} animationType="fade">
        <View style={styles.sobreposicao}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setMenuAberto(false)} />
          <View style={styles.menuLateral}>
            <View style={styles.cabecalhoMenuLateral}>
              <Text style={styles.tituloMenuLateral}>MINHAS MATÉRIAS</Text>
            </View>
            <ScrollView>
              {materias.map((m, i) => {
                const ativo = i === indiceAtual;
                return (
                  <TouchableOpacity key={m.id} style={estilosDinamicos.itemMateria(ativo)} onPress={() => selecionarMateria(i)}>
                    <View style={estilosDinamicos.numeroMateria(ativo)}><Text style={estilosDinamicos.textoNumeroMateria(ativo)}>{i + 1}</Text></View>
                    <View style={styles.infoMateria}>
                      <Text style={estilosDinamicos.nomeMateria(ativo)} numberOfLines={1}>{m.nome}</Text>
                      <Text style={styles.professorMateria}>{m.professor}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundoPrincipal },
  barraSuperior: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, backgroundColor: 'rgba(5,8,17,0.97)', borderBottomWidth: 1, borderBottomColor: cores.borda },
  logoEnvolto: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#131e33', alignItems: 'center', justifyContent: 'center' },
  logoTexto: { fontSize: 18, fontWeight: '700', color: cores.branco, letterSpacing: 3, textTransform: 'uppercase' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: cores.vermelho, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  conteudo: { flex: 1 },
  linhaTopoAcoes: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingTop: 12 },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 8 },
  textoBotaoVoltar: { color: cores.cinzaClaro, fontSize: 12, fontWeight: '600' },
  etiquetaAtiva: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: "rgba(74,66,149,0.18)", borderWidth: 1, borderColor: "rgba(74,66,149,0.35)", borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12, maxWidth: 180 },
  textoEtiquetaAtiva: { color: cores.roxoClaro, fontSize: 12, fontWeight: '600' },
  conteudoTrilha: { padding: 14, gap: 12, flexDirection: 'column' },
  cabecalhoTrilha: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, borderRadius: 14, padding: 16, marginBottom: 12 },
  iconeTrilha: { width: 40, height: 40, backgroundColor: "rgba(0,232,253,0.1)", borderWidth: 1, borderColor: "rgba(0,232,253,0.22)", borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  textoCabecalhoTrilha: { flex: 1 },
  tituloTrilha: { fontSize: 17, fontWeight: '700', color: cores.branco },
  destaqueNomeTrilha: { color: cores.ciano },
  subtituloTrilha: { fontSize: 11, color: cores.cinza, marginTop: 5, lineHeight: 16 },
  destaqueProfessor: { color: cores.roxoClaro, fontWeight: '700' },
  cartaoAula: { backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  barraDataAula: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: cores.borda, flexWrap: 'wrap', gap: 8 },
  dataAula: { fontSize: 12, fontWeight: '600', color: cores.cinzaClaro, flex: 1 },
  emblemaConcluida: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, backgroundColor: "rgba(0,230,115,0.13)", borderWidth: 1, borderColor: "rgba(0,230,115,0.28)" },
  textoEmblemaConcluida: { fontSize: 10, fontWeight: '700', color: cores.verde, textTransform: 'uppercase', letterSpacing: 0.5 },
  emblemaPendente: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20, backgroundColor: "rgba(74,66,149,0.18)", borderWidth: 1, borderColor: "rgba(74,66,149,0.3)" },
  textoEmblemaPendente: { fontSize: 10, fontWeight: '700', color: cores.roxoClaro, textTransform: 'uppercase', letterSpacing: 0.5 },
  corpoAula: { padding: 14 },
  rotuloCampo: { fontSize: 10, fontWeight: '700', color: cores.cinza, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  valorCampo: { backgroundColor: cores.fundoCartao2, borderWidth: 1, borderColor: cores.borda, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: 40, justifyContent: 'center' },
  textoValorCampo: { fontSize: 12, color: cores.cinzaClaro, fontStyle: 'italic', lineHeight: 18 },
  semAulas: { backgroundColor: cores.fundoCartao, borderWidth: 1, borderColor: cores.borda, borderRadius: 14, padding: 32, alignItems: 'center' },
  textoSemAulas: { color: cores.cinza, fontSize: 13 },
  sobreposicao: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", flexDirection: 'row' },
  menuLateral: { width: "80%", maxWidth: 300, height: "100%", backgroundColor: cores.fundoCartao, borderRightWidth: 1, borderRightColor: "rgba(74,66,149,0.2)" },
  cabecalhoMenuLateral: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: cores.borda, backgroundColor: cores.fundoCartao },
  tituloMenuLateral: { fontSize: 10, fontWeight: '700', color: cores.cinza, textTransform: 'uppercase', letterSpacing: 1.5 },
  infoMateria: { flex: 1 },
  professorMateria: { fontSize: 10, color: cores.cinza, marginTop: 2 },
});

const estilosDinamicos = {
  itemMateria: (ativo) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderLeftWidth: 3, borderLeftColor: ativo ? cores.roxoClaro : "transparent", backgroundColor: ativo ? "rgba(74,66,149,0.15)" : "transparent" }),
  numeroMateria: (ativo) => ({ width: 24, height: 24, borderRadius: 12, backgroundColor: ativo ? cores.roxo : cores.fundoCartao2, borderWidth: 1, borderColor: ativo ? cores.roxoClaro : cores.borda, alignItems: 'center', justifyContent: 'center' }),
  textoNumeroMateria: (ativo) => ({ fontSize: 10, fontWeight: '700', color: ativo ? "#fff" : cores.cinza }),
  nomeMateria: (ativo) => ({ fontSize: 13, fontWeight: '600', color: ativo ? cores.branco : cores.cinzaClaro }),
};
