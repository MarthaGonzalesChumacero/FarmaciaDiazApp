import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";

import { Medicamento } from "../types/Medicamento";
import { escucharMedicamentos } from "../services/medicamentosService";

type Props = {
  onPress: () => void;
};

export default function AlertaCampana({
  onPress,
}: Props) {
  const [medicamentos, setMedicamentos] =
    useState<Medicamento[]>([]);

  useEffect(() => {
    let cancelar:
      | (() => void)
      | undefined;

    let activo = true;

    const iniciar = async () => {
      cancelar =
        await escucharMedicamentos(
          (datos) => {
            if (!activo) return;

            setMedicamentos(datos);
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

  const totalAlertas = useMemo(() => {
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);

    return medicamentos.filter(
      (medicamento) => {
        const stockBajo =
          medicamento.stock <= 10;

        let alertaVencimiento =
          false;

        if (medicamento.vencimiento) {
          const partes =
            medicamento.vencimiento.split(
              "-"
            );

          if (partes.length === 3) {
            const [
              anio,
              mes,
              dia,
            ] = partes.map(Number);

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

            const diferencia =
              vencimiento.getTime() -
              hoy.getTime();

            const dias =
              Math.round(
                diferencia /
                  (1000 *
                    60 *
                    60 *
                    24)
              );

            alertaVencimiento =
              dias <= 180;
          }
        }

        return (
          stockBajo ||
          alertaVencimiento
        );
      }
    ).length;
  }, [medicamentos]);

  return (
    <Pressable
      onPress={onPress}
      style={styles.boton}
    >
      <Text
        style={styles.campana}
      >
        🔔
      </Text>

      {totalAlertas > 0 && (
        <View
          style={styles.badge}
        >
          <Text
            style={
              styles.badgeTexto
            }
          >
            {totalAlertas > 99
              ? "99+"
              : totalAlertas}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    boton: {
      paddingHorizontal: 6,
      paddingVertical: 6,
      position: "relative",
    },

    campana: {
      fontSize: 22,
    },

    badge: {
      position: "absolute",
      top: 0,
      right: 0,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor:
        "#EF4444",
      justifyContent:
        "center",
      alignItems:
        "center",
      paddingHorizontal: 4,
    },

    badgeTexto: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "800",
    },
  });