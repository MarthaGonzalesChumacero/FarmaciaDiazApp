import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";

type Props = {
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  onPress: () => void;
};

export default function MedicamentoCard({
  nombre,
  precio,
  stock,
  categoria,
  onPress,
}: Props) {
  const { colors, dark } = useTheme();

  const stockBajo = stock <= 10;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.filaSuperior}>
        <View
          style={[
            styles.icono,
            {
              backgroundColor: dark ? "#1E3A5F" : "#DBEAFE",
            },
          ]}
        >
          <Text style={styles.iconoTexto}>💊</Text>
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.nombre,
              { color: colors.text },
            ]}
          >
            {nombre}
          </Text>

          <Text
            style={[
              styles.categoria,
              { color: dark ? "#94A3B8" : "#64748B" },
            ]}
          >
            {categoria}
          </Text>
        </View>

        <Text
          style={[
            styles.flecha,
            { color: colors.primary },
          ]}
        >
          ›
        </Text>
      </View>

      <View
        style={[
          styles.separador,
          { backgroundColor: colors.border },
        ]}
      />

      <View style={styles.filaInferior}>
        <View>
          <Text
            style={[
              styles.label,
              { color: dark ? "#94A3B8" : "#64748B" },
            ]}
          >
            Precio
          </Text>

          <Text
            style={[
              styles.precio,
              { color: colors.text },
            ]}
          >
            Bs {precio.toFixed(2)}
          </Text>
        </View>

        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.label,
              { color: dark ? "#94A3B8" : "#64748B" },
            ]}
          >
            Inventario
          </Text>

          <View
            style={[
              styles.badge,
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
                styles.stockTexto,
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
              {stockBajo
                ? `Stock bajo: ${stock}`
                : `Disponible: ${stock}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
  },

  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
  },

  icono: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  iconoTexto: {
    fontSize: 25,
  },

  info: {
    flex: 1,
    marginLeft: 13,
  },

  nombre: {
    fontSize: 17,
    fontWeight: "700",
  },

  categoria: {
    fontSize: 13,
    marginTop: 3,
  },

  flecha: {
    fontSize: 32,
    fontWeight: "300",
  },

  separador: {
    height: 1,
    marginVertical: 14,
  },

  filaInferior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  label: {
    fontSize: 12,
    marginBottom: 4,
  },

  precio: {
    fontSize: 18,
    fontWeight: "700",
  },

  stockContainer: {
    alignItems: "flex-end",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  stockTexto: {
    fontSize: 12,
    fontWeight: "600",
  },
});