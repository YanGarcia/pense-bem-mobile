import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { CodeInputScreen } from './src/screens/CodeInputScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { theme } from './src/theme';

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  CodeInput: undefined;
  Quiz: { codigo: string };
  Result: {
    pontuacao: number;
    pontuacaoMaxima: number;
    codigo: string;
    acertosPorTentativa: [number, number, number];
    questoesSemAcerto: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" backgroundColor={theme.colors.bg} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="CodeInput"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="CodeInput" component={CodeInputScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
