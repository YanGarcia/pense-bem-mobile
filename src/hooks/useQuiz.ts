import { useState, useCallback } from 'react';
import {
  validarCodigo,
  obterRespostaCorreta,
  TOTAL_QUESTOES,
  MAX_TENTATIVAS,
  PONTUACAO_POR_TENTATIVA,
  PONTUACAO_MAXIMA,
  type Resposta,
} from '../data/gabarito';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackTipo = 'idle' | 'correta' | 'incorreta' | 'semPontos';

export interface QuizState {
  questaoAtual: number;          // 0–29
  tentativaAtual: number;        // 1–3
  pontuacao: number;             // acumulada
  finalizado: boolean;
  feedback: FeedbackTipo;
  indiceRespondido: number | null;   // qual botão foi pressionado
  alternativasTentadas: number[];    // índices já tentados nesta questão
  // Estatísticas para a tela de resultado
  acertosPorTentativa: [number, number, number]; // [1ª, 2ª, 3ª]
  questoesSemAcerto: number;
}

export interface QuizActions {
  responder: (indice: number) => void;
  avancar: () => void;
  resetarFeedback: () => void;
  reiniciarJogo: () => void;
}

// ─── Validators (re-exported for CodeInputScreen) ─────────────────────────────

export { validarCodigo };

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useQuiz(codigo: string): [QuizState, QuizActions] {
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [tentativaAtual, setTentativaAtual] = useState(1);
  const [pontuacao, setPontuacao] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackTipo>('idle');
  const [indiceRespondido, setIndiceRespondido] = useState<number | null>(null);
  const [alternativasTentadas, setAlternativasTentadas] = useState<number[]>([]);
  const [acertosPorTentativa, setAcertosPorTentativa] = useState<[number, number, number]>([0, 0, 0]);
  const [questoesSemAcerto, setQuestoesSemAcerto] = useState(0);

  // ── Responder ─────────────────────────────────────────────────────────────
  const responder = useCallback(
    (indice: number) => {
      if (feedback !== 'idle') return;
      if (alternativasTentadas.includes(indice)) return; // já tentou essa

      const correta = obterRespostaCorreta(codigo, questaoAtual);
      const acertou = correta !== null && indice === correta;

      setIndiceRespondido(indice);

      if (acertou) {
        // Pontua conforme a tentativa (3, 2 ou 1)
        const pontos = PONTUACAO_POR_TENTATIVA[tentativaAtual - 1];
        setPontuacao((prev) => prev + pontos);
        setFeedback('correta');

        // Atualizar estatísticas
        setAcertosPorTentativa((prev) => {
          const novo: [number, number, number] = [...prev];
          novo[tentativaAtual - 1] += 1;
          return novo;
        });
      } else {
        // Errou
        setAlternativasTentadas((prev) => [...prev, indice]);

        if (tentativaAtual >= MAX_TENTATIVAS) {
          // 3ª tentativa errada → sem pontos, avança
          setFeedback('semPontos');
          setQuestoesSemAcerto((prev) => prev + 1);
        } else {
          // Ainda tem tentativas
          setFeedback('incorreta');
        }
      }
    },
    [feedback, alternativasTentadas, codigo, questaoAtual, tentativaAtual],
  );

  // ── Avançar para a próxima questão ────────────────────────────────────────
  const avancar = useCallback(() => {
    setFeedback('idle');
    setIndiceRespondido(null);
    setAlternativasTentadas([]);
    setTentativaAtual(1);

    const proxima = questaoAtual + 1;
    if (proxima >= TOTAL_QUESTOES) {
      setFinalizado(true);
    } else {
      setQuestaoAtual(proxima);
    }
  }, [questaoAtual]);

  // ── Resetar feedback (após erro, preparar nova tentativa) ─────────────────
  const resetarFeedback = useCallback(() => {
    setFeedback('idle');
    setIndiceRespondido(null);
    setTentativaAtual((prev) => prev + 1);
  }, []);

  // ── Reiniciar jogo completo ───────────────────────────────────────────────
  const reiniciarJogo = useCallback(() => {
    setQuestaoAtual(0);
    setTentativaAtual(1);
    setPontuacao(0);
    setFinalizado(false);
    setFeedback('idle');
    setIndiceRespondido(null);
    setAlternativasTentadas([]);
    setAcertosPorTentativa([0, 0, 0]);
    setQuestoesSemAcerto(0);
  }, []);

  return [
    {
      questaoAtual,
      tentativaAtual,
      pontuacao,
      finalizado,
      feedback,
      indiceRespondido,
      alternativasTentadas,
      acertosPorTentativa,
      questoesSemAcerto,
    },
    { responder, avancar, resetarFeedback, reiniciarJogo },
  ];
}

export { TOTAL_QUESTOES, PONTUACAO_MAXIMA, PONTUACAO_POR_TENTATIVA, MAX_TENTATIVAS };
