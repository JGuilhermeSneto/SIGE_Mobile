import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
 
const materias = [
  { id: 1, nome: 'MATEMATICA', professor: 'Fernando Costa', tipo: 'Provas' },
  { id: 2, nome: 'LINGUA-PORTUGUESA', professor: 'Julia Batola', tipo: 'Provas' },
  { id: 3, nome: 'FISICA', professor: 'Dani Alves', tipo: 'Provas' },
  { id: 4, nome: 'FILOSOFIA', professor: 'Reresa Filjo', tipo: 'Provas' },
  { id: 5, nome: 'INGLES', professor: 'Josue la', tipo: 'Provas' },
  { id: 6, nome: 'GEOGRAFIA', professor: 'Armando varal', tipo: 'Provas' },
  { id: 7, nome: 'SOCIOLOGIA', professor: 'Fernando Costa', tipo: 'Provas' },
  { id: 8, nome: 'SEMINARIO DE PESQUISA', professor: 'Sabrina Silva', tipo: 'Provas' },
  { id: 9, nome: 'MECANICA', professor: 'Israel Sales', tipo: 'Provas' },
  { id: 10, nome: 'ELETRICA', professor: 'Jackson Ribeiro', tipo: 'Provas' },
  { id: 11, nome: 'SISTEMAS DIGITAIS', professor: 'Junko Ikala', tipo: 'Provas' },
  { id: 12, nome: 'ROBOTICA', professor: 'Thiago Evaralo', tipo: 'Provas' },
];
 
function MateriaCard({ materia }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Topo do card: nome + três pontos */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>{materia.nome}</Text>
        <Text style={styles.tresPontos}>···</Text>
      </View>
 
      {/* Corpo: avatar + info + ícone pendente */}
      <View style={styles.cardBody}>
        {/* Avatar círculo */}
        <View style={styles.avatar}>
          <View style={styles.avatarIcon} />
        </View>
 
        {/* Professor + tipo */}
        <View style={styles.cardInfo}>
          <Text style={styles.professorLabel}>PROFESSOR: {materia.professor}</Text>
          <Text style={styles.tipoText}>{materia.tipo}</Text>
        </View>
 
        {/* Ícone pendente (dourado) */}
        <View style={styles.pendenteContainer}>
          <View style={styles.pendenteIcone}>
            <Text style={styles.pendenteIconeText}>⊙</Text>
          </View>
          <Text style={styles.pendenteLabel}>pendente</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
 
export default function AtividadesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
 
      {/* Header SIGE */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcone}>
            <Text style={styles.logoIconeText}>📖</Text>
          </View>
          <Text style={styles.logoTexto}>SIGE</Text>
        </View>
      </View>
 
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Botão voltar ao painel */}
        <TouchableOpacity style={styles.voltarBtn} activeOpacity={0.7}>
          <Text style={styles.voltarTexto}>← voltar ao painel</Text>
        </TouchableOpacity>
 
        {/* Breadcrumb */}
        <Text style={styles.breadcrumb}>
          <Text style={styles.breadcrumbNormal}>SIGE - </Text>
          <Text style={styles.breadcrumbDestaque}>PORTAL DO ALUNO</Text>
        </Text>
 
        {/* Botão Atividades */}
        <TouchableOpacity style={styles.atividadesBtn} activeOpacity={0.85}>
          <Text style={styles.atividadesBtnTexto}>Atividades</Text>
        </TouchableOpacity>
 
        {/* Grid de matérias (2 colunas) */}
        <View style={styles.grid}>
          {materias.map((m) => (
            <MateriaCard key={m.id} materia={m} />
          ))}
        </View>
 
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}
 
const CARD_BORDER = '#1e4d6b';
const GOLD = '#c9a227';
const GOLD_DARK = '#a07c10';
const BG = '#0a0f1e';
const CARD_BG = '#0d1a2b';
const TEAL = '#00e5ff';
 
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
 
  /* ── Header ── */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2a3a',
    backgroundColor: BG,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcone: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1a2a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconeText: {
    fontSize: 20,
  },
  logoTexto: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
  },
 
  /* ── Scroll ── */
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
 
  /* ── Voltar ── */
  voltarBtn: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2a3a4a',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#0d1a2b',
  },
  voltarTexto: {
    color: '#aab8c8',
    fontSize: 13,
  },
 
  /* ── Breadcrumb ── */
  breadcrumb: {
    marginTop: 12,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  breadcrumbNormal: {
    color: '#aab8c8',
  },
  breadcrumbDestaque: {
    color: TEAL,
    fontWeight: '600',
  },
 
  /* ── Botão Atividades ── */
  atividadesBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#7b3ff5',
    alignSelf: 'flex-start',
  },
  atividadesBtnTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
 
  /* ── Grid ── */
  grid: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
 
  /* ── Card ── */
  card: {
    width: '48%',
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitulo: {
    color: TEAL,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  tresPontos: {
    color: '#5a7a9a',
    fontSize: 14,
    letterSpacing: 1,
    marginLeft: 4,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
 
  /* Avatar */
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1e3050',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a4060',
  },
  avatarIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3a5070',
  },
 
  /* Info */
  cardInfo: {
    flex: 1,
  },
  professorLabel: {
    color: '#5a8aaa',
    fontSize: 8,
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  tipoText: {
    color: '#d0e8f8',
    fontSize: 13,
    fontWeight: '600',
  },
 
  /* Pendente */
  pendenteContainer: {
    alignItems: 'center',
    gap: 2,
  },
  pendenteIcone: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: GOLD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GOLD,
  },
  pendenteIconeText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: '800',
  },
  pendenteLabel: {
    color: GOLD,
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
 
  bottomSpacing: {
    height: 30,
  },
});