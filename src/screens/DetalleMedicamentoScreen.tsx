import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useTheme } from "@react-navigation/native";

type Medicamento = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  vencimiento: string;
};

type Props = {
  medicamento: Medicamento;
  onVolver: () => void;
};

export default function DetalleMedicamentoScreen({
  medicamento,
  onVolver,
}: Props) {
  const { colors, dark } = useTheme();

  const [cantidad, setCantidad] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const stockBajo = medicamento.stock <= 10;

  const aumentarCantidad = () => {
    if (cantidad < medicamento.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarPedido = () => {
    setModalVisible(true);
  };

  const total = medicamento.precio * cantidad;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ICONO DEL MEDICAMENTO */}
        <View
          style={[
            styles.iconoGrande,
            {
              backgroundColor: dark ? "#24456D" : "#DBEAFE",
            },
          ]}
        >
          <Text style={styles.iconoTexto}>💊</Text>
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
              backgroundColor: dark ? "#24456D" : "#EFF6FF",
            },
          ]}
        >
          <Text
            style={[
              styles.categoriaTexto,
              {
                color: colors.primary,
              },
            ]}
          >
            {medicamento.categoria}
          </Text>
        </View>

        {/* PRECIO */}
        <Text
          style={[
            styles.labelPrecio,
            {
              color: dark ? "#94A3B8" : "#64748B",
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
          Bs {medicamento.precio.toFixed(2)}
        </Text>

        {/* INFORMACION DEL PRODUCTO */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitulo,
              {
                color: colors.text,
              },
            ]}
          >
            Información del producto
          </Text>

          {/* STOCK */}
          <View style={styles.fila}>
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
                  },
                ]}
              >
                Inventario disponible
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {medicamento.stock} unidades
              </Text>
            </View>

            <View
              style={[
                styles.estadoBadge,
                {
                  backgroundColor: stockBajo
                    ? dark
                      ? "#451A1A"
                      : "#FEE2E2"
                    : dark
                    ? "#143322"
                    : "#DCFCE7",
                },
              ]}
            >
              <View
                style={[
                  styles.punto,
                  {
                    backgroundColor: stockBajo
                      ? "#EF4444"
                      : "#22C55E",
                  },
                ]}
              />

              <Text
                style={[
                  styles.estadoTexto,
                  {
                    color: stockBajo
                      ? dark
                        ? "#FCA5A5"
                        : "#B91C1C"
                      : dark
                      ? "#86EFAC"
                      : "#15803D",
                  },
                ]}
              >
                {stockBajo ? "Stock bajo" : "Disponible"}
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

          {/* VENCIMIENTO */}
          <View style={styles.fila}>
            <View>
              <Text
                style={[
                  styles.label,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
                  },
                ]}
              >
                Fecha de vencimiento
              </Text>

              <Text
                style={[
                  styles.valor,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {medicamento.vencimiento}
              </Text>
            </View>

            <Text style={styles.calendario}>📅</Text>
          </View>
        </View>

        {/* CANTIDAD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitulo,
              {
                color: colors.text,
              },
            ]}
          >
            Cantidad
          </Text>

          <View style={styles.cantidadFila}>
            {/* RESTAR */}
            <Pressable
              onPress={disminuirCantidad}
              style={({ pressed }) => [
                styles.botonCantidad,
                {
                  backgroundColor: dark
                    ? "#334155"
                    : "#F1F5F9",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.botonCantidadTexto,
                  {
                    color: colors.text,
                  },
                ]}
              >
                −
              </Text>
            </Pressable>

            {/* CANTIDAD */}
            <Text
              style={[
                styles.cantidad,
                {
                  color: colors.text,
                },
              ]}
            >
              {cantidad}
            </Text>

            {/* SUMAR */}
            <Pressable
              onPress={aumentarCantidad}
              style={({ pressed }) => [
                styles.botonCantidad,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text style={styles.botonCantidadMas}>
                +
              </Text>
            </Pressable>
          </View>

          {/* LIMITE */}
          <Text
            style={[
              styles.disponibilidadTexto,
              {
                color: dark ? "#94A3B8" : "#64748B",
              },
            ]}
          >
            Máximo disponible: {medicamento.stock} unidades
          </Text>

          <View
            style={[
              styles.separador,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          {/* TOTAL */}
          <View style={styles.totalFila}>
            <Text
              style={[
                styles.totalLabel,
                {
                  color: dark ? "#94A3B8" : "#64748B",
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
              Bs {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* AGREGAR */}
        <Pressable
          onPress={agregarPedido}
          style={({ pressed }) => [
            styles.botonPrincipal,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.botonPrincipalTexto}>
            🛒 Agregar al pedido
          </Text>
        </Pressable>

        {/* VOLVER */}
        <Pressable
          onPress={onVolver}
          style={({ pressed }) => [
            styles.botonVolver,
            {
              borderColor: colors.border,
              backgroundColor: pressed
                ? dark
                  ? "#1E293B"
                  : "#F1F5F9"
                : "transparent",
            },
          ]}
        >
          <Text
            style={[
              styles.botonVolverTexto,
              {
                color: colors.text,
              },
            ]}
          >
            Volver al inventario
          </Text>
        </Pressable>
      </ScrollView>

      {/* MODAL DE CONFIRMACION */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* CHECK */}
            <View
              style={[
                styles.modalIcono,
                {
                  backgroundColor: dark
                    ? "#143322"
                    : "#DCFCE7",
                },
              ]}
            >
              <Text style={styles.modalIconoTexto}>
                ✓
              </Text>
            </View>

            <Text
              style={[
                styles.modalTitulo,
                {
                  color: colors.text,
                },
              ]}
            >
              Producto agregado
            </Text>

            <Text
              style={[
                styles.modalSubtitulo,
                {
                  color: dark ? "#94A3B8" : "#64748B",
                },
              ]}
            >
              El medicamento fue agregado correctamente
              al pedido.
            </Text>

            {/* RESUMEN */}
            <View
              style={[
                styles.modalResumen,
                {
                  backgroundColor: dark
                    ? "#0F172A"
                    : "#F8FAFC",
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.modalFila}>
                <Text
                  style={[
                    styles.modalLabel,
                    {
                      color: dark
                        ? "#94A3B8"
                        : "#64748B",
                    },
                  ]}
                >
                  Medicamento
                </Text>

                <Text
                  style={[
                    styles.modalValor,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {medicamento.nombre}
                </Text>
              </View>

              <View style={styles.modalFila}>
                <Text
                  style={[
                    styles.modalLabel,
                    {
                      color: dark
                        ? "#94A3B8"
                        : "#64748B",
                    },
                  ]}
                >
                  Cantidad
                </Text>

                <Text
                  style={[
                    styles.modalValor,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {cantidad}
                </Text>
              </View>

              <View
                style={[
                  styles.modalSeparador,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              />

              <View style={styles.modalFila}>
                <Text
                  style={[
                    styles.modalTotalLabel,
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
                    styles.modalTotal,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Bs {total.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* ACEPTAR */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={({ pressed }) => [
                styles.modalBoton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.modalBotonTexto}>
                Aceptar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },

  iconoGrande: {
    width: 105,
    height: 105,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 20,
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

  labelPrecio: {
    marginTop: 24,
    fontSize: 14,
  },

  precio: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 25,
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
    justifyContent: "space-between",
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

  botonCantidadMas: {
    fontSize: 30,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  cantidad: {
    fontSize: 29,
    fontWeight: "800",
    minWidth: 45,
    textAlign: "center",
  },

  disponibilidadTexto: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
  },

  totalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  // MODAL

  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.70)",
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

  modalIcono: {
    width: 75,
    height: 75,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  modalIconoTexto: {
    color: "#22C55E",
    fontSize: 42,
    fontWeight: "900",
  },

  modalTitulo: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  modalSubtitulo: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },

  modalResumen: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 22,
  },

  modalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },

  modalLabel: {
    fontSize: 13,
  },

  modalValor: {
    fontSize: 14,
    fontWeight: "700",
    maxWidth: "55%",
    textAlign: "right",
  },

  modalSeparador: {
    width: "100%",
    height: 1,
    marginVertical: 12,
  },

  modalTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  modalTotal: {
    fontSize: 22,
    fontWeight: "800",
  },

  modalBoton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  modalBotonTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});