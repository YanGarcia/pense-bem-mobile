// ─── Tema visual Pense Bem (Tectoy) ────────────────────────────────────────────
// Chassis cinza escuro + display LCD âmbar + botões coloridos clássicos

export const theme = {
  colors: {
    // Background / chassis (cinza escuro do brinquedo)
    bg: '#1a1a2e',
    bgLight: '#16213e',
    bgPanel: '#0f3460',

    // LCD display (âmbar clássico)
    lcd: '#ffb627',
    lcdDim: '#a07010',
    lcdGlow: 'rgba(255, 182, 39, 0.15)',
    lcdBg: '#2d2d0a',
    lcdText: '#e8c840',

    // Botões de resposta — cores clássicas do Pense Bem Tectoy
    btnA: '#e63946',   // Vermelho
    btnB: '#f4d03f',   // Amarelo
    btnC: '#2974b8',   // Azul
    btnD: '#27ae60',   // Verde

    // Feedback
    correct: '#39d353',
    correctBg: 'rgba(57, 211, 83, 0.15)',
    incorrect: '#ff4d4d',
    incorrectBg: 'rgba(255, 77, 77, 0.15)',

    // Neutro
    text: '#e8dcc8',
    textDark: '#1a1a2e',
    textMuted: '#7a8fa6',
    border: '#2a3f54',
    borderActive: '#3d6080',

    // Botões genéricos
    btnBg: '#1c2a3a',
    btnBorder: '#2a4060',
    btnActive: '#243550',

    // TecToy brand
    tectoyRed: '#cc0000',
    tectoyYellow: '#ffcc00',
  },
  fonts: {
    lcd: 'monospace',
    body: 'monospace',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
  },
};
