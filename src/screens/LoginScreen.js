import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  Easing,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Particle = ({ color, size, delay, duration, startX }) => {
  const posAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(posAnim, {
        toValue: 1,
        duration: duration,
        delay: delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = posAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -50],
  });

  const opacity = posAnim.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 0.4, 0.4, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.particle, 
        { 
          width: size, 
          height: size, 
          backgroundColor: color, 
          opacity: opacity,
          left: startX,
          transform: [{ translateY }],
        }
      ]} 
    />
  );
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const topBarAnim = useRef(new Animated.Value(0)).current;
  const ringFillAnim = useRef(new Animated.Value(0)).current;
  
  const feedbackFade = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.8)).current;

  const CIRCUMFERENCE = 2 * Math.PI * 46;

  useEffect(() => {
    const animations = Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.loop(
        Animated.timing(logoRotate, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, { toValue: 0.95, duration: 2000, useNativeDriver: true }),
          Animated.timing(logoPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(topBarAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(topBarAnim, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(ringFillAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
          Animated.timing(ringFillAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        ])
      )
    ]);
    
    animations.start();
    return () => animations.stop();
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navega para a SplashScreen de carregamento antes de ir para a Home
      navigation.replace('Splash', { 
        nextScreen: 'Main',
        message: 'Validando credenciais'
      });
    }, 1500);
  };

  const rotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeDashoffset = ringFillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#060912" />
      
      <Particle color="#7c6fff" size={4} delay={0} duration={18000} startX={width * 0.1} />
      <Particle color="#22d3ee" size={3} delay={4000} duration={22000} startX={width * 0.85} />
      <Particle color="#34d399" size={5} delay={2000} duration={15000} startX={width * 0.5} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            
            <Animated.View style={[styles.topLine, { opacity: topBarAnim }]}>
              <View style={styles.topLineGradient} />
            </Animated.View>

            <View style={styles.header}>
              <View style={styles.ringWrapper}>
                <Animated.View style={[styles.svgContainer, { transform: [{ rotate: rotation }] }]}>
                  <Svg width="110" height="110" viewBox="0 0 100 100">
                    <Defs>
                      <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#7c6fff" />
                        <Stop offset="100%" stopColor="#22d3ee" />
                      </LinearGradient>
                    </Defs>
                    <Circle cx="50" cy="50" r="46" stroke="rgba(124, 111, 255, 0.05)" strokeWidth="3" fill="none" />
                    <AnimatedCircle 
                      cx="50" cy="50" r="46" stroke="url(#grad)" strokeWidth="3.5" fill="none" 
                      strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                    />
                  </Svg>
                </Animated.View>
                <View style={styles.logoCircle}>
                  <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
                    <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
                  </Animated.View>
                </View>
              </View>
              <Text style={styles.title}>SIGE</Text>
              <Text style={styles.subtitle}>SISTEMA INTEGRADO DE GESTÃO ESCOLAR</Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>IDENTIFICAÇÃO</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-MAIL CORPORATIVO</Text>
                <View style={[styles.inputBox, focusedField === 'email' && styles.inputFocused]}>
                  <MaterialCommunityIcons 
                    name={(email.length > 0 || focusedField === 'email') ? "email-open-outline" : "email-outline"} 
                    size={20} color={(email.length > 0 || focusedField === 'email') ? "#7c6fff" : "#475569"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="E-mail"
                    placeholderTextColor="#475569"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CHAVE DE ACESSO</Text>
                <View style={[styles.inputBox, focusedField === 'pass' && styles.inputFocused]}>
                  <MaterialCommunityIcons 
                    name={(password.length > 0 || focusedField === 'pass') ? "lock-open-variant-outline" : "lock-outline"} 
                    size={20} color={(password.length > 0 || focusedField === 'pass') ? "#22d3ee" : "#475569"} 
                    style={styles.inputIcon} 
                  />
                  <TextInput 
                    style={styles.textInput}
                    placeholder="Senha"
                    placeholderTextColor="#475569"
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedField('pass')}
                    onBlur={() => setFocusedField(null)}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color="#475569" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.connectBtn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.connectBtnText}>CONECTAR</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotBtnText}>Solicitar nova senha</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FEEDBACK OVERLAY (Login Animation) */}
      {showFeedback && (
        <Animated.View style={[styles.feedbackOverlay, { opacity: feedbackFade }]}>
          <Animated.View style={[styles.feedbackBox, { transform: [{ scale: feedbackScale }] }]}>
            <View style={styles.feedbackIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={40} color="#34d399" />
            </View>
            <Text style={styles.feedbackMsg}>Conexão Estabelecida</Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#060912' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  card: { width: width * 0.9, backgroundColor: '#0c111d', borderRadius: 24, padding: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  topLine: { position: 'absolute', top: 0, left: 40, right: 40, height: 2, zIndex: 10 },
  topLineGradient: { flex: 1, backgroundColor: '#7c6fff', shadowColor: '#22d3ee', shadowOffset: { width: 0, height: 0 }, shadowRadius: 10, shadowOpacity: 1 },
  header: { alignItems: 'center', marginBottom: 30 },
  ringWrapper: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  svgContainer: { position: 'absolute', width: 110, height: 110, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0c111d', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(124, 111, 255, 0.1)', zIndex: 2 },
  logoImage: { width: 50, height: 50 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 10, color: '#22d3ee', fontWeight: '800', letterSpacing: 1, marginTop: 5, textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(71, 85, 105, 0.3)' },
  dividerText: { fontSize: 10, color: '#475569', marginHorizontal: 15, fontWeight: '700', letterSpacing: 1.5 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, color: '#475569', fontWeight: '800', marginBottom: 10, letterSpacing: 1 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(71, 85, 105, 0.3)', paddingHorizontal: 18, height: 55 },
  inputFocused: { borderColor: '#7c6fff' },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, color: '#fff', fontSize: 15 },
  connectBtn: { backgroundColor: '#8b80ff', borderRadius: 14, height: 60, alignItems: 'center', justifyContent: 'center', marginTop: 15, shadowColor: '#7c6fff', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 },
  connectBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
  forgotBtn: { marginTop: 25, alignItems: 'center' },
  forgotBtnText: { color: '#475569', fontSize: 13 },
  particle: { position: 'absolute', borderRadius: 10, zIndex: 0 },
  
  // Feedback Overlay Styles
  feedbackOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(6, 9, 18, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  feedbackBox: {
    backgroundColor: '#0c111d',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  feedbackIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  feedbackMsg: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  }
});
