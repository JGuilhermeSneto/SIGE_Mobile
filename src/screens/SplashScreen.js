import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar,
  Easing,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function SplashScreen({ navigation, route }) {
  const nextScreen = route.params?.nextScreen || 'Login';
  const customMessage = route.params?.message || 'INICIANDO AMBIENTE SEGURO';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  const [step, setStep] = useState(0);

  const STROKE_DASHARRAY = 238.76;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: 1, duration: 3500, easing: Easing.linear, useNativeDriver: false }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, { toValue: 0.95, duration: 1500, useNativeDriver: true }),
          Animated.timing(logoPulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      )
    ]).start();

    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => setStep(3), 2800);

    const timer = setTimeout(() => {
      navigation.replace(nextScreen);
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(timer);
    };
  }, [nextScreen]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [STROKE_DASHARRAY, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        {/* Top Header: Ring + Official Logo Image (Horizontal) */}
        <View style={styles.headerRow}>
          <View style={styles.ringContainer}>
            <Svg width="80" height="80" viewBox="0 0 80 80" style={styles.svg}>
              <Defs>
                <LinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#22d3ee" />
                  <Stop offset="100%" stopColor="#7c6fff" />
                </LinearGradient>
              </Defs>
              <Circle cx="40" cy="40" r="38" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2.5" fill="none" />
              <AnimatedCircle 
                cx="40" cy="40" r="38" stroke="url(#ringGrad)" strokeWidth="3" fill="none" 
                strokeDasharray={STROKE_DASHARRAY} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" transform="rotate(-90 40 40)"
              />
            </Svg>
            <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
            </Animated.View>
          </View>
          
          <View style={styles.titleContainer}>
             <Text style={styles.brandName}>SIGE</Text>
             <View style={styles.titleGlow} />
          </View>
        </View>

        <Text style={styles.brandSub}>{customMessage}</Text>

        {/* Checklist Area */}
        <View style={styles.checklist}>
          <View style={styles.stepRow}>
            <MaterialCommunityIcons 
              name={step >= 1 ? "check-circle" : "circle-outline"} 
              size={18} color={step >= 1 ? "#34d399" : "#1e293b"} 
            />
            <Text style={[styles.stepText, step >= 1 && styles.stepDone]}>Carregando módulos</Text>
          </View>
          
          <View style={styles.stepRow}>
            <MaterialCommunityIcons 
              name={step >= 2 ? "check-circle" : "circle-outline"} 
              size={18} color={step >= 2 ? "#34d399" : "#1e293b"} 
            />
            <Text style={[styles.stepText, step >= 2 && styles.stepDone]}>Verificando sessão</Text>
          </View>
          
          <View style={styles.stepRow}>
            <MaterialCommunityIcons 
              name={step >= 3 ? "check-circle" : "circle-outline"} 
              size={18} color={step >= 3 ? "#34d399" : "#1e293b"} 
            />
            <Text style={[styles.stepText, step >= 3 && styles.stepDone]}>Preparando interface</Text>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#060912', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  ringContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  logoImage: {
    width: 35,
    height: 35,
  },
  titleContainer: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 52,
    fontWeight: '900',
    color: '#22d3ee',
    letterSpacing: 2,
    shadowColor: '#7c6fff',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  brandSub: {
    fontSize: 10,
    color: '#475569',
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 50,
    textAlign: 'center',
  },
  checklist: {
    width: '100%',
    paddingLeft: '15%',
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  stepDone: {
    color: '#34d399',
  }
});
