# 📱 Pense Bem — Quiz App

Replicação fiel do módulo de quiz do brinquedo eletrônico **Pense Bem**, construído com React Native + Expo.

## 🛠️ Instalação

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o projeto
npx expo start
```

Escaneie o QR code com o app **Expo Go** (iOS/Android) ou pressione `a` para Android / `i` para iOS.

---

## 📐 Estrutura

```
pense-bem-mobile/
├── App.tsx                    # Entrada + Navegação (Stack)
├── src/
│   ├── theme.ts               # Cores, espaçamentos, fontes
│   ├── data/
│   │   └── gabarito.ts        # Base de gabaritos (respostas corretas)
│   ├── hooks/
│   │   └── useQuiz.ts         # Lógica do quiz (hook central)
│   └── screens/
│       ├── CodeInputScreen.tsx  # Tela 1: inserção do código
│       ├── QuizScreen.tsx       # Tela 2: perguntas/respostas
│       └── ResultScreen.tsx     # Tela 3: pontuação final
```

---

## 🎮 Como Jogar

| Código | Conteúdo |
|--------|----------|
| `091`  | Livro 09, Programa 1 — Maravilhas do Mundo |
| `092`  | Livro 09, Programa 2 — Maravilhas do Mundo |
| `093`  | Livro 09, Programa 3 — Maravilhas do Mundo |
| `094`  | Livro 09, Programa 4 — Maravilhas do Mundo |

---

## 🧠 Regras do Jogo

- ✅ Resposta correta → avança para a próxima pergunta
- ❌ Resposta errada → mantém na mesma pergunta (tente de novo)
- 🏁 Ao final → tela de resultado com aproveitamento

---

## 🎨 Design

Estilo **retrô LCD** inspirado no brinquedo original:
- Fundo escuro (chassis plástico)
- Display verde estilo calculadora/relógio digital
- Texto âmbar para labels e pontuação
- Feedback visual imediato (verde/vermelho)

---

## ➕ Adicionando Programas

Edite `src/data/gabarito.ts`. O formato armazena apenas as **respostas corretas** (0=A, 1=B, 2=C, 3=D):

```typescript
export const GABARITOS: Record<string, ProgramaGabarito> = {
  'XYZ': {
    livro: 'XX',           // Número do livro (ex: '09')
    programa: 'Y',         // Número do programa (ex: '1')
    titulo: 'Título',      // Opcional
    respostas: [
      0, // 01. A
      1, // 02. B
      2, // 03. C
      3, // 04. D
      // ... 26 respostas mais (total de 30)
    ],
  },
};
```

**Notas:**
- O código é formado por 3 dígitos: `XY` (livro) + `Z` (programa)
- Cada programa deve ter exatamente **30 respostas**
- Valores: 0=A, 1=B, 2=C, 3=D
- As perguntas são geradas via API externa (não hardcoded)

---

## 📦 Dependências

| Pacote | Uso |
|--------|-----|
| `expo` | Framework base |
| `@react-navigation/native` | Navegação |
| `@react-navigation/stack` | Stack Navigator |
| `react-native-gesture-handler` | Gestos (requerido pelo Navigation) |
| `react-native-safe-area-context` | Safe areas (notch etc.) |
| `react-native-screens` | Otimização de telas |
"# pense-bem-mobile" 
"# pense-bem-mobile" 
