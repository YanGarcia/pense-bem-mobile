import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { theme } from '../theme';
import { TOTAL_QUESTOES } from '../hooks/useQuiz';
import { obterTitulo } from '../data/gabarito';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getResultData(pontuacao: number, pontuacaoMaxima: number) {
  const pct = pontuacaoMaxima > 0 ? pontuacao / pontuacaoMaxima : 0;
  if (pct === 1) return { emoji: '★', label: 'PERFEITO!', color: theme.colors.lcd };
  if (pct >= 0.8) return { emoji: '◆', label: 'EXCELENTE!', color: theme.colors.correct };
  if (pct >= 0.6) return { emoji: '●', label: 'MUITO BOM!', color: theme.colors.correct };
  if (pct >= 0.4) return { emoji: '◑', label: 'BOM!', color: '#f0a500' };
  if (pct >= 0.2) return { emoji: '○', label: 'REGULAR', color: '#f0a500' };
  return { emoji: '✗', label: 'TENTE NOVAMENTE', color: theme.colors.incorrect };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { pontuacao, pontuacaoMaxima, codigo, acertosPorTentativa, questoesSemAcerto } =
    route.params;
  const result = getResultData(pontuacao, pontuacaoMaxima);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleJogarNovamente = () => {
    navigation.replace('Quiz', { codigo });
  };

  const handleVoltar = () => {
    navigation.navigate('CodeInput');
  };

  const pctStr =
    pontuacaoMaxima > 0 ? Math.round((pontuacao / pontuacaoMaxima) * 100) : 0;

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.container}>

        {/* ─── TecToy Header ──────────────────────────────── */}
        <View style={styles.tectoyHeader}>
          <Text style={styles.tectoyLogo}>TECTOY</Text>
        </View>

        {/* ─── LCD Header ─────────────────────────────────── */}
        <View style={styles.lcdHeader}>
          <Text style={styles.lcdHeaderLabel}>RESULTADO FINAL</Text>
        </View>

        {/* ─── Score Display ──────────────────────────────── */}
        <Animated.View
          style={[styles.scorePanel, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={[styles.resultEmoji, { color: result.color }]}>
            {result.emoji}
          </Text>

          <View style={styles.scoreNumbers}>
            <Text style={[styles.scoreValue, { color: result.color }]}>
              {String(pontuacao).padStart(2, '0')}
            </Text>
            <Text style={styles.scoreDivider}>/</Text>
            <Text style={styles.scoreTotal}>
              {String(pontuacaoMaxima).padStart(2, '0')}
            </Text>
          </View>

          <Text style={[styles.resultLabel, { color: result.color }]}>
            {result.label}
          </Text>

          <Text style={styles.pctText}>{pctStr}% de aproveitamento</Text>
        </Animated.View>

        {/* ─── Stats Table ────────────────────────────────── */}
        <Animated.View style={[styles.stats, { opacity: fadeAnim }]}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>CÓDIGO</Text>
            <Text style={styles.statValue}>{codigo}</Text>
          </View>
          <View style={styles.statDivider} />
          {obterTitulo(codigo) && (
            <>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>LIVRO</Text>
                <Text
                  style={[styles.statValue, { maxWidth: '60%' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {obterTitulo(codigo)}
                </Text>
              </View>
              <View style={styles.statDivider} />
            </>
          )}
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ACERTOS NA 1ª TENTATIVA</Text>
            <Text style={[styles.statValue, { color: theme.colors.correct }]}>
              {acertosPorTentativa[0]} ({acertosPorTentativa[0] * 3} pts)
            </Text>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ACERTOS NA 2ª TENTATIVA</Text>
            <Text style={[styles.statValue, { color: theme.colors.lcd }]}>
              {acertosPorTentativa[1]} ({acertosPorTentativa[1] * 2} pts)
            </Text>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ACERTOS NA 3ª TENTATIVA</Text>
            <Text style={[styles.statValue, { color: '#f0a500' }]}>
              {acertosPorTentativa[2]} ({acertosPorTentativa[2] * 1} pts)
            </Text>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>SEM ACERTO</Text>
            <Text style={[styles.statValue, { color: theme.colors.incorrect }]}>
              {questoesSemAcerto} (0 pts)
            </Text>
          </View>
          <View style={styles.statDivider} />

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>TOTAL DE QUESTÕES</Text>
            <Text style={styles.statValue}>{TOTAL_QUESTOES}</Text>
          </View>
        </Animated.View>

        {/* ─── Action Buttons ─────────────────────────────── */}
        <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleJogarNovamente}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryText}>▶  JOGAR NOVAMENTE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={handleVoltar}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSecondaryText}>← REINICIAR JOGO</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },

  // ── TecToy Header
  tectoyHeader: {
    backgroundColor: theme.colors.tectoyRed,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.tectoyYellow,
  },
  tectoyLogo: {
    fontFamily: theme.fonts.lcd,
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.tectoyYellow,
    letterSpacing: 6,
  },

  // ── LCD Header
  lcdHeader: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  lcdHeaderLabel: {
    fontFamily: theme.fonts.lcd,
    fontSize: 11,
    letterSpacing: 4,
    color: theme.colors.lcdDim,
  },

  // ── Score panel
  scorePanel: {
    backgroundColor: theme.colors.bgPanel,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing.xs,
    shadowColor: theme.colors.lcd,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  resultEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  scoreNumbers: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  scoreValue: {
    fontFamily: theme.fonts.lcd,
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 72,
  },
  scoreDivider: {
    fontFamily: theme.fonts.lcd,
    fontSize: 32,
    color: theme.colors.textMuted,
    lineHeight: 64,
  },
  scoreTotal: {
    fontFamily: theme.fonts.lcd,
    fontSize: 32,
    color: theme.colors.textMuted,
    lineHeight: 64,
  },
  resultLabel: {
    fontFamily: theme.fonts.lcd,
    fontSize: 16,
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  pctText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 12,
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },

  // ── Stats table
  stats: {
    width: '100%',
    backgroundColor: theme.colors.bgPanel,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  statDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  statLabel: {
    fontFamily: theme.fonts.lcd,
    fontSize: 9,
    letterSpacing: 2,
    color: theme.colors.textMuted,
    flex: 1,
  },
  statValue: {
    fontFamily: theme.fonts.lcd,
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },

  // ── Action buttons
  buttons: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  btnPrimary: {
    backgroundColor: 'rgba(255,182,39,0.12)',
    borderWidth: 2,
    borderColor: theme.colors.lcd,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.lcd,
    letterSpacing: 2,
  },
  btnSecondary: {
    backgroundColor: theme.colors.btnBg,
    borderWidth: 1,
    borderColor: theme.colors.btnBorder,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 14,
    color: theme.colors.textMuted,
    letterSpacing: 2,
  },
});
