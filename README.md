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
pense-bem/
├── App.tsx                    # Entrada + Navegação (Stack)
├── src/
│   ├── theme.ts               # Cores, espaçamentos, fontes
│   ├── data/
│   │   └── livros.json        # Base de questões (local)
│   ├── hooks/
│   │   └── useQuiz.ts         # Lógica do quiz (hook central)
│   ├── screens/
│   │   ├── CodeInputScreen.tsx  # Tela 1: inserção do código
│   │   ├── QuizScreen.tsx       # Tela 2: perguntas/respostas
│   │   └── ResultScreen.tsx     # Tela 3: pontuação final
│   └── components/
│       ├── QuestionCard.tsx     # Card da questão
│       └── AnswerButton.tsx     # Botão de alternativa
```

---

## 🎮 Como Jogar

| Código | Conteúdo |
|--------|----------|
| `011`  | Livro 01, Programa 1 — Matemática e Geografia (básico) |
| `012`  | Livro 01, Programa 2 — Ciências e Geografia |
| `021`  | Livro 02, Programa 1 — Ciências e Literatura |
| `022`  | Livro 02, Programa 2 — História e Matemática |

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

## ➕ Adicionando Questões

Edite `src/data/livros.json`. Formato:

```json
{
  "XX": {
    "Y": [
      {
        "pergunta": "Texto da pergunta?",
        "alternativas": ["Op A", "Op B", "Op C", "Op D"],
        "correta": 0
      }
    ]
  }
}
```

> `correta` é o **índice** da alternativa correta (0 = primeira, 1 = segunda...).

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
