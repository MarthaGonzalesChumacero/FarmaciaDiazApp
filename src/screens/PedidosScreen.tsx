import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useTheme } from "@react-navigation/native";

import { Pedido } from "../types/Pedido";
import { escucharPedidos } from "../services/pedidosLecturaService";

export default function PedidosScreen() {
  const { colors, dark } = useTheme();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelar: (() => void) | undefined;
    let activo = true;

    const iniciar = async () => {
      cancelar = await escucharPedidos(
        (datos) => {
          if (!activo) return;

          setPedidos(datos);
          setCargando(false);
          setError("");
        },

        () => {
          if (!activo) return;

          setError("No se pudieron cargar los pedidos.");
          setCargando(false);
        }
      );
    };

    iniciar();

    return () => {
      activo = false;

      if (cancelar) {
        cancelar();
      }
    };
  }, []);

  const formatearFecha = (fecha?: Date | null) => {
    if (!fecha) {
      return "Fecha no disponible";
    }

    return fecha.toLocaleString("es-BO");
  };

  if (cargando) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.cargando,
            {
              color: colors.text,
            },
          ]}
        >
          Cargando pedidos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={{ fontSize: 42 }}>⚠️</Text>

        <Text
          style={[
            styles.errorTitulo,
            {
              color: colors.text,
            },
          ]}
        >
          Error
        </Text>

        <Text
          style={{
            color: dark ? "#94A3B8" : "#64748B",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pedidos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.lista,
        {
          backgroundColor: colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text
            style={[
              styles.titulo,
              {
                color: colors.text,
              },
            ]}
          >
            Mis pedidos
          </Text>

          <Text
            style={{
              color: dark ? "#94A3B8" : "#64748B",
              marginTop: 4,
            }}
          >
            {pedidos.length} pedido(s) registrados
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const pendiente = item.estado === "pendiente";

        return (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.nombre,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {item.medicamentoNombre}
                </Text>

                <Text
                  style={{
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",
                    marginTop: 4,
                    fontSize: 12,
                  }}
                >
                  {formatearFecha(item.creadoEn)}
                </Text>
              </View>

              <View
                style={[
                  styles.estadoBadge,
                  {
                    backgroundColor: pendiente
                      ? dark
                        ? "#422006"
                        : "#FEF3C7"
                      : dark
                      ? "#143322"
                      : "#DCFCE7",
                  },
                ]}
              >
                <Text
                  style={{
                    color: pendiente
                      ? "#D97706"
                      : "#16A34A",
                    fontWeight: "700",
                    fontSize: 12,
                  }}
                >
                  {item.estado}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.separador,
                {
                  backgroundColor: colors.border,
                },
              ]}
            />

            <View style={styles.fila}>
              <Text
                style={{
                  color: dark ? "#94A3B8" : "#64748B",
                }}
              >
                Cantidad
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {item.cantidad}
              </Text>
            </View>

            <View style={styles.fila}>
              <Text
                style={{
                  color: dark ? "#94A3B8" : "#64748B",
                }}
              >
                Precio unitario
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Bs {item.precioUnitario.toFixed(2)}
              </Text>
            </View>

            <View style={styles.fila}>
              <Text
                style={[
                  styles.totalLabel,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Total
              </Text>

              <Text
                style={[
                  styles.total,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Bs {item.total.toFixed(2)}
              </Text>
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={{ fontSize: 45 }}>🛒</Text>

          <Text
            style={[
              styles.vacioTitulo,
              {
                color: colors.text,
              },
            ]}
          >
            Sin pedidos
          </Text>

          <Text
            style={{
              color: dark ? "#94A3B8" : "#64748B",
              textAlign: "center",
              marginTop: 5,
            }}
          >
            Todavía no registraste ningún pedido.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 35,
  },

  header: {
    marginTop: 10,
    marginBottom: 20,
  },

  titulo: {
    fontSize: 27,
    fontWeight: "800",
  },

  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  nombre: {
    fontSize: 18,
    fontWeight: "800",
  },

  estadoBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 18,
  },

  separador: {
    height: 1,
    marginVertical: 16,
  },

  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  valor: {
    fontWeight: "700",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  total: {
    fontSize: 20,
    fontWeight: "800",
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  cargando: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 15,
  },

  errorTitulo: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 6,
  },

  vacio: {
    alignItems: "center",
    paddingVertical: 80,
  },

  vacioTitulo: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 12,
  },
});