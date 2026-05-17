import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

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

// Mock data com mais detalhes do SIGE
const SUMMARY_CARDS = [
  { id: 1, title: 'Disciplinas', value: '12', icon: 'book-open-variant', color: COLORS.accentViolet },
  { id: 2, title: 'Média Geral', value: '8.7', icon: 'chart-box-outline', color: COLORS.accentEmerald },
  { id: 3, title: 'Situação', value: 'Aprovado', icon: 'check-decagram', color: COLORS.accentCyan },
  { id: 4, title: 'Faltas', value: '15/120', icon: 'account-alert-outline', color: COLORS.accentRuby },
];

const DISCIPLINAS = [
  { 
    id: 1, 
    nome: 'MATEMÁTICA', 
    prof: 'Fernando Costa', 
    media: '8.7', 
    status: 'aprovado',
    notas: { b1: '8.5', b2: '9.0', b3: '--', b4: '--' },
    faltas: 4, 
    total: 40,
    materiais: ['Geometria Espacial.pdf', 'Lista Exercícios.pdf']
  },
  { 
    id: 2, 
    nome: 'LÍNGUA PORTUGUESA', 
    prof: 'Julia Batola', 
    media: '7.2', 
    status: 'aprovado',
    notas: { b1: '7.0', b2: '7.5', b3: '--', b4: '--' },
    faltas: 2, 
    total: 40,
    materiais: ['Redação Enem.pdf']
  }
];

function PulseBadge() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.muralBadge, { transform: [{ scale: pulseAnim }] }]}>
      <Text style={styles.muralBadgeText}>NOVO</Text>
    </Animated.View>
  );
}

