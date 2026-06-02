import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { getPerfil, putPerfil } from '../services/api';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#090e1a',
  surface: '#0f1729',
  card: '#131e33',
  card2: '#1a2844',
  border: 'rgba(255, 255, 255, 0.06)',
  cyan: '#22d3ee',
  cyanDim: 'rgba(34, 211, 238, 0.15)',
  blue: '#7c6fff',
  blueDim: 'rgba(124, 111, 255, 0.15)',
  green: '#34d399',
  greenDim: 'rgba(52, 211, 153, 0.15)',
  red: '#f87171',
  yellow: '#fbbf24',
  yellowDim: 'rgba(251, 191, 36, 0.15)',
  text: '#ffffff',
  muted: '#cbd5e1',
  label: '#94a3b8',
  white: '#ffffff',
};

export default function PerfilScreen({ navigation }) {
  // State for student details
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [turma, setTurma] = useState('');
  const [anoLetivo, setAnoLetivo] = useState('');
  const [statusMatricula, setStatusMatricula] = useState('');

  // Academic statistics
  const [mediaGeral, setMediaGeral] = useState('0,0');
  const [frequencia, setFrequencia] = useState('100%');
  const [disciplinas, setDisciplinas] = useState('0');
  const [faltas, setFaltas] = useState('0');

  // Responsáveis list
  const [responsaveis, setResponsaveis] = useState([]);

  // Loading and Modal Visibility
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Temporary state for edits
  const [tempNome, setTempNome] = useState('');
  const [tempCpf, setTempCpf] = useState('');
  const [tempDataNascimento, setTempDataNascimento] = useState('');
  const [tempNaturalidade, setTempNaturalidade] = useState('');
  const [tempTelefone, setTempTelefone] = useState('');

  // Custom Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchPerfilData = async () => {
    try {
      setIsLoading(true);
      const data = await getPerfil();
      setNome(data.nome);
      setMatricula(data.matricula);
      setCpf(data.cpf);
      setDataNascimento(data.data_nascimento);
      setNaturalidade(data.naturalidade);
      setTelefone(data.telefone);
      setTurma(data.turma);
      setAnoLetivo(data.ano_letivo);
      setStatusMatricula(data.status_matricula);
      
      if (data.stats) {
        setMediaGeral(data.stats.media_geral);
        setFrequencia(data.stats.frequencia);
        setDisciplinas(data.stats.disciplinas);
        setFaltas(data.stats.faltas);
      }
      setResponsaveis(data.responsaveis || []);
    } catch (error) {
      showToast('Erro ao carregar dados do perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfilData();
  }, []);

  // Dynamically calculate initials for avatar
  const getInitials = (fullName) => {
    if (!fullName) return 'AS';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleOpenEditModal = () => {
    setTempNome(nome);
    setTempCpf(cpf);
    setTempDataNascimento(dataNascimento);
    setTempNaturalidade(naturalidade);
    setTempTelefone(telefone);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await putPerfil({
        nome: tempNome,
        cpf: tempCpf,
        data_nascimento: tempDataNascimento,
        naturalidade: tempNaturalidade,
        telefone: tempTelefone
      });
      
      // Update local state directly after successful save
      setNome(tempNome);
      setCpf(tempCpf);
      setDataNascimento(tempDataNascimento);
      setNaturalidade(tempNaturalidade);
      setTelefone(tempTelefone);
      
      setIsModalOpen(false);
      showToast('Perfil atualizado com sucesso!');
    } catch (error) {
      showToast('Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSituacaoGeral = () => {
    if (!mediaGeral || !frequencia) return 'Sem dados';
    const medVal = parseFloat(String(mediaGeral).replace(',', '.'));
    const freqVal = parseFloat(String(frequencia).replace('%', ''));
    if (isNaN(medVal) || isNaN(freqVal)) return 'Sem dados';
    if (medVal >= 7.0 && freqVal >= 75) return 'Aprovado';
    if (medVal >= 5.0 && freqVal >= 75) return 'Recuperação';
    return 'Reprovado';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <ActivityIndicator size="large" color={COLORS.cyan} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Top Header Bar */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>SIGE</Text>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dynamic Toast Message */}
        {toastVisible && (
          <View style={styles.toastContainer}>
            <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.green} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          {/* SVG Gradient Profile Card Background */}
          <View style={StyleSheet.absoluteFill}>
            <Svg height="100%" width="100%">
              <Defs>
                <LinearGradient id="profileCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#1a2240" />
                  <Stop offset="60%" stopColor="#111828" />
                  <Stop offset="100%" stopColor="#0e1520" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#profileCardGrad)" />
            </Svg>
          </View>

          {/* Banner with SVG Gradient */}
          <View style={styles.profileBanner}>
            <Svg height="100%" width="100%">
              <Defs>
                <LinearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#1e2d55" />
                  <Stop offset="50%" stopColor="#243060" />
                  <Stop offset="100%" stopColor="#1a254a" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#bannerGrad)" />
            </Svg>
            {/* Radial overlay glow */}
            <View style={styles.bannerOverlay} />
          </View>

          <View style={styles.profileBody}>
            {/* Avatar Wrap */}
            <View style={styles.avatarWrap}>
              {/* Avatar Background Gradient */}
              <View style={styles.avatarBackground}>
                <Svg height="100%" width="100%">
                  <Defs>
                    <LinearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#00d4c8" />
                      <Stop offset="100%" stopColor="#4f7fff" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="100%" fill="url(#avatarGrad)" />
                </Svg>
              </View>
              <Text style={styles.avatarText}>{getInitials(nome)}</Text>
              <View style={styles.avatarDot} />
            </View>

            {/* Profile Info */}
            <Text style={styles.profileName}>{nome}</Text>
            
            <View style={styles.profileMeta}>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="card-account-details-outline" size={12} color={COLORS.label} />
                <Text style={styles.metaItemText}>Matrícula {matricula}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="school-outline" size={12} color={COLORS.label} />
                <Text style={styles.metaItemText} numberOfLines={1}>{turma} · {anoLetivo}</Text>
              </View>
              <View style={styles.badgeAtivo}>
                <Text style={styles.badgeAtivoText}>{statusMatricula || 'Ativo'}</Text>
              </View>
            </View>

            {/* Profile Actions */}
            <View style={styles.profileActions}>
              <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={handleOpenEditModal}>
                <MaterialCommunityIcons name="account-edit-outline" size={14} color={COLORS.text} />
                <Text style={styles.btnOutlineText}>Editar Perfil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btnPrimaryContainer} onPress={() => navigation.navigate('Home')}>
                <View style={StyleSheet.absoluteFill}>
                  <Svg height="100%" width="100%">
                    <Defs>
                      <LinearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#4f7fff" />
                        <Stop offset="100%" stopColor="#7b5fff" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#btnGrad)" />
                  </Svg>
                </View>
                <View style={styles.btnPrimaryContent}>
                  <MaterialCommunityIcons name="view-dashboard-outline" size={14} color={COLORS.white} />
                  <Text style={styles.btnPrimaryText}>Meu Painel</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Card 1: Média Geral */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconBlue]}>
              <MaterialCommunityIcons name="trending-up" size={18} color={COLORS.blue} />
            </View>
            <Text style={[styles.statValue, styles.statValueRed]}>{mediaGeral}</Text>
            <Text style={styles.statLabel}>MÉDIA GERAL</Text>
          </View>

          {/* Card 2: Frequência */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconCyan]}>
              <MaterialCommunityIcons name="calendar-check-outline" size={18} color={COLORS.cyan} />
            </View>
            <Text style={[styles.statValue, styles.statValueGreen]}>{frequencia}</Text>
            <Text style={styles.statLabel}>FREQUÊNCIA</Text>
          </View>

          {/* Card 3: Disciplinas */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconGreen]}>
              <MaterialCommunityIcons name="book-open-outline" size={18} color={COLORS.green} />
            </View>
            <Text style={[styles.statValue, styles.statValueWhite]}>{disciplinas}</Text>
            <Text style={styles.statLabel}>DISCIPLINAS</Text>
          </View>

          {/* Card 4: Faltas no Ano */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.statIconYellow]}>
              <MaterialCommunityIcons name="alert-triangle-outline" size={18} color={COLORS.yellow} />
            </View>
            <Text style={[styles.statValue, styles.statValueRed]}>{faltas}</Text>
            <Text style={styles.statLabel}>FALTAS NO ANO</Text>
          </View>
        </View>

        {/* Dados Pessoais & Acadêmicos Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="account-details-outline" size={16} color={COLORS.cyan} />
            <Text style={styles.sectionTitleText}>Dados Pessoais &amp; Acadêmicos</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoGroupTitle}>Identificação</Text>

            {/* Row: Matrícula */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="card-account-details-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Matrícula</Text>
                <Text style={styles.infoVal}>{matricula}</Text>
              </View>
            </View>

            {/* Row: CPF */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="shield-account-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>CPF</Text>
                <Text style={styles.infoVal}>{cpf}</Text>
              </View>
            </View>

            {/* Row: Data de Nascimento */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Data de Nascimento</Text>
                <Text style={[styles.infoVal, !dataNascimento && styles.infoValEmpty]}>
                  {dataNascimento || '—'}
                </Text>
              </View>
            </View>

            {/* Row: Naturalidade */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="map-marker-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Naturalidade</Text>
                <Text style={[styles.infoVal, !naturalidade && styles.infoValEmpty]}>
                  {naturalidade || '—'}
                </Text>
              </View>
            </View>

            {/* Row: Telefone */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="phone-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Telefone</Text>
                <Text style={[styles.infoVal, !telefone && styles.infoValEmpty]}>
                  {telefone || '—'}
                </Text>
              </View>
            </View>

            {/* Group: Situação Escolar */}
            <Text style={[styles.infoGroupTitle, { marginTop: 4 }]}>Situação Escolar</Text>

            {/* Row: Turma */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="google-classroom" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Turma</Text>
                <Text style={styles.infoVal}>{turma}</Text>
              </View>
            </View>

            {/* Row: Ano Letivo */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="calendar-clock-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Ano Letivo</Text>
                <Text style={styles.infoVal}>{anoLetivo}</Text>
              </View>
            </View>

            {/* Row: Status da Matrícula */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="check-circle-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Status da Matrícula</Text>
                <Text style={[styles.infoVal, { color: COLORS.green, fontWeight: '700' }]}>{statusMatricula || '—'}</Text>
              </View>
            </View>

            {/* Row: Situação Geral */}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <MaterialCommunityIcons name="trophy-outline" size={14} color={COLORS.cyan} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoKey}>Situação Geral</Text>
                <Text style={[styles.infoVal, { color: COLORS.green, fontWeight: '700' }]}>{getSituacaoGeral()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Responsáveis Section */}
        <View style={[styles.section, { marginTop: 16 }]}>
          <View style={styles.sectionTitle}>
            <MaterialCommunityIcons name="account-group-outline" size={16} color={COLORS.cyan} />
            <Text style={styles.sectionTitleText}>Responsáveis</Text>
          </View>
          {responsaveis.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="account-multiple-outline" size={32} color={COLORS.muted} style={{ opacity: 0.35, marginBottom: 8 }} />
              <Text style={styles.emptyBoxText}>Nenhum responsável cadastrado.</Text>
            </View>
          ) : (
            <View style={styles.infoCard}>
              {responsaveis.map((resp, idx) => (
                <View key={idx} style={[styles.infoRow, idx === responsaveis.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.infoIcon}>
                    <MaterialCommunityIcons name="account-outline" size={14} color={COLORS.cyan} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoKey}>{resp.parentesco || 'Responsável'}</Text>
                    <Text style={styles.infoVal}>{resp.nome}</Text>
                    {resp.telefone && resp.telefone !== '—' && (
                      <Text style={{ fontSize: 11, color: COLORS.label, marginTop: 2 }}>
                        Telefone: {resp.telefone}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>SIGE · Sistema Integrado de Gestão Escolar</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Dynamic Dark-Themed Edit Modal */}
      <Modal transparent visible={isModalOpen} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Informações do Perfil</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionLabel}>Identificação</Text>
              
              <Text style={styles.inputLabel}>NOME COMPLETO</Text>
              <TextInput
                style={styles.textInput}
                value={tempNome}
                onChangeText={setTempNome}
                placeholder="Nome do Aluno"
                placeholderTextColor={COLORS.muted}
              />

              <Text style={styles.inputLabel}>CPF</Text>
              <TextInput
                style={styles.textInput}
                value={tempCpf}
                onChangeText={setTempCpf}
                placeholder="000.000.000-00"
                placeholderTextColor={COLORS.muted}
              />

              <Text style={styles.inputLabel}>DATA DE NASCIMENTO</Text>
              <TextInput
                style={styles.textInput}
                value={tempDataNascimento}
                onChangeText={setTempDataNascimento}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={COLORS.muted}
              />

              <Text style={styles.inputLabel}>NATURALIDADE</Text>
              <TextInput
                style={styles.textInput}
                value={tempNaturalidade}
                onChangeText={setTempNaturalidade}
                placeholder="Cidade - UF"
                placeholderTextColor={COLORS.muted}
              />

              <Text style={styles.inputLabel}>TELEFONE</Text>
              <TextInput
                style={styles.textInput}
                value={tempTelefone}
                onChangeText={setTempTelefone}
                placeholder="(00) 00000-0000"
                placeholderTextColor={COLORS.muted}
                keyboardType="phone-pad"
              />

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.modalBtnSaveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  nav: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.bg,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16232d',
    borderColor: 'rgba(46, 204, 113, 0.3)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  toastText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  profileCard: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  profileBanner: {
    height: 80,
    position: 'relative',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(79, 127, 255, 0.05)',
  },
  profileBody: {
    paddingHorizontal: 16,
    marginTop: -28,
    position: 'relative',
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: COLORS.bg,
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  avatarDot: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.green,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.bg,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  profileMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItemText: {
    fontSize: 11,
    color: COLORS.label,
    maxWidth: width * 0.45,
  },
  badgeAtivo: {
    backgroundColor: 'rgba(46, 204, 113, 0.18)',
    borderColor: 'rgba(46, 204, 113, 0.35)',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeAtivoText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 0,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  btnPrimaryContainer: {
    flex: 1,
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
  },
  btnPrimaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  btnPrimaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statCard: {
    width: (width - 42) / 2,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconBlue: {
    backgroundColor: COLORS.blueDim,
  },
  statIconCyan: {
    backgroundColor: COLORS.cyanDim,
  },
  statIconGreen: {
    backgroundColor: COLORS.greenDim,
  },
  statIconYellow: {
    backgroundColor: COLORS.yellowDim,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  statValueRed: {
    color: COLORS.red,
  },
  statValueGreen: {
    color: COLORS.green,
  },
  statValueWhite: {
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: COLORS.muted,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cyan,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoGroupTitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.3,
    color: COLORS.muted,
    paddingVertical: 10,
    paddingHorizontal: 14,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.card2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoKey: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.9,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoValEmpty: {
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  emptyBox: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBoxText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 16,
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0d1017',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.cyan,
    letterSpacing: 1.1,
    marginTop: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  inputLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.label,
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    color: COLORS.text,
    fontSize: 13,
  },
  flexInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActions: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalBtnCancelText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  modalBtnSave: {
    backgroundColor: COLORS.blue,
  },
  modalBtnSaveText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
