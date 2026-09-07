import React from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";

import {
  useTheme,
} from "@react-navigation/native";

type Props = {
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl?: string;
  onPress: () => void;
};

export default function MedicamentoCard({
  nombre,
  precio,
  stock,
  categoria,
  imagenUrl,
  onPress,
}: Props) {
  const { colors, dark } = useTheme();

  const stockBajo = stock <= 10;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: dark
            ? "#10253A"
            : "#F8FCFF",

          borderColor: dark
            ? "#24445F"
            : "#C9E2F5",
        },
      ]}
    >
      <View style={styles.superior}>
        {/* FOTO */}

        <View
          style={[
            styles.imagenContainer,
            {
              backgroundColor: dark
                ? "#193650"
                : "#E3F3FF",
            },
          ]}
        >
          {imagenUrl ? (
            <Image
              source={{
                uri: imagenUrl,
              }}
              style={styles.imagen}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emoji}>
              💊
            </Text>
          )}
        </View>

        {/* INFORMACIÓN */}

        <View style={styles.info}>
          <Text
            style={[
              styles.nombre,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={2}
          >
            {nombre}
          </Text>

          <View
            style={[
              styles.categoriaBadge,
              {
                backgroundColor: dark
                  ? "#26344A"
                  : "#EEE8FF",
              },
            ]}
          >
            <Text
              style={{
                color: dark
                  ? "#C4B5FD"
                  : "#6D4CC7",

                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {categoria}
            </Text>
          </View>
        </View>

        {/* FLECHA */}

        <View
          style={[
            styles.flechaBoton,
            {
              backgroundColor: dark
                ? "#183A57"
                : "#E2F2FF",
            },
          ]}
        >
          <Text
            style={[
              styles.flecha,
              {
                color: dark
                  ? "#7CC7FF"
                  : "#2684FF",
              },
            ]}
          >
            ›
          </Text>
        </View>
      </View>

      {/* SEPARADOR */}

      <View
        style={[
          styles.separador,
          {
            backgroundColor: dark
              ? "#24445F"
              : "#DFEDF7",
          },
        ]}
      />

      {/* INFORMACIÓN INFERIOR */}

      <View style={styles.inferior}>
        {/* PRECIO */}

        <View>
          <Text
            style={[
              styles.label,
              {
                color: dark
                  ? "#8FA8BE"
                  : "#68839A",
              },
            ]}
          >
            Precio
          </Text>

          <Text
            style={[
              styles.precio,
              {
                color: dark
                  ? "#7DD3FC"
                  : "#1574C4",
              },
            ]}
          >
            Bs {precio.toFixed(2)}
          </Text>
        </View>

        {/* STOCK */}

        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.label,
              {
                color: dark
                  ? "#8FA8BE"
                  : "#68839A",
              },
            ]}
          >
            Inventario
          </Text>

          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor:
                  stockBajo
                    ? dark
                      ? "#47252E"
                      : "#FFE5EA"
                    : dark
                    ? "#183D33"
                    : "#DFF7EC",

                borderColor:
                  stockBajo
                    ? dark
                      ? "#70404B"
                      : "#FFC5D0"
                    : dark
                    ? "#2F6657"
                    : "#BCE8D6",
              },
            ]}
          >
            <View
              style={[
                styles.punto,
                {
                  backgroundColor:
                    stockBajo
                      ? "#F0526E"
                      : "#27B987",
                },
              ]}
            />

            <Text
              style={[
                styles.stockTexto,
                {
                  color: stockBajo
                    ? dark
                      ? "#FFB5C0"
                      : "#C73855"
                    : dark
                    ? "#8EE0C2"
                    : "#16805E",
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

const styles =
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderRadius: 22,
      padding: 15,
      marginBottom: 14,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },

    superior: {
      flexDirection: "row",
      alignItems: "center",
    },

    imagenContainer: {
      width: 82,
      height: 82,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: 5,
    },

    imagen: {
      width: "100%",
      height: "100%",
    },

    emoji: {
      fontSize: 40,
    },

    info: {
      flex: 1,
      marginLeft: 14,
    },

    nombre: {
      fontSize: 19,
      fontWeight: "900",
      marginBottom: 7,
    },

    categoriaBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },

    flechaBoton: {
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 8,
    },

    flecha: {
      fontSize: 28,
      fontWeight: "600",
      lineHeight: 29,
    },

    separador: {
      height: 1,
      marginVertical: 14,
    },

    inferior: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-end",
    },

    label: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 4,
    },

    precio: {
      fontSize: 23,
      fontWeight: "900",
    },

    stockContainer: {
      alignItems: "flex-end",
    },

    stockBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 18,
      borderWidth: 1,
    },

    punto: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 7,
    },

    stockTexto: {
      fontSize: 12,
      fontWeight: "800",
    },
  });