import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAtividades } from '../services/api';

const { width } = Dimensions.get('window');

// Mock Data
const ALL_ACTIVITIES = [
  { 
    id: 1, 
    titulo: 'Trabalho: Inteligência Artificial e Sociedade', 
    disciplina: 'SOCIOLOGIA', 
    professor: 'Fernando Costa', 
    tipo: 'trabalhos', 
    prazo: '20/05/2026 - 23:59', 
    status: 'pendente',
    descricao: 'Desenvolver um ensaio crítico sobre os impactos da IA no mercado de trabalho atual.'
  },
  { 
    id: 2, 
    titulo: 'Lista de Exercícios: Cálculo Diferencial', 
    disciplina: 'MATEMÁTICA', 
    professor: 'Fernando Costa', 
    tipo: 'atividades', 
    prazo: '18/05/2026 - 18:00', 
    status: 'entregue',
    descricao: 'Resolver os exercícios da página 45 a 50 do livro didático.',
    nota: '9.5'
  },
  { 
    id: 3, 
    titulo: 'Prova Trimestral: Óptica e Ondulatória', 
    disciplina: 'FÍSICA', 
    professor: 'Dani Alves', 
    tipo: 'provas', 
    data: '22/05/2026', 
    status: 'agendado',
    descricao: 'Conteúdo: Reflexão, Refração, Lentes e Fenômenos Ondulatórios.'
  },
  { 
    id: 4, 
    titulo: 'Trabalho em Grupo: Sustentabilidade', 
    disciplina: 'GEOGRAFIA', 
    professor: 'Armando Varal', 
    tipo: 'trabalhos', 
    prazo: '25/05/2026 - 23:59', 
    status: 'pendente',
    descricao: 'Criar um projeto de reciclagem para a escola utilizando materiais de baixo custo.'
  },
  { 
    id: 5, 
    titulo: 'Redação: O Papel da Tecnologia na Educação', 
    disciplina: 'LINGUA PORTUGUESA', 
    professor: 'Julia Batola', 
    tipo: 'atividades', 
    prazo: '16/05/2026 - 23:59', 
    status: 'corrigido',
    descricao: 'Escrever um texto dissertativo-argumentativo entre 20 e 30 linhas.',
    nota: '8.0',
    feedback: true
  },
];

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

