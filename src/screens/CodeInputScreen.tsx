import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { validarCodigo } from '../hooks/useQuiz';
import { obterTitulo } from '../data/gabarito';
import { theme } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CodeInput'>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export const CodeInputScreen: React.FC<Props> = ({ navigation }) => {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleConfirmar = () => {
    if (codigo.length !== 3) {
      setErro('Digite exatamente 3 dígitos.');
      shake();
      return;
    }
    if (!validarCodigo(codigo)) {
      setErro(`Código "${codigo}" não encontrado.`);
      shake();
      return;
    }
    setErro('');
    navigation.navigate('Quiz', { codigo });
  };

  const handleChange = (text: string) => {
    const numeros = text.replace(/[^0-9]/g, '').slice(0, 3);
    setCodigo(numeros);
    if (erro) setErro('');
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>

          {/* ─── TecToy Header ─────────────────────────────── */}
          <View style={styles.header}>
            <View style={styles.tectoyHeader}>
              <Text style={styles.tectoyLogo}>TECTOY</Text>
            </View>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>PENSE</Text>
              <View style={styles.logoDot} />
              <Text style={styles.logoText}>BEM</Text>
            </View>
            <Text style={styles.tagline}>QUIZ EDUCATIVO</Text>
          </View>

          {/* ─── Display Panel ──────────────────────────────── */}
          <Animated.View
            style={[styles.panel, { transform: [{ translateX: shakeAnim }] }]}
          >
            {/* LCD display */}
            <View style={styles.lcdFrame}>
              <View style={styles.lcd}>
                <Text style={styles.lcdLabel}>CÓDIGO DO PROGRAMA</Text>
                <View style={styles.digitRow}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={styles.digitBox}>
                      <Text style={styles.digitText}>
                        {codigo[i] || '_'}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.lcdHint}>
                  {codigo.length === 0
                    ? 'Livro: --  Programa: -'
                    : codigo.length <= 2
                    ? `Livro: ${codigo.padEnd(2, '-')}  Programa: -`
                    : `Livro: ${codigo.slice(0, 2)}  Programa: ${codigo.slice(2)}`}
                </Text>
                {codigo.length === 3 && validarCodigo(codigo) && (
                  <Text
                    style={styles.lcdTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {obterTitulo(codigo) || ''}
                  </Text>
                )}
              </View>
            </View>

            {/* Hidden real input */}
            <TextInput
              style={styles.hiddenInput}
              value={codigo}
              onChangeText={handleChange}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
            />

            {/* Error */}
            {erro ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {erro}</Text>
              </View>
            ) : null}
          </Animated.View>

          {/* ─── Numpad ─────────────────────────────────────── */}
          <View style={styles.numpad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['⌫', '0', '✓'],
            ].map((row, ri) => (
              <View key={ri} style={styles.numpadRow}>
                {row.map((key) => {
                  const isConfirm = key === '✓';
                  const isDelete = key === '⌫';
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.numpadKey,
                        isConfirm && styles.numpadConfirm,
                        isDelete && styles.numpadDelete,
                      ]}
                      onPress={() => {
                        if (isConfirm) {
                          handleConfirmar();
                        } else if (isDelete) {
                          setCodigo((prev) => prev.slice(0, -1));
                          if (erro) setErro('');
                        } else {
                          handleChange(codigo + key);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.numpadKeyText,
                          isConfirm && styles.numpadConfirmText,
                          isDelete && styles.numpadDeleteText,
                        ]}
                      >
                        {key}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* ─── Footer hint ────────────────────────────────── */}
          <Text style={styles.footer}>
            Digite o código do programa (ex: 091)
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  flex: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },

  // ── Header
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  tectoyHeader: {
    backgroundColor: theme.colors.tectoyRed,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.tectoyYellow,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.tectoyYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  tectoyLogo: {
    fontFamily: theme.fonts.lcd,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.tectoyYellow,
    letterSpacing: 8,
    textShadowColor: 'rgba(255,204,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  logoText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.lcd,
    letterSpacing: 6,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lcd,
  },
  tagline: {
    fontFamily: theme.fonts.lcd,
    fontSize: 10,
    letterSpacing: 4,
    color: theme.colors.lcdDim,
  },

  // ── LCD Panel
  panel: { width: '100%', marginBottom: theme.spacing.lg },
  lcdFrame: {
    backgroundColor: '#0a1520',
    borderRadius: theme.radius.lg,
    borderWidth: 3,
    borderColor: '#3a3a3a',
    padding: 3,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.lcd,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lcd: {
    backgroundColor: theme.colors.lcdBg,
    borderRadius: 10,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  lcdLabel: {
    fontFamily: theme.fonts.lcd,
    fontSize: 9,
    letterSpacing: 3,
    color: '#5a5a20',
    marginBottom: theme.spacing.sm,
  },
  digitRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: theme.spacing.sm,
  },
  digitBox: {
    width: 56,
    height: 64,
    backgroundColor: '#1a1a04',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a10',
  },
  digitText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 36,
    color: theme.colors.lcdText,
    fontWeight: 'bold',
  },
  lcdHint: {
    fontFamily: theme.fonts.lcd,
    fontSize: 10,
    color: '#4a4a18',
    letterSpacing: 1,
  },
  lcdTitle: {
    fontFamily: theme.fonts.lcd,
    fontSize: 8,
    color: theme.colors.lcd,
    marginTop: theme.spacing.xs,
    maxWidth: '90%',
  },

  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },

  // ── Error
  errorBox: {
    backgroundColor: theme.colors.incorrectBg,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.incorrect,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 13,
    color: theme.colors.incorrect,
  },

  // ── Numpad
  numpad: { width: '100%', gap: 10 },
  numpadRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  numpadKey: {
    flex: 1,
    height: 60,
    backgroundColor: theme.colors.btnBg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.btnBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadKeyText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 22,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  numpadConfirm: {
    backgroundColor: 'rgba(255, 182, 39, 0.12)',
    borderColor: theme.colors.lcd,
  },
  numpadConfirmText: { color: theme.colors.lcd },
  numpadDelete: {
    backgroundColor: 'rgba(255, 77, 77, 0.08)',
    borderColor: 'rgba(255,77,77,0.3)',
  },
  numpadDeleteText: { color: theme.colors.incorrect, fontSize: 20 },

  // ── Footer
  footer: {
    marginTop: theme.spacing.md,
    fontFamily: theme.fonts.lcd,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
});
