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
  titulo?: string;
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
  '092': {
    livro: '09',
    programa: '2',
    titulo: 'Maravilhas do Mundo - Programa 2',
    respostas: [
      //        A=0, B=1, C=2, D=3
      0, // 31. A
      3, // 32. D
      1, // 33. B
      0, // 34. A
      0, // 35. A
      2, // 36. C
      1, // 37. B
      3, // 38. D
      3, // 39. D
      1, // 40. B
      3, // 41. D
      0, // 42. A
      1, // 43. B
      0, // 44. A
      1, // 45. B
      0, // 46. A
      2, // 47. C
      0, // 48. A
      0, // 49. A
      1, // 50. B
      2, // 51. C
      0, // 52. A
      0, // 53. A
      1, // 54. B
      0, // 55. A
      3, // 56. D
      1, // 57. B
      1, // 58. B
      1, // 59. B
      2, // 60. C
    ],
  },
  '093': {
    livro: '09',
    programa: '3',
    titulo: 'Maravilhas do Mundo - Programa 3',
    respostas: [
      //        A=0, B=1, C=2, D=3
      3, // 61. D
      2, // 62. C
      3, // 63. D
      3, // 64. D
      3, // 65. D
      0, // 66. A
      2, // 67. C
      0, // 68. A
      0, // 69. A
      1, // 70. B
      2, // 71. C
      0, // 72. A
      0, // 73. A
      1, // 74. B
      0, // 75. A
      1, // 76. B
      3, // 77. D
      3, // 78. D
      2, // 79. C
      2, // 80. C
      1, // 81. B
      0, // 82. A
      3, // 83. D
      1, // 84. B
      0, // 85. A
      3, // 86. D
      1, // 87. B
      1, // 88. B
      3, // 89. D
      1, // 90. B
    ],
  },
  '094': {
    livro: '09',
    programa: '4',
    titulo: 'Maravilhas do Mundo - Programa 4',
    respostas: [
      //        A=0, B=1, C=2, D=3
      2, // 91. C
      2, // 92. C
      1, // 93. B
      0, // 94. A
      3, // 95. D
      1, // 96. B
      0, // 97. A
      3, // 98. D
      1, // 99. B
      1, // 100. B
      3, // 101. D
      2, // 102. C
      1, // 103. B
      1, // 104. B
      3, // 105. D
      2, // 106. C
      0, // 107. A
      1, // 108. B
      2, // 109. C
      2, // 110. C
      1, // 111. B
      3, // 112. D
      3, // 113. D
      1, // 114. B
      1, // 115. B
      3, // 116. D
      3, // 117. D
      0, // 118. A
      1, // 119. B
      2, // 120. C
    ],
  },
};

export const LIVROS: Record<string, string> = {
  '09': 'Maravilhas do Mundo',
};

export function obterTitulo(codigo: string): string | null {
  const gab = GABARITOS[codigo];
  if (!gab) return null;
  return LIVROS[gab.livro] ?? gab.titulo ?? null;
}

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
