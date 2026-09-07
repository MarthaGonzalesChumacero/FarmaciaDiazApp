import React, {
  useState,
} from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import MedicamentosScreen from "./src/screens/MedicamentosScreen";
import DetalleMedicamentoScreen from "./src/screens/DetalleMedicamentoScreen";
import PedidosScreen from "./src/screens/PedidosScreen";
import RegistrarMedicamentoScreen from "./src/screens/RegistrarMedicamentoScreen";
import EditarMedicamentoScreen from "./src/screens/EditarMedicamentoScreen";
import AlertasScreen from "./src/screens/AlertasScreen";
import MovimientosScreen from "./src/screens/MovimientosScreen";

import AlertaCampana from "./src/components/AlertaCampana";

import {
  Medicamento,
} from "./src/types/Medicamento";

// ==============================
// RUTAS
// ==============================

type RootStackParamList = {
  Medicamentos: undefined;

  Detalle: {
    medicamento: Medicamento;
  };

  Pedidos: undefined;

  Registrar: undefined;

  Editar: {
    medicamento: Medicamento;
  };

  Alertas: undefined;

  Movimientos: undefined;
};

const Stack =
  createNativeStackNavigator<
    RootStackParamList
  >();

// ==============================
// TEMA CLARO
// ==============================

const temaClaro = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,

    // Azul principal
    primary: "#2684FF",

    // Fondo celeste muy suave
    background: "#EEF7FF",

    // Encabezados / tarjetas
    card: "#F8FCFF",

    // Texto azul marino
    text: "#12315B",

    // Bordes suaves
    border: "#D5E9FA",

    // Alertas
    notification: "#FF3B5C",
  },
};

// ==============================
// TEMA OSCURO
// ==============================

const temaOscuro = {
  ...DarkTheme,

  colors: {
    ...DarkTheme.colors,

    primary:
      "#60A5FA",

    background:
      "#020617",

    card:
      "#0F172A",

    text:
      "#F8FAFC",

    border:
      "#1E293B",

    notification:
      "#EF4444",
  },
};

// ==============================
// APP
// ==============================

export default function App() {
  const [
    oscuro,
    setOscuro,
  ] = useState(false);

  const cambiarTema =
    () => {
      setOscuro(
        (valor) =>
          !valor
      );
    };

  // ==============================
  // BOTÓN TEMA
  // ==============================

  const botonTema = () => (
    <Pressable
      onPress={
        cambiarTema
      }
      style={{
        paddingHorizontal:
          6,

        paddingVertical:
          6,
      }}
    >
      <Text
        style={{
          fontSize: 21,
        }}
      >
        {oscuro
          ? "☀️"
          : "🌙"}
      </Text>
    </Pressable>
  );

  // ==============================
  // NAVEGACIÓN
  // ==============================

  return (
    <NavigationContainer
      theme={
        oscuro
          ? temaOscuro
          : temaClaro
      }
    >
      <Stack.Navigator
        initialRouteName="Medicamentos"
        screenOptions={{
          headerTitleStyle: {
            fontWeight:
              "800",
          },
        }}
      >
        {/* ======================
            INVENTARIO
        ====================== */}

        <Stack.Screen
          name="Medicamentos"
          options={({ navigation }) => ({
            title:
              "Farmacia Díaz",

            headerRight:
              () => (
                <View
                  style={{
                    flexDirection:
                      "row",

                    alignItems:
                      "center",
                  }}
                >
                  {/* ALERTAS */}

                  <AlertaCampana
                    onPress={() =>
                      navigation.navigate(
                        "Alertas"
                      )
                    }
                  />

                  {/* MOVIMIENTOS */}

                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        "Movimientos"
                      )
                    }
                    style={{
                      paddingHorizontal:
                        5,

                      paddingVertical:
                        6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize:
                          21,
                      }}
                    >
                      📋
                    </Text>
                  </Pressable>

                  {/* REGISTRAR */}

                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        "Registrar"
                      )
                    }
                    style={{
                      paddingHorizontal:
                        5,

                      paddingVertical:
                        6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize:
                          25,

                        fontWeight:
                          "600",
                      }}
                    >
                      +
                    </Text>
                  </Pressable>

                  {/* PEDIDOS */}

                  <Pressable
                    onPress={() =>
                      navigation.navigate(
                        "Pedidos"
                      )
                    }
                    style={{
                      paddingHorizontal:
                        5,

                      paddingVertical:
                        6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize:
                          21,
                      }}
                    >
                      🛒
                    </Text>
                  </Pressable>

                  {/* TEMA */}

                  <Pressable
                    onPress={
                      cambiarTema
                    }
                    style={{
                      paddingHorizontal:
                        5,

                      paddingVertical:
                        6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize:
                          21,
                      }}
                    >
                      {oscuro
                        ? "☀️"
                        : "🌙"}
                    </Text>
                  </Pressable>
                </View>
              ),
          })}
        >
          {({
            navigation,
          }) => (
            <MedicamentosScreen
              onSeleccionar={(
                medicamento
              ) =>
                navigation.navigate(
                  "Detalle",
                  {
                    medicamento,
                  }
                )
              }
            />
          )}
        </Stack.Screen>

        {/* ======================
            DETALLE
        ====================== */}

        <Stack.Screen
          name="Detalle"
          options={{
            title:
              "Detalle del medicamento",

            headerRight:
              botonTema,
          }}
        >
          {({
            route,
            navigation,
          }) => (
            <DetalleMedicamentoScreen
              medicamento={
                route.params
                  .medicamento
              }

              onVolver={() =>
                navigation.goBack()
              }

              onEditar={() =>
                navigation.navigate(
                  "Editar",
                  {
                    medicamento:
                      route
                        .params
                        .medicamento,
                  }
                )
              }
            />
          )}
        </Stack.Screen>

        {/* ======================
            PEDIDOS
        ====================== */}

        <Stack.Screen
          name="Pedidos"
          component={
            PedidosScreen
          }
          options={{
            title:
              "Mis pedidos",

            headerRight:
              botonTema,
          }}
        />

        {/* ======================
            REGISTRAR
        ====================== */}

        <Stack.Screen
          name="Registrar"
          options={{
            title:
              "Registrar medicamento",

            headerRight:
              botonTema,
          }}
        >
          {({
            navigation,
          }) => (
            <RegistrarMedicamentoScreen
              onVolver={() =>
                navigation.goBack()
              }
            />
          )}
        </Stack.Screen>

        {/* ======================
            EDITAR
        ====================== */}

        <Stack.Screen
          name="Editar"
          options={{
            title:
              "Editar medicamento",

            headerRight:
              botonTema,
          }}
        >
          {({
            route,
            navigation,
          }) => (
            <EditarMedicamentoScreen
              medicamento={
                route.params
                  .medicamento
              }

              onVolver={() =>
                navigation.navigate(
                  "Medicamentos"
                )
              }
            />
          )}
        </Stack.Screen>

        {/* ======================
            ALERTAS
        ====================== */}

        <Stack.Screen
          name="Alertas"
          options={{
            title:
              "Alertas de inventario",

            headerRight:
              botonTema,
          }}
        >
          {({
            navigation,
          }) => (
            <AlertasScreen
              onSeleccionar={(
                medicamento
              ) =>
                navigation.navigate(
                  "Detalle",
                  {
                    medicamento,
                  }
                )
              }
            />
          )}
        </Stack.Screen>

        {/* ======================
            MOVIMIENTOS
        ====================== */}

        <Stack.Screen
          name="Movimientos"
          component={
            MovimientosScreen
          }
          options={{
            title:
              "Historial de movimientos",

            headerRight:
              botonTema,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}