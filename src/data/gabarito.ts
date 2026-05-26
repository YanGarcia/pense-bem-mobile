// ─── Gabarito: Maravilhas do Mundo (Código 091) ──────────────────────────────
// Cada programa contém 30 respostas corretas (0=A, 1=B, 2=C, 3=D)
//
// O código digitado pelo usuário tem 3 dígitos:
//   - Primeiros 2 dígitos: número do livro (09)
//   - Último dígito: número do programa (1)

export type Resposta = number; // 0=A, 1=B, 2=C, 3=D

export interface ProgramaGabarito {
  livro: string;
  programa: string;
  titulo: string;
  respostas: Resposta[];
}

export const GABARITOS: Record<string, ProgramaGabarito> = {
  '091': {
    livro: '09',
    programa: '1',
    titulo: 'Maravilhas do Mundo',
    respostas: [
      //        A=0, B=1, C=2, D=3
      0, // 01. A
      0, // 02. A
      3, // 03. D
      2, // 04. C
      1, // 05. B
      1, // 06. B
      2, // 07. C
      3, // 08. D
      3, // 09. D
      1, // 10. B
      0, // 11. A
      0, // 12. A
      3, // 13. D
      2, // 14. C
      1, // 15. B
      0, // 16. A
      1, // 17. B
      3, // 18. D
      0, // 19. A
      2, // 20. C
      0, // 21. A
      2, // 22. C
      2, // 23. C
      1, // 24. B
      3, // 25. D
      0, // 26. A
      1, // 27. B
      0, // 28. A
      1, // 29. B
      3, // 30. D
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function validarCodigo(codigo: string): boolean {
  return codigo in GABARITOS;
}

export function obterGabarito(codigo: string): ProgramaGabarito | null {
  return GABARITOS[codigo] ?? null;
}

export function obterRespostaCorreta(codigo: string, questao: number): Resposta | null {
  const gab = GABARITOS[codigo];
  if (!gab || questao < 0 || questao >= gab.respostas.length) return null;
  return gab.respostas[questao];
}

export const LETRAS = ['A', 'B', 'C', 'D'] as const;

export const TOTAL_QUESTOES = 30;
export const MAX_TENTATIVAS = 3;
export const PONTUACAO_POR_TENTATIVA = [3, 2, 1] as const; // 1ª=3, 2ª=2, 3ª=1
export const PONTUACAO_MAXIMA = TOTAL_QUESTOES * PONTUACAO_POR_TENTATIVA[0]; // 90
