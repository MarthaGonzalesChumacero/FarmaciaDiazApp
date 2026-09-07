import React, { useState } from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";

import { useTheme } from "@react-navigation/native";

import { Medicamento } from "../types/Medicamento";
import { registrarPedido } from "../services/pedidosService";
import { eliminarMedicamento } from "../services/medicamentosCrudService";

type Props = {
  medicamento: Medicamento;
  onVolver: () => void;
  onEditar: () => void;
};

export default function DetalleMedicamentoScreen({
  medicamento,
  onVolver,
  onEditar,
}: Props) {
  const { colors, dark } = useTheme();

  const [cantidad, setCantidad] = useState(1);

  const [guardandoPedido, setGuardandoPedido] =
    useState(false);

  const [eliminando, setEliminando] =
    useState(false);

  // MODAL PEDIDO
  const [modalPedidoVisible, setModalPedidoVisible] =
    useState(false);

  const [pedidoExitoso, setPedidoExitoso] =
    useState(false);

  const [mensajePedido, setMensajePedido] =
    useState("");

  // MODAL ELIMINAR
  const [
    modalEliminarVisible,
    setModalEliminarVisible,
  ] = useState(false);

  const [
    modalEliminadoVisible,
    setModalEliminadoVisible,
  ] = useState(false);

  const [errorEliminar, setErrorEliminar] =
    useState("");

  // =========================
  // ESTADO DEL MEDICAMENTO
  // =========================

  const agotado = medicamento.stock <= 0;

  const stockBajo =
    medicamento.stock > 0 &&
    medicamento.stock <= 10;

  const estaVencido = () => {
    if (!medicamento.vencimiento) {
      return false;
    }

    const partes =
      medicamento.vencimiento.split("-");

    if (partes.length !== 3) {
      return false;
    }

    const [anio, mes, dia] =
      partes.map(Number);

    if (
      Number.isNaN(anio) ||
      Number.isNaN(mes) ||
      Number.isNaN(dia)
    ) {
      return false;
    }

    const fechaVencimiento =
      new Date(
        anio,
        mes - 1,
        dia,
        12,
        0,
        0
      );

    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    return (
      fechaVencimiento.getTime() <
      hoy.getTime()
    );
  };

  const vencido = estaVencido();

  const pedidoBloqueado =
    agotado || vencido;

  const total =
    medicamento.precio * cantidad;

  const formatearFecha = (
    fecha: string
  ) => {
    if (!fecha) {
      return "Sin fecha";
    }

    const partes =
      fecha.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    const [anio, mes, dia] =
      partes;

    return `${dia}/${mes}/${anio}`;
  };

  // =========================
  // ESTILO DEL ESTADO
  // =========================

  const obtenerEstado = () => {
    if (vencido) {
      return {
        texto: "Vencido",
        color: "#EF4444",
        fondo: dark
          ? "#451A1A"
          : "#FEE2E2",
      };
    }

    if (agotado) {
      return {
        texto: "Agotado",
        color: "#EF4444",
        fondo: dark
          ? "#451A1A"
          : "#FEE2E2",
      };
    }

    if (stockBajo) {
      return {
        texto: "Stock bajo",
        color: "#EF4444",
        fondo: dark
          ? "#451A1A"
          : "#FEE2E2",
      };
    }

    return {
      texto: "Disponible",
      color: "#22C55E",
      fondo: dark
        ? "#143322"
        : "#DCFCE7",
    };
  };

  const estado =
    obtenerEstado();

  // =========================
  // CANTIDAD
  // =========================

  const aumentarCantidad = () => {
    if (pedidoBloqueado) {
      return;
    }

    if (
      cantidad <
      medicamento.stock
    ) {
      setCantidad(
        (valor) => valor + 1
      );
    }
  };

  const disminuirCantidad = () => {
    if (pedidoBloqueado) {
      return;
    }

    if (cantidad > 1) {
      setCantidad(
        (valor) => valor - 1
      );
    }
  };

  // =========================
  // PEDIDO
  // =========================

  const agregarPedido =
    async () => {
      if (
        guardandoPedido ||
        eliminando
      ) {
        return;
      }

      if (vencido) {
        setPedidoExitoso(false);

        setMensajePedido(
          "Este medicamento está vencido y no puede agregarse a un pedido."
        );

        setModalPedidoVisible(
          true
        );

        return;
      }

      if (agotado) {
        setPedidoExitoso(false);

        setMensajePedido(
          "Este medicamento está agotado y no tiene unidades disponibles."
        );

        setModalPedidoVisible(
          true
        );

        return;
      }

      try {
        setGuardandoPedido(
          true
        );

        await registrarPedido(
          medicamento,
          cantidad
        );

        setPedidoExitoso(true);

        setMensajePedido(
          `Se agregaron ${cantidad} unidad(es) de ${medicamento.nombre}.`
        );

        setModalPedidoVisible(
          true
        );
      } catch (error) {
        console.error(
          "❌ Error registrando pedido:",
          error
        );

        setPedidoExitoso(false);

        setMensajePedido(
          error instanceof Error
            ? error.message
            : "No se pudo registrar el pedido."
        );

        setModalPedidoVisible(
          true
        );
      } finally {
        setGuardandoPedido(
          false
        );
      }
    };

  const cerrarModalPedido =
    () => {
      setModalPedidoVisible(
        false
      );

      if (pedidoExitoso) {
        onVolver();
      }
    };

  // =========================
  // ELIMINAR
  // =========================

  const confirmarEliminar =
    async () => {
      if (eliminando) {
        return;
      }

      try {
        setEliminando(true);
        setErrorEliminar("");

        await eliminarMedicamento(
          medicamento.id
        );

        console.log(
          "🗑️ Medicamento eliminado correctamente"
        );

        setModalEliminarVisible(
          false
        );

        setModalEliminadoVisible(
          true
        );
      } catch (error) {
        console.error(
          "❌ Error eliminando medicamento:",
          error
        );

        setErrorEliminar(
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el medicamento."
        );
      } finally {
        setEliminando(false);
      }
    };

  const finalizarEliminacion =
    () => {
      setModalEliminadoVisible(
        false
      );

      onVolver();
    };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor:
            colors.background,
        }}
        contentContainerStyle={
          styles.container
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* FOTO DEL MEDICAMENTO */}

        <View
          style={[
            styles.imagenContenedor,
            {
              backgroundColor: dark
                ? "#0F172A"
                : "#F8FAFC",
              borderColor:
                colors.border,
            },
          ]}
        >
          {medicamento.imagenUrl ? (
            <Image
              source={{
                uri: medicamento.imagenUrl,
              }}
              style={
                styles.imagenMedicamento
              }
              resizeMode="contain"
            />
          ) : (
            <Text
              style={
                styles.iconoTexto
              }
            >
              💊
            </Text>
          )}
        </View>

        {/* NOMBRE */}

        <Text
          style={[
            styles.nombre,
            {
              color: colors.text,
            },
          ]}
        >
          {medicamento.nombre}
        </Text>

        {/* CATEGORIA */}

        <View
          style={[
            styles.categoriaBadge,
            {
              backgroundColor: dark
                ? "#24456D"
                : "#EFF6FF",
            },
          ]}
        >
          <Text
            style={[
              styles.categoriaTexto,
              {
                color:
                  colors.primary,
              },
            ]}
          >
            {medicamento.categoria}
          </Text>
        </View>

        {/* LABORATORIO */}

        <Text
          style={[
            styles.laboratorio,
            {
              color: dark
                ? "#94A3B8"
                : "#64748B",
            },
          ]}
        >
          Laboratorio{" "}
          {medicamento.laboratorio}
        </Text>

        {/* PRECIO */}

        <Text
          style={[
            styles.labelPrecio,
            {
              color: dark
                ? "#94A3B8"
                : "#64748B",
            },
          ]}
        >
          Precio
        </Text>

        <Text
          style={[
            styles.precio,
            {
              color: colors.text,
            },
          ]}
        >
          Bs{" "}
          {medicamento.precio.toFixed(
            2
          )}
        </Text>

        {/* ADVERTENCIA VENCIDO */}

        {vencido && (
          <View
            style={[
              styles.advertencia,
              {
                backgroundColor: dark
                  ? "#451A1A"
                  : "#FEF2F2",

                borderColor:
                  "#EF4444",
              },
            ]}
          >
            <Text
              style={
                styles.advertenciaIcono
              }
            >
              🚨
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.advertenciaTitulo
                }
              >
                Medicamento vencido
              </Text>

              <Text
                style={[
                  styles.advertenciaTexto,
                  {
                    color: dark
                      ? "#FCA5A5"
                      : "#991B1B",
                  },
                ]}
              >
                No puede agregarse a
                un pedido.
              </Text>
            </View>
          </View>
        )}

        {/* ADVERTENCIA AGOTADO */}

        {agotado && !vencido && (
          <View
            style={[
              styles.advertencia,
              {
                backgroundColor: dark
                  ? "#451A1A"
                  : "#FEF2F2",

                borderColor:
                  "#EF4444",
              },
            ]}
          >
            <Text
              style={
                styles.advertenciaIcono
              }
            >
              📦
            </Text>

            <View style={{ flex: 1 }}>
              <Text
                style={
                  styles.advertenciaTitulo
                }
              >
                Producto agotado
              </Text>

              <Text
                style={[
                  styles.advertenciaTexto,
                  {
                    color: dark
                      ? "#FCA5A5"
                      : "#991B1B",
                  },
                ]}
              >
                No existen unidades
                disponibles.
              </Text>
            </View>
          </View>
        )}

        {/* INFORMACION */}

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
          <Text
            style={[
              styles.cardTitulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Información del producto
          </Text>

          <View style={styles.fila}>
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",
                  },
                ]}
              >
                Inventario disponible
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
                {medicamento.stock}{" "}
                unidades
              </Text>
            </View>

            <View
              style={[
                styles.estadoBadge,
                {
                  backgroundColor:
                    estado.fondo,
                },
              ]}
            >
              <View
                style={[
                  styles.punto,
                  {
                    backgroundColor:
                      estado.color,
                  },
                ]}
              />

              <Text
                style={[
                  styles.estadoTexto,
                  {
                    color:
                      estado.color,
                  },
                ]}
              >
                {estado.texto}
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

          <View style={styles.fila}>
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark
                      ? "#94A3B8"
                      : "#64748B",
                  },
                ]}
              >
                Fecha de vencimiento
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color: vencido
                      ? "#EF4444"
                      : colors.text,
                  },
                ]}
              >
                {formatearFecha(
                  medicamento.vencimiento
                )}
              </Text>
            </View>

            <Text
              style={
                styles.calendario
              }
            >
              📅
            </Text>
          </View>
        </View>

        {/* BOTONES ADMIN */}

        <View
          style={
            styles.accionesAdmin
          }
        >
          <Pressable
            onPress={onEditar}
            disabled={
              eliminando ||
              guardandoPedido
            }
            style={[
              styles.botonEditar,
              {
                backgroundColor:
                  dark
                    ? "#1E3A5F"
                    : "#EFF6FF",

                borderColor:
                  colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.botonEditarTexto,
                {
                  color:
                    colors.primary,
                },
              ]}
            >
              ✏️ Editar
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setModalEliminarVisible(
                true
              )
            }
            disabled={
              eliminando ||
              guardandoPedido
            }
            style={[
              styles.botonEliminar,
              {
                backgroundColor: dark
                  ? "#451A1A"
                  : "#FEF2F2",

                borderColor:
                  "#EF4444",
              },
            ]}
          >
            <Text
              style={
                styles.botonEliminarTexto
              }
            >
              🗑️ Eliminar
            </Text>
          </Pressable>
        </View>

        {/* CANTIDAD */}

        <View
          style={[
            styles.card,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,

              opacity:
                pedidoBloqueado
                  ? 0.65
                  : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitulo,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Cantidad
          </Text>

          <View
            style={
              styles.cantidadFila
            }
          >
            <Pressable
              onPress={
                disminuirCantidad
              }
              disabled={
                guardandoPedido ||
                pedidoBloqueado
              }
              style={[
                styles.botonCantidad,
                {
                  backgroundColor:
                    dark
                      ? "#334155"
                      : "#F1F5F9",
                },
              ]}
            >
              <Text
                style={[
                  styles.botonCantidadTexto,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                −
              </Text>
            </Pressable>

            <Text
              style={[
                styles.cantidad,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {pedidoBloqueado
                ? 0
                : cantidad}
            </Text>

            <Pressable
              onPress={
                aumentarCantidad
              }
              disabled={
                guardandoPedido ||
                pedidoBloqueado
              }
              style={[
                styles.botonCantidad,
                {
                  backgroundColor:
                    pedidoBloqueado
                      ? "#94A3B8"
                      : colors.primary,
                },
              ]}
            >
              <Text
                style={
                  styles.botonMas
                }
              >
                +
              </Text>
            </Pressable>
          </View>

          <Text
            style={[
              styles.maximo,
              {
                color: dark
                  ? "#94A3B8"
                  : "#64748B",
              },
            ]}
          >
            {vencido
              ? "Pedido deshabilitado: medicamento vencido"
              : agotado
              ? "Sin unidades disponibles"
              : `Máximo disponible: ${medicamento.stock} unidades`}
          </Text>

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
              styles.totalFila
            }
          >
            <Text
              style={[
                styles.totalLabel,
                {
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                },
              ]}
            >
              Total
            </Text>

            <Text
              style={[
                styles.total,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Bs{" "}
              {pedidoBloqueado
                ? "0.00"
                : total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* AGREGAR PEDIDO */}

        <Pressable
          onPress={agregarPedido}
          disabled={
            guardandoPedido ||
            eliminando ||
            pedidoBloqueado
          }
          style={[
            styles.botonPrincipal,
            {
              backgroundColor:
                pedidoBloqueado
                  ? "#94A3B8"
                  : colors.primary,

              opacity:
                guardandoPedido
                  ? 0.7
                  : 1,
            },
          ]}
        >
          {guardandoPedido ? (
            <View
              style={
                styles.guardandoFila
              }
            >
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.botonPrincipalTexto
                }
              >
                Guardando...
              </Text>
            </View>
          ) : (
            <Text
              style={
                styles.botonPrincipalTexto
              }
            >
              {vencido
                ? "🚫 Medicamento vencido"
                : agotado
                ? "🚫 Producto agotado"
                : "🛒 Agregar al pedido"}
            </Text>
          )}
        </Pressable>

        {/* VOLVER */}

        <Pressable
          onPress={onVolver}
          style={[
            styles.botonVolver,
            {
              borderColor:
                colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.botonVolverTexto,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Volver al inventario
          </Text>
        </Pressable>
      </ScrollView>

      {/* MODAL PEDIDO */}

      <Modal
        visible={
          modalPedidoVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          cerrarModalPedido
        }
      >
        <View
          style={
            styles.modalFondo
          }
        >
          <View
            style={[
              styles.modalCard,
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
                styles.modalEmoji
              }
            >
              {pedidoExitoso
                ? "✅"
                : "⚠️"}
            </Text>

            <Text
              style={[
                styles.modalTitulo,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              {pedidoExitoso
                ? "Pedido registrado"
                : "Pedido no disponible"}
            </Text>

            <Text
              style={[
                styles.modalTexto,
                {
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                },
              ]}
            >
              {mensajePedido}
            </Text>

            <Pressable
              onPress={
                cerrarModalPedido
              }
              style={[
                styles.modalBoton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text
                style={
                  styles.modalBotonTexto
                }
              >
                {pedidoExitoso
                  ? "Volver al inventario"
                  : "Aceptar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* CONFIRMAR ELIMINACION */}

      <Modal
        visible={
          modalEliminarVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!eliminando) {
            setModalEliminarVisible(
              false
            );
          }
        }}
      >
        <View
          style={
            styles.modalFondo
          }
        >
          <View
            style={[
              styles.modalCard,
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
                styles.modalEmoji
              }
            >
              🗑️
            </Text>

            <Text
              style={[
                styles.modalTitulo,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Eliminar medicamento
            </Text>

            <Text
              style={[
                styles.modalTexto,
                {
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                },
              ]}
            >
              ¿Seguro que deseas eliminar{" "}
              {medicamento.nombre}?
              Esta acción no se puede
              deshacer.
            </Text>

            {errorEliminar !== "" && (
              <Text
                style={
                  styles.errorEliminar
                }
              >
                {errorEliminar}
              </Text>
            )}

            <Pressable
              onPress={
                confirmarEliminar
              }
              disabled={eliminando}
              style={[
                styles.confirmarEliminar,
                {
                  opacity:
                    eliminando
                      ? 0.7
                      : 1,
                },
              ]}
            >
              {eliminando ? (
                <View
                  style={
                    styles.guardandoFila
                  }
                >
                  <ActivityIndicator
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.modalBotonTexto
                    }
                  >
                    Eliminando...
                  </Text>
                </View>
              ) : (
                <Text
                  style={
                    styles.modalBotonTexto
                  }
                >
                  Sí, eliminar
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() =>
                setModalEliminarVisible(
                  false
                )
              }
              disabled={eliminando}
              style={[
                styles.cancelarEliminar,
                {
                  borderColor:
                    colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color:
                    colors.text,
                  fontWeight: "700",
                }}
              >
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ELIMINADO CORRECTAMENTE */}

      <Modal
        visible={
          modalEliminadoVisible
        }
        transparent
        animationType="fade"
        onRequestClose={
          finalizarEliminacion
        }
      >
        <View
          style={
            styles.modalFondo
          }
        >
          <View
            style={[
              styles.modalCard,
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
                styles.modalEmoji
              }
            >
              ✅
            </Text>

            <Text
              style={[
                styles.modalTitulo,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Medicamento eliminado
            </Text>

            <Text
              style={[
                styles.modalTexto,
                {
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                },
              ]}
            >
              {medicamento.nombre} fue
              eliminado correctamente
              del inventario.
            </Text>

            <Pressable
              onPress={
                finalizarEliminacion
              }
              style={[
                styles.modalBoton,
                {
                  backgroundColor:
                    colors.primary,
                },
              ]}
            >
              <Text
                style={
                  styles.modalBotonTexto
                }
              >
                Volver al inventario
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles =
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
      alignItems: "center",
    },

    imagenContenedor: {
      width: "100%",
      height: 280,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 18,
      marginBottom: 20,
      borderWidth: 1,
      overflow: "hidden",
    },

    imagenMedicamento: {
      width: "100%",
      height: "100%",
    },

    iconoTexto: {
      fontSize: 55,
    },

    nombre: {
      fontSize: 30,
      fontWeight: "800",
      textAlign: "center",
    },

    categoriaBadge: {
      marginTop: 11,
      paddingHorizontal: 17,
      paddingVertical: 8,
      borderRadius: 22,
    },

    categoriaTexto: {
      fontSize: 14,
      fontWeight: "700",
    },

    laboratorio: {
      fontSize: 13,
      marginTop: 10,
    },

    labelPrecio: {
      marginTop: 22,
      fontSize: 14,
    },

    precio: {
      fontSize: 34,
      fontWeight: "800",
      marginTop: 4,
      marginBottom: 25,
    },

    advertencia: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 17,
      padding: 15,
      marginBottom: 17,
    },

    advertenciaIcono: {
      fontSize: 27,
      marginRight: 12,
    },

    advertenciaTitulo: {
      color: "#EF4444",
      fontSize: 15,
      fontWeight: "800",
    },

    advertenciaTexto: {
      fontSize: 12,
      marginTop: 3,
    },

    card: {
      width: "100%",
      borderWidth: 1,
      borderRadius: 22,
      padding: 20,
      marginBottom: 17,
    },

    cardTitulo: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 20,
    },

    fila: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    label: {
      fontSize: 13,
      marginBottom: 6,
    },

    valor: {
      fontSize: 17,
      fontWeight: "700",
    },

    estadoBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },

    punto: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 7,
    },

    estadoTexto: {
      fontWeight: "700",
      fontSize: 13,
    },

    separador: {
      width: "100%",
      height: 1,
      marginVertical: 19,
    },

    calendario: {
      fontSize: 27,
    },

    accionesAdmin: {
      width: "100%",
      flexDirection: "row",
      gap: 10,
      marginBottom: 17,
    },

    botonEditar: {
      flex: 1,
      height: 55,
      borderRadius: 17,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    botonEditarTexto: {
      fontSize: 14,
      fontWeight: "800",
    },

    botonEliminar: {
      flex: 1,
      height: 55,
      borderRadius: 17,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    botonEliminarTexto: {
      color: "#EF4444",
      fontSize: 14,
      fontWeight: "800",
    },

    cantidadFila: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
    },

    botonCantidad: {
      width: 54,
      height: 54,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
    },

    botonCantidadTexto: {
      fontSize: 30,
      fontWeight: "600",
    },

    botonMas: {
      color: "#FFFFFF",
      fontSize: 30,
      fontWeight: "600",
    },

    cantidad: {
      fontSize: 29,
      fontWeight: "800",
      minWidth: 45,
      textAlign: "center",
    },

    maximo: {
      textAlign: "center",
      fontSize: 12,
      marginTop: 15,
    },

    totalFila: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    totalLabel: {
      fontSize: 15,
    },

    total: {
      fontSize: 23,
      fontWeight: "800",
    },

    botonPrincipal: {
      width: "100%",
      paddingVertical: 18,
      borderRadius: 17,
      alignItems: "center",
      marginTop: 5,
    },

    botonPrincipalTexto: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "800",
    },

    guardandoFila: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    botonVolver: {
      width: "100%",
      paddingVertical: 16,
      borderRadius: 17,
      borderWidth: 1,
      alignItems: "center",
      marginTop: 13,
    },

    botonVolverTexto: {
      fontSize: 15,
      fontWeight: "700",
    },

    modalFondo: {
      flex: 1,
      backgroundColor:
        "rgba(0,0,0,0.70)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },

    modalCard: {
      width: "100%",
      borderRadius: 26,
      padding: 25,
      borderWidth: 1,
      alignItems: "center",
    },

    modalEmoji: {
      fontSize: 55,
      marginBottom: 16,
    },

    modalTitulo: {
      fontSize: 23,
      fontWeight: "800",
      textAlign: "center",
    },

    modalTexto: {
      fontSize: 14,
      textAlign: "center",
      lineHeight: 21,
      marginTop: 9,
      marginBottom: 22,
    },

    modalBoton: {
      width: "100%",
      height: 53,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    modalBotonTexto: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },

    confirmarEliminar: {
      width: "100%",
      height: 53,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#EF4444",
    },

    cancelarEliminar: {
      width: "100%",
      height: 50,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },

    errorEliminar: {
      color: "#EF4444",
      textAlign: "center",
      marginBottom: 15,
      fontWeight: "600",
    },
  });