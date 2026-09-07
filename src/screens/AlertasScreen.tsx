import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useTheme,
} from "@react-navigation/native";

import {
  Medicamento,
} from "../types/Medicamento";

import {
  escucharMedicamentos,
} from "../services/medicamentosService";

type Props = {
  onSeleccionar: (
    medicamento: Medicamento
  ) => void;
};

export default function AlertasScreen({
  onSeleccionar,
}: Props) {
  const {
    colors,
    dark,
  } = useTheme();

  const [
    medicamentos,
    setMedicamentos,
  ] = useState<Medicamento[]>([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  useEffect(() => {
    let cancelar:
      | (() => void)
      | undefined;

    let activo = true;

    const iniciar = async () => {
      try {
        cancelar =
          await escucharMedicamentos(
            (datos) => {
              if (!activo) {
                return;
              }

              setMedicamentos(
                datos
              );

              setCargando(
                false
              );
            }
          );
      } catch (error) {
        console.error(
          "Error escuchando medicamentos:",
          error
        );

        if (activo) {
          setCargando(
            false
          );
        }
      }
    };

    iniciar();

    return () => {
      activo = false;

      if (cancelar) {
        cancelar();
      }
    };
  }, []);

  const calcularDiasVencimiento = (
    fecha?: string
  ) => {
    if (!fecha) {
      return null;
    }

    const partes =
      fecha.split("-");

    if (
      partes.length !== 3
    ) {
      return null;
    }

    const [
      anio,
      mes,
      dia,
    ] = partes.map(Number);

    if (
      Number.isNaN(anio) ||
      Number.isNaN(mes) ||
      Number.isNaN(dia)
    ) {
      return null;
    }

    const vencimiento =
      new Date(
        anio,
        mes - 1,
        dia
      );

    vencimiento.setHours(
      0,
      0,
      0,
      0
    );

    const hoy =
      new Date();

    hoy.setHours(
      0,
      0,
      0,
      0
    );

    const diferencia =
      vencimiento.getTime() -
      hoy.getTime();

    return Math.round(
      diferencia /
        (
          1000 *
          60 *
          60 *
          24
        )
    );
  };

  const alertas =
    useMemo(() => {
      return medicamentos
        .filter(
          (
            medicamento
          ) => {
            const dias =
              calcularDiasVencimiento(
                medicamento.vencimiento
              );

            const stockBajo =
              medicamento.stock <=
              10;

            const vencido =
              dias !== null &&
              dias < 0;

            const proximoVencer =
              dias !== null &&
              dias >= 0 &&
              dias <= 180;

            return (
              stockBajo ||
              vencido ||
              proximoVencer
            );
          }
        )
        .sort(
          (a, b) => {
            const diasA =
              calcularDiasVencimiento(
                a.vencimiento
              );

            const diasB =
              calcularDiasVencimiento(
                b.vencimiento
              );

            const vencidoA =
              diasA !== null &&
              diasA < 0;

            const vencidoB =
              diasB !== null &&
              diasB < 0;

            if (
              vencidoA &&
              !vencidoB
            ) {
              return -1;
            }

            if (
              !vencidoA &&
              vencidoB
            ) {
              return 1;
            }

            const stockBajoA =
              a.stock <= 10;

            const stockBajoB =
              b.stock <= 10;

            if (
              stockBajoA &&
              !stockBajoB
            ) {
              return -1;
            }

            if (
              !stockBajoA &&
              stockBajoB
            ) {
              return 1;
            }

            if (
              diasA === null
            ) {
              return 1;
            }

            if (
              diasB === null
            ) {
              return -1;
            }

            return (
              diasA -
              diasB
            );
          }
        );
    }, [medicamentos]);

  const totalStockBajo =
    useMemo(
      () =>
        medicamentos.filter(
          (medicamento) =>
            medicamento.stock <=
            10
        ).length,
      [medicamentos]
    );

  const totalProximosVencer =
    useMemo(
      () =>
        medicamentos.filter(
          (medicamento) => {
            const dias =
              calcularDiasVencimiento(
                medicamento.vencimiento
              );

            return (
              dias !== null &&
              dias >= 0 &&
              dias <= 180
            );
          }
        ).length,
      [medicamentos]
    );

  const totalVencidos =
    useMemo(
      () =>
        medicamentos.filter(
          (medicamento) => {
            const dias =
              calcularDiasVencimiento(
                medicamento.vencimiento
              );

            return (
              dias !== null &&
              dias < 0
            );
          }
        ).length,
      [medicamentos]
    );

  const textoVencimiento = (
    dias: number
  ) => {
    if (dias === 0) {
      return "Vence hoy";
    }

    if (dias === 1) {
      return "Vence mañana";
    }

    return `Vence en ${dias} días`;
  };

  if (cargando) {
    return (
      <View
        style={[
          styles.cargando,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text
          style={[
            styles.cargandoTexto,
            {
              color:
                colors.text,
            },
          ]}
        >
          Cargando alertas...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={alertas}
      keyExtractor={(
        item,
        index
      ) =>
        String(
          item.id ??
            index
        )
      }
      contentContainerStyle={
        styles.lista
      }
      style={{
        backgroundColor:
          colors.background,
      }}
      ListHeaderComponent={
        <>
          <View
            style={
              styles.encabezadoTitulo
            }
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={[
                  styles.subtituloPrincipal,
                  {
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",
                  },
                ]}
              >
                Control automático
                de stock y
                vencimientos
              </Text>
            </View>

            <View
              style={
                styles.iconoAlertas
              }
            >
              <Text
                style={{
                  fontSize: 25,
                }}
              >
                🔔
              </Text>
            </View>
          </View>

          <View
            style={
              styles.resumen
            }
          >
            <View
              style={[
                styles.resumenCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={
                  styles.resumenIcono
                }
              >
                ⚠️
              </Text>

              <Text
                style={[
                  styles.resumenNumero,
                  {
                    color:
                      "#EF4444",
                  },
                ]}
              >
                {totalStockBajo}
              </Text>

              <Text
                style={[
                  styles.resumenTexto,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Stock bajo
              </Text>
            </View>

            <View
              style={[
                styles.resumenCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={
                  styles.resumenIcono
                }
              >
                📅
              </Text>

              <Text
                style={[
                  styles.resumenNumero,
                  {
                    color:
                      "#D97706",
                  },
                ]}
              >
                {
                  totalProximosVencer
                }
              </Text>

              <Text
                style={[
                  styles.resumenTexto,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Por vencer
              </Text>
            </View>

            <View
              style={[
                styles.resumenCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={
                  styles.resumenIcono
                }
              >
                🚨
              </Text>

              <Text
                style={[
                  styles.resumenNumero,
                  {
                    color:
                      "#EF4444",
                  },
                ]}
              >
                {
                  totalVencidos
                }
              </Text>

              <Text
                style={[
                  styles.resumenTexto,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Vencidos
              </Text>
            </View>
          </View>

          <View
            style={
              styles.seccionFila
            }
          >
            <Text
              style={[
                styles.seccion,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Requieren atención
            </Text>

            <View
              style={
                styles.contadorAlertas
              }
            >
              <Text
                style={
                  styles.contadorAlertasTexto
                }
              >
                {alertas.length}{" "}
                {alertas.length ===
                1
                  ? "alerta"
                  : "alertas"}
              </Text>
            </View>
          </View>
        </>
      }
      ListEmptyComponent={
        <View
          style={[
            styles.sinAlertas,
            {
              backgroundColor:
                colors.card,

              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={
              styles.sinAlertasIcono
            }
          >
            ✅
          </Text>

          <Text
            style={[
              styles.sinAlertasTitulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Todo está bien
          </Text>

          <Text
            style={[
              styles.sinAlertasTexto,
              {
                color: dark
                  ? "#94A3B8"
                  : "#64748B",
              },
            ]}
          >
            No hay medicamentos
            que requieran
            atención.
          </Text>
        </View>
      }
      renderItem={({
        item:
          medicamento,
      }) => {
        const dias =
          calcularDiasVencimiento(
            medicamento.vencimiento
          );

        const stockBajo =
          medicamento.stock <=
          10;

        const vencido =
          dias !== null &&
          dias < 0;

        const proximoVencer =
          dias !== null &&
          dias >= 0 &&
          dias <= 180;

        return (
          <Pressable
            onPress={() =>
              onSeleccionar(
                medicamento
              )
            }
            style={({
              pressed,
            }) => [
              styles.card,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  vencido
                    ? "#EF4444"
                    : colors.border,

                opacity: pressed
                  ? 0.82
                  : 1,
              },
            ]}
          >
            <View
              style={
                styles.cardHeader
              }
            >
              <View
                style={
                  styles.imagenProductoContenedor
                }
              >
                {medicamento.imagenUrl ? (
                  <Image
                    source={{
                      uri: medicamento.imagenUrl,
                    }}
                    style={
                      styles.imagenProducto
                    }
                    resizeMode="cover"
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: 30,
                    }}
                  >
                    💊
                  </Text>
                )}
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
                    medicamento.nombre
                  }
                </Text>

                <Text
                  style={[
                    styles.categoria,
                    {
                      color: dark
                        ? "#94A3B8"
                        : "#64748B",
                    },
                  ]}
                >
                  {
                    medicamento.categoria
                  }
                </Text>

                <Text
                  style={[
                    styles.stockTexto,
                    {
                      color: dark
                        ? "#CBD5E1"
                        : "#475569",
                    },
                  ]}
                >
                  Stock:{" "}
                  {
                    medicamento.stock
                  }
                </Text>
              </View>

              <View
                style={
                  styles.flechaContenedor
                }
              >
                <Text
                  style={[
                    styles.flecha,
                    {
                      color:
                        colors.primary,
                    },
                  ]}
                >
                  ›
                </Text>
              </View>
            </View>

            {stockBajo && (
              <View
                style={[
                  styles.alerta,
                  {
                    backgroundColor:
                      dark
                        ? "#451A1A"
                        : "#FEF2F2",
                  },
                ]}
              >
                <Text
                  style={
                    styles.alertaIcono
                  }
                >
                  ⚠️
                </Text>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={
                      styles.alertaRoja
                    }
                  >
                    Stock bajo
                  </Text>

                  <Text
                    style={[
                      styles.alertaDescripcion,
                      {
                        color: dark
                          ? "#FCA5A5"
                          : "#7F1D1D",
                      },
                    ]}
                  >
                    Solo quedan{" "}
                    {
                      medicamento.stock
                    }{" "}
                    unidades.
                  </Text>
                </View>
              </View>
            )}

            {vencido &&
              dias !== null && (
                <View
                  style={[
                    styles.alerta,
                    {
                      backgroundColor:
                        dark
                          ? "#451A1A"
                          : "#FEF2F2",
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.alertaIcono
                    }
                  >
                    🚨
                  </Text>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.alertaRoja
                      }
                    >
                      Medicamento
                      vencido
                    </Text>

                    <Text
                      style={[
                        styles.alertaDescripcion,
                        {
                          color: dark
                            ? "#FCA5A5"
                            : "#7F1D1D",
                        },
                      ]}
                    >
                      Venció hace{" "}
                      {
                        Math.abs(
                          dias
                        )
                      }{" "}
                      días ·{" "}
                      {
                        medicamento.vencimiento
                      }
                    </Text>
                  </View>
                </View>
              )}

            {proximoVencer &&
              dias !== null && (
                <View
                  style={[
                    styles.alerta,
                    {
                      backgroundColor:
                        dark
                          ? "#422006"
                          : "#FFFBEB",
                    },
                  ]}
                >
                  <Text
                    style={
                      styles.alertaIcono
                    }
                  >
                    📅
                  </Text>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.alertaNaranja
                      }
                    >
                      {textoVencimiento(
                        dias
                      )}
                    </Text>

                    <Text
                      style={[
                        styles.alertaDescripcion,
                        {
                          color: dark
                            ? "#FCD34D"
                            : "#92400E",
                        },
                      ]}
                    >
                      {
                        medicamento.vencimiento
                      }
                    </Text>
                  </View>
                </View>
              )}
          </Pressable>
        );
      }}
    />
  );
}

const styles =
  StyleSheet.create({
    cargando: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
    },

    cargandoTexto: {
      marginTop: 12,
      fontSize: 14,
    },

    lista: {
      flexGrow: 1,
      padding: 18,
      paddingBottom: 35,
    },

    encabezadoTitulo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      marginBottom: 20,
    },

    subtituloPrincipal: {
      fontSize: 17,
      fontWeight: "600",
      lineHeight: 24,
    },

    iconoAlertas: {
      width: 55,
      height: 55,
      borderRadius: 17,
      backgroundColor:
        "#DBEAFE",

      justifyContent:
        "center",

      alignItems:
        "center",

      marginLeft: 10,
    },

    resumen: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 25,
    },

    resumenCard: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 18,
      padding: 12,
      minHeight: 105,
    },

    resumenIcono: {
      fontSize: 20,
      marginBottom: 5,
    },

    resumenNumero: {
      fontSize: 24,
      fontWeight: "900",
    },

    resumenTexto: {
      fontSize: 11,
      fontWeight: "700",
      marginTop: 2,
    },

    seccionFila: {
      flexDirection: "row",
      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 13,
    },

    seccion: {
      fontSize: 18,
      fontWeight: "800",
    },

    contadorAlertas: {
      backgroundColor:
        "#DBEAFE",

      borderRadius: 20,

      paddingHorizontal: 11,
      paddingVertical: 5,
    },

    contadorAlertasTexto: {
      color: "#2563EB",
      fontSize: 11,
      fontWeight: "800",
    },

    card: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 17,
      marginBottom: 14,
    },

    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },

    imagenProductoContenedor: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor:
        "#DBEAFE",

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 12,

      overflow: "hidden",
    },

    imagenProducto: {
      width: "100%",
      height: "100%",
    },

    nombre: {
      fontSize: 17,
      fontWeight: "800",
    },

    categoria: {
      fontSize: 12,
      marginTop: 3,
    },

    stockTexto: {
      fontSize: 12,
      marginTop: 2,
    },

    flechaContenedor: {
      width: 30,
      height: 40,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    flecha: {
      fontSize: 32,
      fontWeight: "400",
    },

    alerta: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 15,
      padding: 13,
      marginTop: 8,
    },

    alertaIcono: {
      fontSize: 22,
      marginRight: 11,
    },

    alertaRoja: {
      color: "#EF4444",
      fontWeight: "800",
      fontSize: 14,
    },

    alertaNaranja: {
      color: "#D97706",
      fontWeight: "800",
      fontSize: 14,
    },

    alertaDescripcion: {
      fontSize: 12,
      marginTop: 3,
    },

    sinAlertas: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 30,
      alignItems:
        "center",
      marginTop: 15,
    },

    sinAlertasIcono: {
      fontSize: 40,
      marginBottom: 10,
    },

    sinAlertasTitulo: {
      fontSize: 18,
      fontWeight: "800",
    },

    sinAlertasTexto: {
      fontSize: 13,
      marginTop: 5,
      textAlign: "center",
    },
  });