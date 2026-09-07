import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import {
  useTheme,
} from "@react-navigation/native";

import {
  db,
} from "../config/firebase";

type Movimiento = {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  tipo:
    | "entrada"
    | "salida"
    | "ajuste";
  cantidad: number;
  motivo: string;
  stockAnterior: number;
  stockNuevo: number;
  creadoEn?: Date | null;
};

export default function MovimientosScreen() {
  const {
    colors,
    dark,
  } = useTheme();

  const [
    movimientos,
    setMovimientos,
  ] = useState<Movimiento[]>([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const movimientosRef =
      collection(
        db,
        "movimientos"
      );

    const consulta = query(
      movimientosRef,
      orderBy(
        "creadoEn",
        "desc"
      )
    );

    const cancelar =
      onSnapshot(
        consulta,
        (snapshot) => {
          const datos =
            snapshot.docs.map(
              (documento) => {
                const data =
                  documento.data();

                let creadoEn:
                  | Date
                  | null = null;

                if (
                  data.creadoEn instanceof
                  Timestamp
                ) {
                  creadoEn =
                    data.creadoEn.toDate();
                }

                return {
                  id:
                    documento.id,

                  medicamentoId:
                    data.medicamentoId ??
                    "",

                  medicamentoNombre:
                    data.medicamentoNombre ??
                    "Medicamento",

                  tipo:
                    data.tipo ??
                    "salida",

                  cantidad:
                    Number(
                      data.cantidad ??
                        0
                    ),

                  motivo:
                    data.motivo ??
                    "Movimiento",

                  stockAnterior:
                    Number(
                      data.stockAnterior ??
                        0
                    ),

                  stockNuevo:
                    Number(
                      data.stockNuevo ??
                        0
                    ),

                  creadoEn,
                } as Movimiento;
              }
            );

          setMovimientos(
            datos
          );

          setCargando(
            false
          );

          setError("");
        },

        (error) => {
          console.error(
            "❌ Error leyendo movimientos:",
            error
          );

          setError(
            "No se pudo cargar el historial."
          );

          setCargando(
            false
          );
        }
      );

    return cancelar;
  }, []);

  const formatearFecha = (
    fecha?: Date | null
  ) => {
    if (!fecha) {
      return "Fecha no disponible";
    }

    return fecha.toLocaleString(
      "es-BO"
    );
  };

  const obtenerIcono = (
    tipo: Movimiento["tipo"]
  ) => {
    if (
      tipo === "entrada"
    ) {
      return "📥";
    }

    if (
      tipo === "ajuste"
    ) {
      return "🔧";
    }

    return "📤";
  };

  const obtenerColor = (
    tipo: Movimiento["tipo"]
  ) => {
    if (
      tipo === "entrada"
    ) {
      return "#16A34A";
    }

    if (
      tipo === "ajuste"
    ) {
      return "#D97706";
    }

    return "#EF4444";
  };

  if (cargando) {
    return (
      <View
        style={[
          styles.centro,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={
            colors.primary
          }
        />

        <Text
          style={[
            styles.cargando,
            {
              color:
                colors.text,
            },
          ]}
        >
          Cargando movimientos...
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
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 42,
          }}
        >
          ⚠️
        </Text>

        <Text
          style={[
            styles.errorTitulo,
            {
              color:
                colors.text,
            },
          ]}
        >
          Error
        </Text>

        <Text
          style={{
            color: dark
              ? "#94A3B8"
              : "#64748B",

            textAlign:
              "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={
        movimientos
      }
      keyExtractor={(
        item
      ) => item.id}
      showsVerticalScrollIndicator={
        false
      }
      contentContainerStyle={[
        styles.lista,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      ListHeaderComponent={
        <View
          style={
            styles.header
          }
        >
          <Text
            style={[
              styles.titulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Historial de movimientos
          </Text>

          <Text
            style={{
              color: dark
                ? "#94A3B8"
                : "#64748B",

              marginTop: 5,
            }}
          >
            Entradas, salidas y ajustes del inventario
          </Text>

          <View
            style={[
              styles.contador,
              {
                backgroundColor:
                  dark
                    ? "#1E3A5F"
                    : "#EFF6FF",
              },
            ]}
          >
            <Text
              style={{
                color:
                  colors.primary,

                fontWeight:
                  "800",
              }}
            >
              {
                movimientos.length
              }{" "}
              movimiento(s)
            </Text>
          </View>
        </View>
      }
      renderItem={({
        item,
      }) => {
        const color =
          obtenerColor(
            item.tipo
          );

        return (
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  colors.border,
              },
            ]}
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <View
                style={[
                  styles.icono,
                  {
                    backgroundColor:
                      dark
                        ? "#1E293B"
                        : "#F8FAFC",
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize:
                      27,
                  }}
                >
                  {obtenerIcono(
                    item.tipo
                  )}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={[
                    styles.nombre,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {
                    item.medicamentoNombre
                  }
                </Text>

                <Text
                  style={{
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",

                    fontSize:
                      12,

                    marginTop:
                      4,
                  }}
                >
                  {formatearFecha(
                    item.creadoEn
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.tipoBadge,
                  {
                    backgroundColor:
                      `${color}18`,
                  },
                ]}
              >
                <Text
                  style={{
                    color,

                    fontWeight:
                      "800",

                    fontSize:
                      12,
                  }}
                >
                  {
                    item.tipo
                  }
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.separador,
                {
                  backgroundColor:
                    colors.border,
                },
              ]}
            />

            <View
              style={
                styles.fila
              }
            >
              <Text
                style={{
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                }}
              >
                Motivo
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {
                  item.motivo
                }
              </Text>
            </View>

            <View
              style={
                styles.fila
              }
            >
              <Text
                style={{
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                }}
              >
                Cantidad
              </Text>

              <Text
                style={[
                  styles.cantidad,
                  {
                    color,
                  },
                ]}
              >
                {item.tipo ===
                "entrada"
                  ? "+"
                  : item.tipo ===
                    "salida"
                  ? "-"
                  : ""}
                {
                  item.cantidad
                }
              </Text>
            </View>

            <View
              style={
                styles.stockFila
              }
            >
              <View>
                <Text
                  style={{
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",

                    fontSize:
                      12,
                  }}
                >
                  Stock anterior
                </Text>

                <Text
                  style={[
                    styles.stock,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {
                    item.stockAnterior
                  }
                </Text>
              </View>

              <Text
                style={{
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",

                  fontSize:
                    24,
                }}
              >
                →
              </Text>

              <View
                style={{
                  alignItems:
                    "flex-end",
                }}
              >
                <Text
                  style={{
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",

                    fontSize:
                      12,
                  }}
                >
                  Stock nuevo
                </Text>

                <Text
                  style={[
                    styles.stock,
                    {
                      color,
                    },
                  ]}
                >
                  {
                    item.stockNuevo
                  }
                </Text>
              </View>
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <View
          style={
            styles.vacio
          }
        >
          <Text
            style={{
              fontSize: 48,
            }}
          >
            📋
          </Text>

          <Text
            style={[
              styles.vacioTitulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Sin movimientos
          </Text>

          <Text
            style={{
              color: dark
                ? "#94A3B8"
                : "#64748B",

              textAlign:
                "center",

              marginTop: 5,
            }}
          >
            Los movimientos del inventario aparecerán aquí.
          </Text>
        </View>
      }
    />
  );
}

const styles =
  StyleSheet.create({
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

    contador: {
      alignSelf: "flex-start",
      marginTop: 14,
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderRadius: 20,
    },

    card: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    icono: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    nombre: {
      fontSize: 17,
      fontWeight: "800",
    },

    tipoBadge: {
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
      alignItems: "center",
      marginVertical: 6,
    },

    valor: {
      fontWeight: "700",
    },

    cantidad: {
      fontSize: 17,
      fontWeight: "800",
    },

    stockFila: {
      marginTop: 15,
      paddingTop: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    stock: {
      fontSize: 22,
      fontWeight: "800",
      marginTop: 3,
    },

    centro: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },

    cargando: {
      marginTop: 15,
      fontSize: 17,
      fontWeight: "700",
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
      marginTop: 12,
      fontSize: 20,
      fontWeight: "800",
    },
  });