function DisciplineAccordion({ item }) {
  const [expanded, setExpanded] = useState(false);
  const getCol = (s) => s === 'aprovado' ? COLORS.accentEmerald : (s === 'recuperacao' ? COLORS.accentAmber : COLORS.accentRuby);

  return (
    <View style={styles.discCard}>
      <TouchableOpacity 
        style={styles.discHeader} 
        onPress={() => { LayoutAnimation.easeInEaseOut(); setExpanded(!expanded); }}
      >
        <View style={styles.discHeaderL}>
          <View style={styles.profAvatar}><MaterialCommunityIcons name="account" size={16} color={COLORS.textMuted} /></View>
          <View>
            <Text style={styles.discTitle}>{item.nome}</Text>
            <Text style={styles.profName}>Prof. {item.prof}</Text>
          </View>
        </View>
        <View style={styles.discHeaderR}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.mediaL}>Média</Text>
            <Text style={[styles.mediaV, { color: getCol(item.status) }]}>{item.media}</Text>
          </View>
          <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={COLORS.textDim} />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.discBody}>
          <View style={styles.notasGrid}>
            {Object.entries(item.notas).map(([k, v]) => (
              <View key={k} style={styles.notaBox}>
                <Text style={styles.notaL}>{k.replace('b', '')}º Bim</Text>
                <Text style={styles.notaV}>{v}</Text>
              </View>
            ))}
          </View>
          <View style={styles.frequenciaWrap}>
            <View style={styles.freqMeta}>
              <Text style={styles.freqL}>Faltas: {item.faltas}/{item.total}</Text>
              <Text style={styles.freqL}>{Math.round((item.faltas/item.total)*100)}% de faltas</Text>
            </View>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${(item.faltas/item.total)*100}%`, backgroundColor: (item.faltas/item.total) > 0.2 ? COLORS.accentRuby : COLORS.accentAmber }]} />
            </View>
          </View>
          {item.materiais && (
            <View style={styles.materiaisWrap}>
              <Text style={styles.matHeader}><MaterialCommunityIcons name="folder-open" size={10} color={COLORS.accentEmerald} /> MATERIAIS RECENTES</Text>
              {item.materiais.map(m => (
                <View key={m} style={styles.matItem}>
                  <MaterialCommunityIcons name="file-pdf-box" size={14} color={COLORS.accentRuby} />
                  <Text style={styles.matText}>{m}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const [activeDay, setActiveDay] = useState('Seg');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header - SIGE Original Style */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTop}>
              <MaterialCommunityIcons name="graduation-cap" size={14} color={COLORS.accentViolet} />
              <Text style={styles.headerLabel}>SIGE · PORTAL DO ALUNO</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <MaterialCommunityIcons name="menu" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerMain}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Olá, <Text style={styles.nameDestaque}>Guilherme</Text> 👋</Text>
              <Text style={styles.subGreeting}>3º Ano A · Turno Matutino</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Perfil')}>
              <View style={styles.avatarCircle}><MaterialCommunityIcons name="account" size={26} color={COLORS.textMuted} /></View>
            </TouchableOpacity>
          </View>

          {/* Action Buttons do SIGE */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons name="file-account" size={16} color={COLORS.textPrimary} />
              <Text style={styles.actionText}>Declaração</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <MaterialCommunityIcons name="printer" size={16} color={COLORS.textPrimary} />
              <Text style={styles.actionText}>Boletim PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Parental Control - Glass Design */}
        <View style={styles.parentalBanner}>
          <View style={styles.parentalIcon}><MaterialCommunityIcons name="shield-lock" size={20} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.parentalTitle}>Controle Parental Ativo</Text>
            <Text style={styles.parentalSub}>Acesso monitorado pelos responsáveis</Text>
          </View>
          <View style={styles.parentalBadge}><Text style={styles.parentalBadgeT}>MONITORADO</Text></View>
        </View>

        {/* Resumo Acadêmico */}
        <View style={styles.summaryGrid}>
          {SUMMARY_CARDS.map(card => (
            <TouchableOpacity 
              key={card.id} 
              style={styles.summaryCard} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate(card.screen)}
            >
              <View style={[styles.cardIcon, { backgroundColor: `${card.color}15` }]}>
                <MaterialCommunityIcons name={card.icon} size={22} color={card.color} />
              </View>
              <View>
                <Text style={styles.cardL}>{card.title}</Text>
                <Text style={[styles.cardV, { color: card.color }]}>{card.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disciplinas e Notas Accordion */}
        <Text style={styles.sectionTitle}><MaterialCommunityIcons name="book-open-variant" size={18} color={COLORS.accentViolet} /> Disciplinas e Notas</Text>
        <View style={styles.accordionList}>
          {DISCIPLINAS.map(d => <DisciplineAccordion key={d.id} item={d} />)}
        </View>

        {/* Widgets Grid: Mural e Desempenho */}
        <View style={styles.widgetsRow}>
          <View style={[styles.widget, { flex: 1.2 }]}>
            <View style={styles.widgetHeader}>
              <Text style={styles.widgetTitle}><MaterialCommunityIcons name="bullhorn" size={16} color={COLORS.accentCyan} /> Mural</Text>
              <PulseBadge />
            </View>
            <View style={styles.muralContent}>
              <Text style={styles.muralT} numberOfLines={1}>Reunião de Pais</Text>
              <Text style={styles.muralS}>Hoje · 19:00</Text>
            </View>
          </View>
          
          <View style={[styles.widget, { flex: 1 }]}>
            <View style={styles.widgetHeader}>
              <Text style={styles.widgetTitle}><MaterialCommunityIcons name="chart-arc" size={16} color={COLORS.accentEmerald} /> Desempenho</Text>
            </View>
            <View style={styles.chartMock}>
              <View style={[styles.bar, { height: '70%', backgroundColor: COLORS.accentViolet }]} />
              <View style={[styles.bar, { height: '90%', backgroundColor: COLORS.accentEmerald }]} />
              <View style={[styles.bar, { height: '50%', backgroundColor: COLORS.accentAmber }]} />
            </View>
          </View>
        </View>

        {/* Biblioteca: Livros em Posse */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}><MaterialCommunityIcons name="book-bookmark" size={18} color={COLORS.accentCyan} /> Livros em Minha Posse</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Ver Acervo</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.booksScroll}>
          <View style={styles.bookCard}>
            <View style={styles.bookCover}><MaterialCommunityIcons name="book-variant" size={30} color={COLORS.accentEmerald} /></View>
            <Text style={styles.bookT} numberOfLines={1}>Dom Casmurro</Text>
            <Text style={styles.bookA}>M. de Assis</Text>
            <View style={styles.bookBadge}><Text style={styles.bookBadgeT}>EM POSSE</Text></View>
          </View>
          <View style={styles.bookCard}>
            <View style={[styles.bookCover, { backgroundColor: 'rgba(244,63,94,0.1)' }]}><MaterialCommunityIcons name="book-variant" size={30} color={COLORS.accentRuby} /></View>
            <Text style={styles.bookT} numberOfLines={1}>Clean Code</Text>
            <Text style={styles.bookA}>Robert Martin</Text>
            <View style={[styles.bookBadge, { backgroundColor: 'rgba(244,63,94,0.1)' }]}><Text style={[styles.bookBadgeT, { color: COLORS.accentRuby }]}>ATRASADO</Text></View>
          </View>
        </ScrollView>

        {/* Grade Horária Completa - Day Selector Style */}
        <Text style={styles.sectionTitle}><MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.accentAmber} /> Grade Horária</Text>
        <View style={styles.daySelector}>
          {['Seg','Ter','Qua','Qui','Sex'].map(d => (
            <TouchableOpacity key={d} style={[styles.dayBtn, activeDay === d && styles.dayBtnActive]} onPress={() => setActiveDay(d)}>
              <Text style={[styles.dayText, activeDay === d && styles.dayTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.gradeWidget}>
          {[ {t: '07:30', s: 'Matemática'}, {t: '08:20', s: 'Física'}, {t: '09:10', s: 'Intervalo'} ].map((g, i) => (
            <View key={i} style={styles.gradeRow}>
              <Text style={styles.gradeTime}>{g.t}</Text>
              <View style={[styles.gradeLine, { backgroundColor: g.s === 'Intervalo' ? COLORS.borderMid : COLORS.accentViolet }]} />
              <Text style={[styles.gradeSubject, g.s === 'Intervalo' && { color: COLORS.textDim }]}>{g.s}</Text>
            </View>
          ))}
        </View>

        {/* Botão Sair */}
        <TouchableOpacity style={styles.logoutBtn}>
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.accentRuby} />
          <Text style={styles.logoutText}>Encerrar Sessão Segura</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgBase },
  scroll: { flex: 1, paddingHorizontal: 20 },
  
  header: { marginTop: 20, marginBottom: 25 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLabel: { color: COLORS.accentViolet, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  headerMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  greeting: { color: '#fff', fontSize: 26, fontWeight: '800' },
  nameDestaque: { color: COLORS.accentViolet },
  subGreeting: { color: COLORS.textSecondary, fontSize: 13 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.borderSubtle },
  
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.bgHover, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: COLORS.borderMid },
  actionText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  parentalBanner: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 16, backgroundColor: 'rgba(124,111,255,0.05)', borderWidth: 1, borderColor: 'rgba(124,111,255,0.15)', marginBottom: 25 },
  parentalIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.accentViolet, alignItems: 'center', justifyContent: 'center' },
  parentalTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  parentalSub: { color: COLORS.textDim, fontSize: 11 },
  parentalBadge: { backgroundColor: 'rgba(124,111,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  parentalBadgeT: { color: COLORS.accentViolet, fontSize: 9, fontWeight: '900' },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  summaryCard: { width: (width - 50) / 2, backgroundColor: COLORS.bgSurface, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderSubtle, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardL: { color: COLORS.textMuted, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  cardV: { fontSize: 18, fontWeight: '900' },

  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginVertical: 15, flexDirection: 'row', alignItems: 'center', gap: 8 },
  accordionList: { gap: 12, marginBottom: 25 },
  discCard: { backgroundColor: COLORS.bgSurface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.borderSubtle, overflow: 'hidden' },
  discHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  discHeaderL: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.borderMid },
  discTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  profName: { color: COLORS.textMuted, fontSize: 11 },
  discHeaderR: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  mediaL: { color: COLORS.textDim, fontSize: 8, fontWeight: '700' },
  mediaV: { fontSize: 18, fontWeight: '900' },
  discBody: { padding: 15, paddingTop: 0, borderTopWidth: 1, borderTopColor: COLORS.borderSubtle },
  notasGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  notaBox: { alignItems: 'center' },
  notaL: { color: COLORS.textDim, fontSize: 9, fontWeight: '600' },
  notaV: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700' },
  frequenciaWrap: { marginTop: 20 },
  freqMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  freqL: { color: COLORS.textMuted, fontSize: 10, fontWeight: '600' },
  barContainer: { height: 4, backgroundColor: COLORS.bgElevated, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  materiaisWrap: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: COLORS.borderSubtle, borderStyle: 'dashed' },
  matHeader: { color: COLORS.accentEmerald, fontSize: 9, fontWeight: '800', marginBottom: 10 },
  matItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.bgHover, padding: 8, borderRadius: 8, marginBottom: 6 },
  matText: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '500' },

  widgetsRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  widget: { backgroundColor: COLORS.bgSurface, borderRadius: 16, padding: 15, borderWidth: 1, borderColor: COLORS.borderSubtle },
  widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  widgetTitle: { color: '#fff', fontSize: 13, fontWeight: '800' },
  muralBadge: { backgroundColor: COLORS.accentRuby, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  muralBadgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  muralContent: { gap: 2 },
  muralT: { color: '#fff', fontSize: 13, fontWeight: '700' },
  muralS: { color: COLORS.textMuted, fontSize: 10 },
  chartMock: { height: 40, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
  bar: { width: 8, borderRadius: 4 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { color: COLORS.accentViolet, fontSize: 12, fontWeight: '700' },
  booksScroll: { marginBottom: 25, marginTop: 10 },
  bookCard: { width: 140, backgroundColor: COLORS.bgSurface, borderRadius: 16, padding: 15, marginRight: 12, borderWidth: 1, borderColor: COLORS.borderSubtle, alignItems: 'center' },
  bookCover: { width: 60, height: 85, borderRadius: 8, backgroundColor: 'rgba(52,211,153,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  bookT: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  bookA: { color: COLORS.textDim, fontSize: 10, marginBottom: 8 },
  bookBadge: { backgroundColor: 'rgba(34,211,238,0.1)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  bookBadgeT: { color: COLORS.accentCyan, fontSize: 8, fontWeight: '800' },

  daySelector: { flexDirection: 'row', backgroundColor: COLORS.bgSurface, padding: 6, borderRadius: 12, marginBottom: 15, gap: 5 },
  dayBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  dayBtnActive: { backgroundColor: COLORS.accentViolet },
  dayText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  dayTextActive: { color: '#fff' },
  gradeWidget: { backgroundColor: COLORS.bgSurface, borderRadius: 16, padding: 15, borderWidth: 1, borderColor: COLORS.borderSubtle, marginBottom: 30 },
  gradeRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  gradeTime: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '700', width: 45 },
  gradeLine: { width: 4, height: 20, borderRadius: 2 },
  gradeSubject: { color: '#fff', fontSize: 15, fontWeight: '600' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, backgroundColor: 'rgba(248,113,113,0.05)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.1)' },
  logoutText: { color: COLORS.accentRuby, fontSize: 14, fontWeight: '700' }
});