function ActivityCard({ item }) {
  const isPendente = item.status === 'pendente' || item.status === 'agendado';
  const isEntregue = item.status === 'entregue';
  const isCorrigido = item.status === 'corrigido';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.profInfo}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={18} color={COLORS.textMuted} />
          </View>
          <View>
            <Text style={styles.disciplinaText}>{item.disciplina}</Text>
            <Text style={styles.professorText}>Prof. {item.professor}</Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge, 
          isPendente && styles.statusPendente,
          isEntregue && styles.statusEntregue,
          isCorrigido && styles.statusCorrigido
        ]}>
          <MaterialCommunityIcons 
            name={isPendente ? "clock-outline" : (isEntregue ? "send-outline" : "check-all")} 
            size={12} 
            color={isPendente ? COLORS.accentAmber : (isEntregue ? COLORS.accentEmerald : COLORS.accentCyan)} 
          />
          <Text style={[
            styles.statusText,
            isPendente && { color: COLORS.accentAmber },
            isEntregue && { color: COLORS.accentEmerald },
            isCorrigido && { color: COLORS.accentCyan }
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.tituloText}>{item.titulo}</Text>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="calendar-range" size={14} color={COLORS.accentViolet} />
        <Text style={styles.infoLabel}>
          {item.tipo === 'provas' ? 'Data: ' : 'Prazo: '}
          <Text style={styles.infoValue}>{item.tipo === 'provas' ? item.data : item.prazo}</Text>
        </Text>
      </View>

      <Text style={styles.descText} numberOfLines={2}>
        {item.descricao}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          {item.nota && (
            <Text style={styles.notaText}>Nota: {item.nota}</Text>
          )}
          {item.feedback && (
            <View style={styles.feedbackBadge}>
              <MaterialCommunityIcons name="comment-text-outline" size={10} color={COLORS.accentViolet} />
              <Text style={styles.feedbackText}>Correção</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.btnAction}>
          <Text style={styles.btnActionText}>
            {isEntregue || isCorrigido ? 'Ver / Editar' : 'Entregar Agora'}
          </Text>
          <MaterialCommunityIcons 
            name={isEntregue || isCorrigido ? "eye-outline" : "upload-outline"} 
            size={14} 
            color={COLORS.textPrimary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AtividadesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('trabalhos');
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const data = await getAtividades();
      
      const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return dateStr;
          return d.toLocaleDateString('pt-BR') + ' - ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return dateStr;
        }
      };

      const formatDateOnly = (dateStr) => {
        if (!dateStr) return '—';
        try {
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return dateStr;
        } catch (e) {
          return dateStr;
        }
      };

      const mapped = (data || []).map(act => {
        const isExpired = act.prazo_final ? new Date() > new Date(act.prazo_final) : (act.data ? new Date() > new Date(act.data) : false);
        let resolvedStatus = 'pendente';
        if (act.tipo === 'PROVA') {
          resolvedStatus = isExpired ? 'encerrado' : 'agendado';
        } else {
          resolvedStatus = isExpired ? 'encerrado' : 'pendente';
        }

        return {
          id: act.id,
          titulo: act.titulo,
          disciplina: act.disciplina_nome || 'DISCIPLINA',
          professor: act.professor_nome || 'Professor',
          tipo: act.tipo === 'TRABALHO' ? 'trabalhos' : (act.tipo === 'ATIVIDADE' ? 'atividades' : 'provas'),
          prazo: act.prazo_final ? formatDate(act.prazo_final) : '—',
          data: act.data ? formatDateOnly(act.data) : '—',
          status: resolvedStatus,
          descricao: act.descricao || 'Sem descrição cadastrada.',
        };
      });

      setActivities(mapped);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as atividades.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(act => act.tipo === activeTab);

  const TabButton = ({ id, label, icon }) => (
    <TouchableOpacity 
      style={[styles.tabBtn, activeTab === id && styles.tabBtnActive]} 
      onPress={() => setActiveTab(id)}
    >
      <MaterialCommunityIcons 
        name={icon} 
        size={18} 
        color={activeTab === id ? '#fff' : COLORS.textMuted} 
      />
      <Text style={[styles.tabBtnText, activeTab === id && styles.tabBtnTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
      
      {/* Header SIGE */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={{ fontSize: 18 }}>📖</Text>
          </View>
          <Text style={styles.logoText}>SIGE</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voltar */}
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={16} color={COLORS.textMuted} />
          <Text style={styles.backBtnText}>Voltar ao Painel</Text>
        </TouchableOpacity>

        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>SIGE · </Text>
          <Text style={styles.breadcrumbHighlight}>PORTAL DO ALUNO</Text>
        </View>

        <Text style={styles.pageTitle}>
          Minhas <Text style={{ color: COLORS.accentViolet }}>Atividades</Text>
        </Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton id="trabalhos" label="Trabalhos" icon="file-document-outline" />
          <TabButton id="atividades" label="Atividades" icon="clipboard-list-outline" />
          <TabButton id="provas" label="Provas" icon="school-outline" />
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(item => (
              <ActivityCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="folder-open-outline" size={48} color={COLORS.bgHover} />
              <Text style={styles.emptyText}>Nenhum registro encontrado nesta categoria.</Text>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBase,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  breadcrumb: {
    flexDirection: 'row',
    marginTop: 15,
  },
  breadcrumbText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  breadcrumbHighlight: {
    color: COLORS.accentCyan,
    fontSize: 12,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 5,
    marginBottom: 25,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgSurface,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 25,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: COLORS.accentViolet,
    shadowColor: COLORS.accentViolet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  tabBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#fff',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderMid,
  },
  disciplinaText: {
    color: COLORS.accentViolet,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  professorText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPendente: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  statusEntregue: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
  },
  statusCorrigido: {
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tituloText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  infoValue: {
    fontWeight: '700',
  },
  descText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 15,
  },
  cardFooter: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notaText: {
    color: COLORS.accentEmerald,
    fontSize: 16,
    fontWeight: '800',
  },
  feedbackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 111, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  feedbackText: {
    color: COLORS.accentViolet,
    fontSize: 10,
    fontWeight: '700',
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgHover,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderMid,
  },
  btnActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: 13,
    marginTop: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});