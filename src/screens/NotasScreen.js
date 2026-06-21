import React, { useState, useEffect } from 'react';
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
import { getBoletim } from '../services/api';
import { ActivityIndicator } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

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

function DesempenhoChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartHeight = 160;
  const paddingLeft = 30;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const barWidth = 18;
  const barSpacing = 28;
  const totalWidth = paddingLeft + paddingRight + data.length * (barWidth + barSpacing);
  const contentHeight = chartHeight - paddingTop - paddingBottom;
  
  const yLines = [10, 7, 5];

  const getBarColor = (media) => {
    if (media >= 7.0) return 'url(#gradEmerald)';
    if (media >= 5.0) return 'url(#gradAmber)';
    return 'url(#gradRuby)';
  };

  return (
    <View style={styles.chartWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
        <Svg width={totalWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="gradEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
            </LinearGradient>
            <LinearGradient id="gradAmber" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#fbbf24" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4} />
            </LinearGradient>
            <LinearGradient id="gradRuby" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
              <Stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
            </LinearGradient>
          </Defs>

          {/* Reference Line Y = 7.0 (Pass) */}
          {yLines.map((val) => {
            const y = paddingTop + contentHeight - (val / 10) * contentHeight;
            const isPassLine = val === 7;
            return (
              <React.Fragment key={val}>
                <Line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={totalWidth - paddingRight} 
                  y2={y} 
                  stroke={isPassLine ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255,255,255,0.06)'} 
                  strokeWidth={isPassLine ? 1.5 : 1}
                  strokeDasharray={isPassLine ? "4 4" : undefined}
                />
                <SvgText 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  fill={isPassLine ? COLORS.accentCyan : COLORS.textDim} 
                  fontSize={8} 
                  fontWeight={isPassLine ? "700" : "500"}
                  textAnchor="end"
                >
                  {val.toFixed(1)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Bars and Labels */}
          {data.map((item, idx) => {
            const x = paddingLeft + idx * (barWidth + barSpacing) + barSpacing / 2;
            const barHeight = (item.media / 10) * contentHeight;
            const y = paddingTop + contentHeight - barHeight;

            return (
              <React.Fragment key={idx}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx={4}
                  ry={4}
                  fill={getBarColor(item.media)}
                />
                
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fill={item.media >= 7.0 ? COLORS.accentEmerald : (item.media >= 5.0 ? COLORS.accentAmber : COLORS.accentRuby)}
                  fontSize={9}
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {item.media.toFixed(1)}
                </SvgText>

                <SvgText
                  x={x + barWidth / 2}
                  y={paddingTop + contentHeight + 16}
                  fill={COLORS.textSecondary}
                  fontSize={9}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {item.disciplina}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [boletimData, setBoletimData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBoletim = async () => {
      try {
        const data = await getBoletim();
        if (isMounted) {
          setBoletimData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchBoletim();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accentViolet} />
          <Text style={styles.loadingText}>Carregando boletim escolar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!boletimData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgBase} />
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={COLORS.accentRuby} />
          <Text style={styles.errorText}>Erro ao carregar boletim.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); }}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const chartData = boletimData && boletimData.boletim
    ? boletimData.boletim.map(item => ({
        disciplina: item.nome.length > 5 ? item.nome.substring(0, 4).toUpperCase() : item.nome.toUpperCase(),
        media: item.media === '--' ? 0.0 : parseFloat(String(item.media).replace(',', '.'))
      }))
    : [];

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
            <Text style={styles.heroValue}>{boletimData.media_geral.toFixed(1)}</Text>
            <Text style={styles.heroLabel}>Média Geral</Text>
          </View>
          <View style={styles.heroCard}>
            <MaterialCommunityIcons name="calendar-check" size={32} color={COLORS.accentCyan} style={{ marginBottom: 10 }} />
            <Text style={styles.heroValue}>{boletimData.frequencia_total}%</Text>
            <Text style={styles.heroLabel}>Frequência Total</Text>
          </View>
        </View>

        {/* Gráfico de Desempenho */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Análise de Desempenho</Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.accentEmerald }]} />
              <Text style={styles.legendText}>≥ 7.0</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.accentAmber }]} />
              <Text style={styles.legendText}>5.0-6.9</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.accentRuby }]} />
              <Text style={styles.legendText}>&lt; 5.0</Text>
            </View>
          </View>
        </View>
        
        <DesempenhoChart data={chartData} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notas por Disciplina</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2026</Text>
          </View>
        </View>

        {/* Lista de Disciplinas */}
        <View style={styles.listContainer}>
          {boletimData.boletim && boletimData.boletim.length > 0 ? (
            boletimData.boletim.map(disc => (
              <NotaAccordion key={disc.id} item={disc} />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma nota registrada até o momento.</Text>
          )}
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
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgBase, gap: 15 },
  loadingText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  emptyText: { color: COLORS.textDim, fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginVertical: 20 },
  retryBtn: { marginTop: 15, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: COLORS.accentViolet, borderRadius: 8 },
  retryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  errorText: { color: COLORS.accentRuby, fontSize: 14, fontWeight: '600', marginTop: 10 },
  
  chartWrapper: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    marginBottom: 30,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});

