import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";

import {
  useTheme,
} from "@react-navigation/native";

import MedicamentoCard from "../components/MedicamentoCard";
import {
  escucharMedicamentos,
} from "../services/medicamentosService";
import {
  Medicamento,
} from "../types/Medicamento";

type Props = {
  onSeleccionar: (
    medicamento: Medicamento
  ) => void;
};

export default function MedicamentosScreen({
  onSeleccionar,
}: Props) {
  const { colors, dark } = useTheme();

  const [medicamentos, setMedicamentos] =
    useState<Medicamento[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const [busqueda, setBusqueda] =
    useState("");

  const [
    categoriaSeleccionada,
    setCategoriaSeleccionada,
  ] = useState("Todos");

  // =========================
  // FIRESTORE
  // =========================

  useEffect(() => {
    let cancelar:
      | (() => void)
      | undefined;

    let activo = true;

    const conectarFirestore =
      async () => {
        cancelar =
          await escucharMedicamentos(
            (datos) => {
              if (!activo) return;

              console.log(
                "🔥 Medicamentos recibidos:",
                datos.length
              );

              setMedicamentos(datos);
              setCargando(false);
              setError("");
            },

            (errorFirestore) => {
              if (!activo) return;

              console.error(
                "❌ Error Firestore:",
                errorFirestore
              );

              setError(
                "No se pudieron cargar los medicamentos."
              );

              setCargando(false);
            }
          );
      };

    conectarFirestore();

    return () => {
      activo = false;

      if (cancelar) {
        cancelar();
      }
    };
  }, []);

  // =========================
  // CATEGORÍAS
  // =========================

  const categorias = useMemo(() => {
    const categoriasUnicas =
      Array.from(
        new Set(
          medicamentos.map(
            (item) =>
              item.categoria
          )
        )
      );

    return [
      "Todos",
      ...categoriasUnicas,
    ];
  }, [medicamentos]);

  // =========================
  // BÚSQUEDA Y FILTROS
  // =========================

  const medicamentosFiltrados =
    useMemo(() => {
      return medicamentos.filter(
        (medicamento) => {
          const coincideBusqueda =
            medicamento.nombre
              .toLowerCase()
              .includes(
                busqueda
                  .trim()
                  .toLowerCase()
              );

          const coincideCategoria =
            categoriaSeleccionada ===
              "Todos" ||
            medicamento.categoria ===
              categoriaSeleccionada;

          return (
            coincideBusqueda &&
            coincideCategoria
          );
        }
      );
    }, [
      medicamentos,
      busqueda,
      categoriaSeleccionada,
    ]);

  // =========================
  // ESTADÍSTICAS
  // =========================

  const totalMedicamentos =
    medicamentos.length;

  const stockBajo =
    medicamentos.filter(
      (medicamento) =>
        medicamento.stock <= 10
    ).length;

  const totalCategorias =
    new Set(
      medicamentos.map(
        (medicamento) =>
          medicamento.categoria
      )
    ).size;

  // =========================
  // CARGANDO
  // =========================

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
          color={colors.primary}
        />

        <Text
          style={[
            styles.cargandoTitulo,
            {
              color: colors.text,
            },
          ]}
        >
          Cargando medicamentos...
        </Text>

        <Text
          style={{
            color: dark
              ? "#94A3B8"
              : "#66829E",

            marginTop: 5,
          }}
        >
          Conectando con Firestore
        </Text>
      </View>
    );
  }

  // =========================
  // ERROR
  // =========================

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
            fontSize: 45,
          }}
        >
          ⚠️
        </Text>

        <Text
          style={[
            styles.errorTitulo,
            {
              color: colors.text,
            },
          ]}
        >
          Error de conexión
        </Text>

        <Text
          style={{
            color: dark
              ? "#94A3B8"
              : "#66829E",

            textAlign: "center",
            marginTop: 7,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  // =========================
  // PANTALLA PRINCIPAL
  // =========================

  return (
    <FlatList
      data={
        medicamentosFiltrados
      }
      keyExtractor={(item) =>
        item.id
      }
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
        <>
          {/* ENCABEZADO */}

          <View
            style={
              styles.encabezado
            }
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: dark
                    ? "#8EA6C0"
                    : "#62809D",

                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                Gestión móvil
              </Text>

              <Text
                style={[
                  styles.titulo,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Inventario de
                medicamentos
              </Text>
            </View>

            {/* LOGO REAL */}

            <View
              style={[
                styles.logo,
                {
                  backgroundColor:
                    dark
                      ? "#18324D"
                      : "#FFFFFF",
                },
              ]}
            >
              <Image
                source={require("../../assets/logo-farmacia.png")}
                style={
                  styles.logoImagen
                }
                resizeMode="contain"
              />
            </View>
          </View>

          {/* FIRESTORE */}

          <View
            style={[
              styles.firebaseBadge,
              {
                backgroundColor:
                  dark
                    ? "#123C32"
                    : "#E5F8F0",

                borderColor:
                  dark
                    ? "#216957"
                    : "#BCE9D9",
              },
            ]}
          >
            <View
              style={
                styles.puntoFirebase
              }
            />

            <Text
              style={{
                color: dark
                  ? "#6EE7B7"
                  : "#16845E",

                fontWeight: "700",
                fontSize: 12,
              }}
            >
              Firestore conectado
            </Text>
          </View>

          {/* ESTADÍSTICAS */}

          <View
            style={
              styles.estadisticas
            }
          >
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    dark
                      ? "#132B43"
                      : "#DCEEFF",

                  borderColor:
                    dark
                      ? "#234663"
                      : "#B8DCF8",
                },
              ]}
            >
              <View
                style={[
                  styles.iconoStat,
                  {
                    backgroundColor:
                      dark
                        ? "#1C4262"
                        : "#C3E3FF",
                  },
                ]}
              >
                <Text
                  style={
                    styles.statIcon
                  }
                >
                  📦
                </Text>
              </View>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: dark
                      ? "#D7EBFF"
                      : "#145A8D",
                  },
                ]}
              >
                {totalMedicamentos}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: dark
                      ? "#9FC4DF"
                      : "#47718E",
                  },
                ]}
              >
                Productos
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    dark
                      ? "#43232B"
                      : "#FFE6EA",

                  borderColor:
                    dark
                      ? "#683641"
                      : "#FFC9D2",
                },
              ]}
            >
              <View
                style={[
                  styles.iconoStat,
                  {
                    backgroundColor:
                      dark
                        ? "#5B2E38"
                        : "#FFD2DA",
                  },
                ]}
              >
                <Text
                  style={
                    styles.statIcon
                  }
                >
                  ⚠️
                </Text>
              </View>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: dark
                      ? "#FFB5C0"
                      : "#D9445F",
                  },
                ]}
              >
                {stockBajo}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: dark
                      ? "#DCA1AA"
                      : "#A14B5B",
                  },
                ]}
              >
                Stock bajo
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  backgroundColor:
                    dark
                      ? "#173A31"
                      : "#DFF7EC",

                  borderColor:
                    dark
                      ? "#28584B"
                      : "#BDEBD8",
                },
              ]}
            >
              <View
                style={[
                  styles.iconoStat,
                  {
                    backgroundColor:
                      dark
                        ? "#215043"
                        : "#C8EFDF",
                  },
                ]}
              >
                <Text
                  style={
                    styles.statIcon
                  }
                >
                  🏷️
                </Text>
              </View>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: dark
                      ? "#9BE5C9"
                      : "#1D8063",
                  },
                ]}
              >
                {totalCategorias}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color: dark
                      ? "#8BC7B3"
                      : "#4B7D6D",
                  },
                ]}
              >
                Categorías
              </Text>
            </View>
          </View>

          {/* BUSCADOR */}

          <View
            style={[
              styles.buscador,
              {
                backgroundColor:
                  dark
                    ? "#10253A"
                    : "#F8FCFF",

                borderColor:
                  dark
                    ? "#24445F"
                    : "#C9E2F5",
              },
            ]}
          >
            <View
              style={[
                styles.iconoBusqueda,
                {
                  backgroundColor:
                    dark
                      ? "#183A57"
                      : "#E2F2FF",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 17,
                }}
              >
                🔎
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  color:
                    colors.text,
                },
              ]}
              placeholder="Buscar medicamento..."
              placeholderTextColor={
                dark
                  ? "#71869A"
                  : "#8CA5BA"
              }
              value={busqueda}
              onChangeText={
                setBusqueda
              }
            />

            {busqueda.length >
              0 && (
              <Pressable
                onPress={() =>
                  setBusqueda("")
                }
              >
                <Text
                  style={{
                    color:
                      colors.text,

                    fontSize: 18,
                    padding: 5,
                  }}
                >
                  ✕
                </Text>
              </Pressable>
            )}
          </View>

          {/* CATEGORÍAS */}

          <Text
            style={[
              styles.seccionTitulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Categorías
          </Text>

          <FlatList
            horizontal
            data={categorias}
            keyExtractor={(
              item
            ) => item}
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.filtros
            }
            renderItem={({
              item,
            }) => {
              const seleccionado =
                categoriaSeleccionada ===
                item;

              return (
                <Pressable
                  onPress={() =>
                    setCategoriaSeleccionada(
                      item
                    )
                  }
                  style={[
                    styles.filtro,
                    {
                      backgroundColor:
                        seleccionado
                          ? "#2C91E8"
                          : dark
                          ? "#10253A"
                          : "#E8F4FD",

                      borderColor:
                        seleccionado
                          ? "#2C91E8"
                          : dark
                          ? "#24445F"
                          : "#C9E2F5",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        seleccionado
                          ? "#FFFFFF"
                          : colors.text,

                      fontWeight:
                        "700",

                      fontSize: 13,
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />

          {/* LISTA */}

          <View
            style={
              styles.productosHeader
            }
          >
            <Text
              style={[
                styles.seccionTitulo,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Medicamentos
            </Text>

            <View
              style={[
                styles.contadorResultados,
                {
                  backgroundColor:
                    dark
                      ? "#162C41"
                      : "#E1F1FC",
                },
              ]}
            >
              <Text
                style={{
                  color: dark
                    ? "#AFC8DB"
                    : "#557891",

                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {
                  medicamentosFiltrados.length
                }{" "}
                encontrados
              </Text>
            </View>
          </View>
        </>
      }

      renderItem={({ item }) => (
        <MedicamentoCard
          nombre={item.nombre}
          precio={item.precio}
          stock={item.stock}
          categoria={
            item.categoria
          }
          imagenUrl={
            item.imagenUrl
          }
          onPress={() =>
            onSeleccionar(item)
          }
        />
      )}

      ListEmptyComponent={
        <View
          style={
            styles.vacio
          }
        >
          <Text
            style={{
              fontSize: 40,
            }}
          >
            🔍
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
            Sin resultados
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
      paddingHorizontal: 18,
      paddingBottom: 35,
    },

    encabezado: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 12,
    },

    titulo: {
      fontSize: 24,
      lineHeight: 29,
      fontWeight: "900",
      letterSpacing: -0.4,
    },

    logo: {
      width: 72,
      height: 72,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 10,
      overflow: "hidden",
      padding: 4,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    },

    logoImagen: {
      width: "100%",
      height: "100%",
    },

    firebaseBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
      marginBottom: 20,
    },

    puntoFirebase: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        "#22C55E",
      marginRight: 7,
    },

    estadisticas: {
      flexDirection: "row",
      gap: 9,
      marginBottom: 22,
    },

    statCard: {
      flex: 1,
      minHeight: 125,
      borderWidth: 1,
      borderRadius: 20,
      paddingVertical: 13,
      paddingHorizontal: 11,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
    },

    iconoStat: {
      width: 35,
      height: 35,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },

    statIcon: {
      fontSize: 17,
    },

    statNumero: {
      fontSize: 23,
      fontWeight: "900",
      marginBottom: 1,
    },

    statLabel: {
      fontSize: 11,
      fontWeight: "600",
    },

    buscador: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 10,
      height: 55,
      marginBottom: 22,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },

    iconoBusqueda: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 9,
    },

    input: {
      flex: 1,
      fontSize: 15,
    },

    seccionTitulo: {
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 11,
    },

    filtros: {
      gap: 8,
      paddingBottom: 22,
    },

    filtro: {
      paddingVertical: 9,
      paddingHorizontal: 16,
      borderRadius: 22,
      borderWidth: 1,
    },

    productosHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
      marginBottom: 7,
    },

    contadorResultados: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },

    vacio: {
      alignItems: "center",
      paddingVertical: 50,
    },

    vacioTitulo: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 10,
    },

    centro: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      padding: 30,
    },

    cargandoTitulo: {
      fontSize: 17,
      fontWeight: "700",
      marginTop: 15,
    },

    errorTitulo: {
      fontSize: 21,
      fontWeight: "800",
      marginTop: 12,
    },
  });