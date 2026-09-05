import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";

import MedicamentoCard from "../components/MedicamentoCard";
import { medicamentos } from "../data/medicamentos";

type Medicamento = (typeof medicamentos)[0];

type Props = {
  onSeleccionar: (medicamento: Medicamento) => void;
};

export default function MedicamentosScreen({
  onSeleccionar,
}: Props) {
  const { colors, dark } = useTheme();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todos");

  const categorias = useMemo(() => {
    const categoriasUnicas = Array.from(
      new Set(medicamentos.map((item) => item.categoria))
    );

    return ["Todos", ...categoriasUnicas];
  }, []);

  const medicamentosFiltrados = useMemo(() => {
    return medicamentos.filter((medicamento) => {
      const coincideBusqueda = medicamento.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaSeleccionada === "Todos" ||
        medicamento.categoria === categoriaSeleccionada;

      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, categoriaSeleccionada]);

  const totalMedicamentos = medicamentos.length;

  const stockBajo = medicamentos.filter(
    (medicamento) => medicamento.stock <= 10
  ).length;

  const totalCategorias = new Set(
    medicamentos.map((medicamento) => medicamento.categoria)
  ).size;

  return (
    <FlatList
      data={medicamentosFiltrados}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[
        styles.lista,
        {
          backgroundColor: colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {/* BIENVENIDA */}
          <View style={styles.encabezado}>
            <View>
              <Text
                style={[
                  styles.saludo,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
                  },
                ]}
              >
                Gestión móvil
              </Text>

              <Text
                style={[
                  styles.titulo,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Inventario de medicamentos
              </Text>
            </View>

            <View
              style={[
                styles.logo,
                {
                  backgroundColor: dark ? "#1E3A5F" : "#DBEAFE",
                },
              ]}
            >
              <Text style={styles.logoTexto}>💊</Text>
            </View>
          </View>

          {/* ESTADÍSTICAS */}
          <View style={styles.estadisticas}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={styles.statIcon}>📦</Text>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {totalMedicamentos}
              </Text>

              <Text
                style={[
                  styles.statTexto,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
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
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={styles.statIcon}>⚠️</Text>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: stockBajo > 0 ? "#EF4444" : colors.text,
                  },
                ]}
              >
                {stockBajo}
              </Text>

              <Text
                style={[
                  styles.statTexto,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
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
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={styles.statIcon}>🏷️</Text>

              <Text
                style={[
                  styles.statNumero,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {totalCategorias}
              </Text>

              <Text
                style={[
                  styles.statTexto,
                  {
                    color: dark ? "#94A3B8" : "#64748B",
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
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.lupa}>🔎</Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                },
              ]}
              placeholder="Buscar medicamento..."
              placeholderTextColor={dark ? "#64748B" : "#94A3B8"}
              value={busqueda}
              onChangeText={setBusqueda}
            />

            {busqueda.length > 0 && (
              <Pressable
                onPress={() => setBusqueda("")}
                style={styles.borrarBusqueda}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                  }}
                >
                  ✕
                </Text>
              </Pressable>
            )}
          </View>

          {/* FILTROS */}
          <Text
            style={[
              styles.seccionTitulo,
              {
                color: colors.text,
              },
            ]}
          >
            Categorías
          </Text>

          <FlatList
            horizontal
            data={categorias}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtros}
            renderItem={({ item }) => {
              const seleccionado =
                categoriaSeleccionada === item;

              return (
                <Pressable
                  onPress={() =>
                    setCategoriaSeleccionada(item)
                  }
                  style={[
                    styles.filtro,
                    {
                      backgroundColor: seleccionado
                        ? colors.primary
                        : colors.card,
                      borderColor: seleccionado
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filtroTexto,
                      {
                        color: seleccionado
                          ? "#FFFFFF"
                          : colors.text,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />

          <View style={styles.productosHeader}>
            <Text
              style={[
                styles.seccionTitulo,
                {
                  color: colors.text,
                },
              ]}
            >
              Medicamentos
            </Text>

            <Text
              style={{
                color: dark ? "#94A3B8" : "#64748B",
              }}
            >
              {medicamentosFiltrados.length} encontrados
            </Text>
          </View>
        </>
      }
      renderItem={({ item }) => (
        <MedicamentoCard
          nombre={item.nombre}
          precio={item.precio}
          stock={item.stock}
          categoria={item.categoria}
          onPress={() => onSeleccionar(item)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.vacio}>
          <Text style={styles.vacioIcon}>🔍</Text>

          <Text
            style={[
              styles.vacioTitulo,
              {
                color: colors.text,
              },
            ]}
          >
            Sin resultados
          </Text>

          <Text
            style={{
              color: dark ? "#94A3B8" : "#64748B",
            }}
          >
            No encontramos medicamentos con ese criterio.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  saludo: {
    fontSize: 13,
    marginBottom: 4,
  },

  titulo: {
    fontSize: 23,
    fontWeight: "800",
    maxWidth: 260,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  logoTexto: {
    fontSize: 27,
  },

  estadisticas: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 10,
  },

  statIcon: {
    fontSize: 18,
    marginBottom: 6,
  },

  statNumero: {
    fontSize: 22,
    fontWeight: "800",
  },

  statTexto: {
    fontSize: 11,
    marginTop: 2,
  },

  buscador: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 22,
  },

  lupa: {
    fontSize: 18,
    marginRight: 9,
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  borrarBusqueda: {
    padding: 5,
  },

  seccionTitulo: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 11,
  },

  filtros: {
    gap: 8,
    paddingBottom: 22,
  },

  filtro: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 22,
    borderWidth: 1,
  },

  filtroTexto: {
    fontSize: 13,
    fontWeight: "600",
  },

  productosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  vacio: {
    alignItems: "center",
    paddingVertical: 50,
  },

  vacioIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  vacioTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
});