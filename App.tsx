import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import MedicamentosScreen from "./src/screens/MedicamentosScreen";
import DetalleMedicamentoScreen from "./src/screens/DetalleMedicamentoScreen";
import { medicamentos } from "./src/data/medicamentos";
import {
  lightTheme,
  darkTheme,
} from "./src/theme/colors";

type Medicamento = (typeof medicamentos)[0];

type RootStackParamList = {
  Medicamentos: undefined;
  Detalle: {
    medicamento: Medicamento;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? darkTheme : lightTheme;

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.danger,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },

          headerRight: () => (
            <Pressable
              onPress={() => setIsDark(!isDark)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <Text style={{ fontSize: 23 }}>
                {isDark ? "☀️" : "🌙"}
              </Text>
            </Pressable>
          ),
        }}
      >
        <Stack.Screen
          name="Medicamentos"
          options={{
            title: "Farmacia Díaz",
          }}
        >
          {({ navigation }) => (
            <MedicamentosScreen
              onSeleccionar={(medicamento) =>
                navigation.navigate("Detalle", {
                  medicamento,
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Detalle"
          options={{
            title: "Detalle",
          }}
        >
          {({ route, navigation }) => (
            <DetalleMedicamentoScreen
              medicamento={route.params.medicamento}
              onVolver={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}