import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const DISCIPLINAS_NOTAS = [
  { 
    id: 1, 
    nome: 'MATEMÁTICA', 
    media: '8.5', 
    status: 'aprovado',
    notas: { b1: '8.0', b2: '9.0', b3: '8.5', b4: '--' },
    freq: 92
  },
  { 
    id: 2, 
    nome: 'FÍSICA', 
    media: '6.5', 
    status: 'recuperacao',
    notas: { b1: '5.5', b2: '7.5', b3: '--', b4: '--' },
    freq: 85
  },
  { 
    id: 3, 
    nome: 'BIOLOGIA', 
    media: '9.2', 
    status: 'aprovado',
    notas: { b1: '9.0', b2: '9.5', b3: '9.0', b4: '--' },
    freq: 98
  },
  { 
    id: 4, 
    nome: 'HISTÓRIA', 
    media: '4.5', 
    status: 'reprovado',
    notas: { b1: '4.0', b2: '5.0', b3: '4.5', b4: '--' },
    freq: 70
  }
];

const getStatusColor = (status) => {
  if (status === 'aprovado') return COLORS.accentEmerald;
  if (status === 'recuperacao') return COLORS.accentAmber;
  return COLORS.accentRuby;
};

const getNotaColor = (notaStr) => {
  if (notaStr === '--') return COLORS.textDim;
  const nota = parseFloat(notaStr);
  if (isNaN(nota)) return COLORS.textDim;
  if (nota >= 7) return COLORS.accentEmerald;
  if (nota >= 5) return COLORS.accentAmber;
  return COLORS.accentRuby;
};

function NotaAccordion({ item }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: `${getStatusColor(item.status)}15` }]}>
            <MaterialCommunityIcons 
              name={item.status === 'aprovado' ? "check-decagram" : item.status === 'recuperacao' ? "alert-circle" : "close-octagon"} 
              size={20} 
              color={getStatusColor(item.status)} 
            />
          </View>
          <View>
            <Text style={styles.subjectName}>{item.nome}</Text>
            <Text style={styles.subjectStatus}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.mediaWrap}>
            <Text style={styles.mediaLabel}>Média</Text>
            <Text style={[styles.mediaValue, { color: getStatusColor(item.status) }]}>{item.media}</Text>
          </View>
          <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.textMuted} />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          <View style={styles.bimestresGrid}>
            {Object.entries(item.notas).map(([bim, nota], i) => (
              <View key={bim} style={styles.bimestreBox}>
                <Text style={styles.bimestreLabel}>{i + 1}º BIM</Text>
                <Text style={[styles.bimestreNota, { color: getNotaColor(nota) }]}>{nota}</Text>
              </View>
            ))}
          </View>
          <View style={styles.freqRow}>
            <MaterialCommunityIcons name="calendar-check" size={14} color={COLORS.textDim} />
            <Text style={styles.freqText}>Frequência na disciplina: <Text style={{ color: COLORS.textPrimary, fontWeight: '700' }}>{item.freq}%</Text></Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function NotasScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
      
      {/* Header Fixo */}
      <View style={styles.appHeader}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
          <MaterialCommunityIcons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Boletim Escolar</Text>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name="tray-arrow-down" size={22} color={COLORS.accentCyan} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Resumo Global (Hero) */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCard}>
            <MaterialCommunityIcons name="chart-box" size={32} color={COLORS.accentEmerald} style={{ marginBottom: 10 }} />
            <Text style={styles.heroValue}>7.8</Text>
            <Text style={styles.heroLabel}>Média Geral</Text>
          </View>
          <View style={styles.heroCard}>
            <MaterialCommunityIcons name="calendar-check" size={32} color={COLORS.accentCyan} style={{ marginBottom: 10 }} />
            <Text style={styles.heroValue}>86%</Text>
            <Text style={styles.heroLabel}>Frequência Total</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notas por Disciplina</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2026</Text>
          </View>
        </View>

        {/* Lista de Disciplinas */}
        <View style={styles.listContainer}>
          {DISCIPLINAS_NOTAS.map(disc => (
            <NotaAccordion key={disc.id} item={disc} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBase,
  },
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
  menuBtn: {
    padding: 5,
    marginLeft: -5
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.5
  },
  actionBtn: {
    padding: 5,
    marginRight: -5
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  heroContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30
  },
  heroCard: {
    flex: 1,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  badge: {
    backgroundColor: 'rgba(124, 111, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 111, 255, 0.3)'
  },
  badgeText: {
    color: COLORS.accentViolet,
    fontSize: 11,
    fontWeight: '800'
  },
  listContainer: {
    gap: 12
  },
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2
  },
  subjectStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  mediaWrap: {
    alignItems: 'flex-end'
  },
  mediaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  mediaValue: {
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0
  },
  bimestresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 12,
    padding: 12,
    marginTop: 5
  },
  bimestreBox: {
    alignItems: 'center',
    flex: 1
  },
  bimestreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4
  },
  bimestreNota: {
    fontSize: 16,
    fontWeight: '800'
  },
  freqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    justifyContent: 'center'
  },
  freqText: {
    fontSize: 12,
    color: COLORS.textSecondary
  }
});

