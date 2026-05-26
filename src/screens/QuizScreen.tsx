import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useQuiz, TOTAL_QUESTOES, PONTUACAO_MAXIMA } from '../hooks/useQuiz';
import { LETRAS } from '../data/gabarito';
import { theme } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
  route: RouteProp<RootStackParamList, 'Quiz'>;
};

// Cores dos botões no estilo Pense Bem (Vermelho, Amarelo, Azul, Verde)
const BUTTON_COLORS = [
  theme.colors.btnA, // A = Vermelho
  theme.colors.btnB, // B = Amarelo
  theme.colors.btnC, // C = Azul
  theme.colors.btnD, // D = Verde
];

const BUTTON_TEXT_COLORS = [
  '#ffffff', // A branco sobre vermelho
  '#1a1a2e', // B escuro sobre amarelo
  '#ffffff', // C branco sobre azul
  '#ffffff', // D branco sobre verde
];

// Delays
const FEEDBACK_CORRECT_DELAY = 1200;
const FEEDBACK_WRONG_DELAY = 1000;
const FEEDBACK_NOPOINTSDELAY = 1800;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_SIZE = Math.min((SCREEN_WIDTH - 80) / 2, 140);

// ─── Component ────────────────────────────────────────────────────────────────

export const QuizScreen: React.FC<Props> = ({ navigation, route }) => {
  const { codigo } = route.params;
  const [state, actions] = useQuiz(codigo);
  const insets = useSafeAreaInsets();
  const {
    questaoAtual,
    tentativaAtual,
    pontuacao,
    finalizado,
    feedback,
    indiceRespondido,
    alternativasTentadas,
    acertosPorTentativa,
    questoesSemAcerto,
  } = state;
  const { responder, avancar, resetarFeedback, reiniciarJogo } = actions;

  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const lcdPulse = useRef(new Animated.Value(1)).current;

  // ── Navigate to result ──────────────────────────────────────────────────
  useEffect(() => {
    if (finalizado) {
      navigation.replace('Result', {
        pontuacao,
        pontuacaoMaxima: PONTUACAO_MAXIMA,
        codigo,
        acertosPorTentativa,
        questoesSemAcerto,
      });
    }
  }, [finalizado, navigation, pontuacao, codigo, acertosPorTentativa, questoesSemAcerto]);

  // ── Feedback animation ──────────────────────────────────────────────────
  useEffect(() => {
    if (feedback !== 'idle') {
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      feedbackOpacity.setValue(0);
    }
  }, [feedback, feedbackOpacity]);

  // ── LCD pulse animation ─────────────────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(lcdPulse, {
          toValue: 0.85,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(lcdPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [lcdPulse]);

  // ── Auto-advance after feedback ─────────────────────────────────────────
  useEffect(() => {
    if (feedback === 'correta') {
      const timer = setTimeout(() => avancar(), FEEDBACK_CORRECT_DELAY);
      return () => clearTimeout(timer);
    }
    if (feedback === 'incorreta') {
      const timer = setTimeout(() => resetarFeedback(), FEEDBACK_WRONG_DELAY);
      return () => clearTimeout(timer);
    }
    if (feedback === 'semPontos') {
      const timer = setTimeout(() => avancar(), FEEDBACK_NOPOINTSDELAY);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [feedback, avancar, resetarFeedback]);

  // ── Answer handler ──────────────────────────────────────────────────────
  const handleResposta = useCallback(
    (indice: number) => {
      responder(indice);
    },
    [responder],
  );

  // ── Button state ────────────────────────────────────────────────────────
  const getButtonState = (i: number) => {
    if (alternativasTentadas.includes(i)) return 'tentada';
    if (feedback === 'idle') return 'idle';
    if (i === indiceRespondido) {
      if (feedback === 'correta') return 'correta';
      if (feedback === 'incorreta' || feedback === 'semPontos') return 'incorreta';
    }
    return 'disabled';
  };

  // Número da questão formatado
  const questaoNum = String(questaoAtual + 1).padStart(2, '0');

  // Texto de feedback
  const getFeedbackText = () => {
    if (feedback === 'correta') {
      const pontos = [3, 2, 1][tentativaAtual - 1];
      return `✓ CORRETO! +${pontos} PONTO${pontos > 1 ? 'S' : ''}`;
    }
    if (feedback === 'incorreta') return '✗ ERRADO! TENTE NOVAMENTE';
    if (feedback === 'semPontos') return '✗ SEM PONTOS — PRÓXIMA QUESTÃO';
    return '';
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.container}>

        {/* ─── TecToy Header ──────────────────────────────── */}
        <View style={styles.tectoyHeader}>
          <Text style={styles.tectoyLogo}>TECTOY</Text>
        </View>

        {/* ─── LCD Display ────────────────────────────────── */}
        <View style={styles.lcdFrame}>
          <Animated.View style={[styles.lcd, { opacity: lcdPulse }]}>
            {/* Código → Questão */}
            <Text style={styles.lcdCode}>
              {codigo}-{'>'}
              {questaoNum}:
            </Text>

            {/* Tentativa */}
            <View style={styles.tentativaBox}>
              <Text style={styles.tentativaText}>
                Tentativa {tentativaAtual} de {3}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ─── Feedback Banner ────────────────────────────── */}
        {feedback !== 'idle' && (
          <Animated.View
            style={[
              styles.feedbackBanner,
              feedback === 'correta' && styles.feedbackCorreta,
              (feedback === 'incorreta' || feedback === 'semPontos') &&
                styles.feedbackIncorreta,
              { opacity: feedbackOpacity },
            ]}
            pointerEvents="none"
          >
            <Text
              style={[
                styles.feedbackText,
                feedback === 'correta'
                  ? { color: theme.colors.correct }
                  : { color: theme.colors.incorrect },
              ]}
            >
              {getFeedbackText()}
            </Text>
          </Animated.View>
        )}

        {/* ─── Answer Buttons (Grid 2×2) ──────────────────── */}
        <View style={styles.buttonsGrid}>
          <View style={styles.buttonsRow}>
            {[0, 1].map((i) => {
              const btnState = getButtonState(i);
              const isDisabled =
                btnState === 'tentada' ||
                btnState === 'disabled' ||
                btnState === 'correta' ||
                btnState === 'incorreta';
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.answerBtn,
                    { backgroundColor: BUTTON_COLORS[i] },
                    btnState === 'tentada' && styles.answerBtnTentada,
                    btnState === 'correta' && styles.answerBtnCorreta,
                    btnState === 'incorreta' && styles.answerBtnIncorreta,
                  ]}
                  onPress={() => handleResposta(i)}
                  disabled={isDisabled}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.answerBtnText,
                      { color: BUTTON_TEXT_COLORS[i] },
                      btnState === 'tentada' && styles.answerBtnTextTentada,
                    ]}
                  >
                    {LETRAS[i]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.buttonsRow}>
            {[2, 3].map((i) => {
              const btnState = getButtonState(i);
              const isDisabled =
                btnState === 'tentada' ||
                btnState === 'disabled' ||
                btnState === 'correta' ||
                btnState === 'incorreta';
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.answerBtn,
                    { backgroundColor: BUTTON_COLORS[i] },
                    btnState === 'tentada' && styles.answerBtnTentada,
                    btnState === 'correta' && styles.answerBtnCorreta,
                    btnState === 'incorreta' && styles.answerBtnIncorreta,
                  ]}
                  onPress={() => handleResposta(i)}
                  disabled={isDisabled}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.answerBtnText,
                      { color: BUTTON_TEXT_COLORS[i] },
                      btnState === 'tentada' && styles.answerBtnTextTentada,
                    ]}
                  >
                    {LETRAS[i]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── Bottom Status ──────────────────────────────── */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>PONTOS</Text>
            <Text style={styles.statusValue}>{pontuacao}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>QUESTÃO</Text>
            <Text style={styles.statusValue}>
              {questaoAtual + 1}/{TOTAL_QUESTOES}
            </Text>
          </View>
        </View>

        {/* ─── Reiniciar Jogo ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.reiniciarBtn}
          onPress={() => {
            reiniciarJogo();
            navigation.navigate('CodeInput');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.reiniciarText}>Reiniciar Jogo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    justifyContent: 'space-between',
  },

  // ── TecToy Header
  tectoyHeader: {
    backgroundColor: theme.colors.tectoyRed,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.tectoyYellow,
    shadowColor: theme.colors.tectoyYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  tectoyLogo: {
    fontFamily: theme.fonts.lcd,
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.tectoyYellow,
    letterSpacing: 8,
    textShadowColor: 'rgba(255,204,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  // ── LCD Display
  lcdFrame: {
    width: '100%',
    backgroundColor: '#0a1520',
    borderRadius: theme.radius.lg,
    borderWidth: 3,
    borderColor: '#3a3a3a',
    padding: 4,
    shadowColor: theme.colors.lcd,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  lcd: {
    backgroundColor: theme.colors.lcdBg,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  lcdCode: {
    fontFamily: theme.fonts.lcd,
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.lcdText,
    letterSpacing: 4,
    textShadowColor: 'rgba(232,200,64,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: theme.spacing.sm,
  },
  tentativaBox: {
    backgroundColor: 'rgba(232,200,64,0.12)',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(232,200,64,0.3)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  tentativaText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 16,
    color: theme.colors.lcdText,
    letterSpacing: 2,
  },

  // ── Feedback Banner
  feedbackBanner: {
    width: '100%',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  feedbackCorreta: {
    backgroundColor: theme.colors.correctBg,
    borderWidth: 1,
    borderColor: theme.colors.correct,
  },
  feedbackIncorreta: {
    backgroundColor: theme.colors.incorrectBg,
    borderWidth: 1,
    borderColor: theme.colors.incorrect,
  },
  feedbackText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // ── Answer Buttons Grid (2×2)
  buttonsGrid: {
    width: '100%',
    gap: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  answerBtn: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: BUTTON_SIZE,
    maxHeight: BUTTON_SIZE,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  answerBtnText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  answerBtnTentada: {
    opacity: 0.3,
    borderColor: theme.colors.incorrect,
    borderWidth: 3,
  },
  answerBtnTextTentada: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  answerBtnCorreta: {
    borderColor: theme.colors.correct,
    borderWidth: 4,
    shadowColor: theme.colors.correct,
    shadowOpacity: 0.6,
  },
  answerBtnIncorreta: {
    borderColor: theme.colors.incorrect,
    borderWidth: 4,
    shadowColor: theme.colors.incorrect,
    shadowOpacity: 0.6,
  },

  // ── Bottom Status
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: theme.colors.bgLight,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
  },
  statusItem: { alignItems: 'center' },
  statusLabel: {
    fontFamily: theme.fonts.lcd,
    fontSize: 9,
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  statusValue: {
    fontFamily: theme.fonts.lcd,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.lcd,
  },

  // ── Reiniciar
  reiniciarBtn: {
    width: '100%',
    backgroundColor: theme.colors.btnBg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.btnBorder,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  reiniciarText: {
    fontFamily: theme.fonts.lcd,
    fontSize: 16,
    color: theme.colors.textMuted,
    letterSpacing: 2,
  },
});
