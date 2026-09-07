import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { registrarMedicamento } from "../services/medicamentosCrudService";
import { subirImagenCloudinary } from "../services/cloudinaryService";

type Props = {
  onVolver: () => void;
};

export default function RegistrarMedicamentoScreen({
  onVolver,
}: Props) {
  const { colors, dark } = useTheme();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [laboratorio, setLaboratorio] = useState("");
  const [vencimiento, setVencimiento] = useState("");

  const [imagenUri, setImagenUri] = useState<string | null>(
    null
  );

  const [guardando, setGuardando] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [exito, setExito] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // =========================
  // SELECCIONAR FOTO GALERÍA
  // =========================

  const seleccionarFoto = async () => {
    try {
      const permiso =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permiso.granted) {
        setExito(false);
        setMensaje(
          "Necesitas permitir acceso a la galería para seleccionar una foto."
        );
        setModalVisible(true);
        return;
      }

      const resultado =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!resultado.canceled) {
        setImagenUri(resultado.assets[0].uri);

        console.log(
          "📷 Imagen seleccionada:",
          resultado.assets[0].uri
        );
      }
    } catch (error) {
      console.error(
        "❌ Error seleccionando imagen:",
        error
      );

      setExito(false);
      setMensaje("No se pudo seleccionar la imagen.");
      setModalVisible(true);
    }
  };

  // =========================
  // TOMAR FOTO CON CÁMARA
  // =========================

  const tomarFoto = async () => {
    try {
      const permiso =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permiso.granted) {
        setExito(false);
        setMensaje(
          "Necesitas permitir acceso a la cámara para tomar una foto."
        );
        setModalVisible(true);
        return;
      }

      const resultado =
        await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!resultado.canceled) {
        setImagenUri(resultado.assets[0].uri);

        console.log(
          "📸 Foto tomada:",
          resultado.assets[0].uri
        );
      }
    } catch (error) {
      console.error(
        "❌ Error tomando foto:",
        error
      );

      setExito(false);
      setMensaje("No se pudo tomar la fotografía.");
      setModalVisible(true);
    }
  };

  // =========================
  // VALIDAR
  // =========================

  const validarFormulario = () => {
    if (
      !nombre.trim() ||
      !precio.trim() ||
      !stock.trim() ||
      !categoria.trim() ||
      !laboratorio.trim() ||
      !vencimiento.trim()
    ) {
      setExito(false);
      setMensaje("Completa todos los campos.");
      setModalVisible(true);
      return false;
    }

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (
      Number.isNaN(precioNumero) ||
      precioNumero <= 0
    ) {
      setExito(false);
      setMensaje(
        "El precio debe ser mayor que 0."
      );
      setModalVisible(true);
      return false;
    }

    if (
      Number.isNaN(stockNumero) ||
      stockNumero < 0 ||
      !Number.isInteger(stockNumero)
    ) {
      setExito(false);
      setMensaje(
        "El stock debe ser un número entero válido."
      );
      setModalVisible(true);
      return false;
    }

    const formatoFecha =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(vencimiento)) {
      setExito(false);
      setMensaje(
        "La fecha debe tener formato YYYY-MM-DD. Ejemplo: 2028-06-30."
      );
      setModalVisible(true);
      return false;
    }

    return true;
  };

  // =========================
  // GUARDAR
  // =========================

  const guardarMedicamento = async () => {
    if (!validarFormulario() || guardando) {
      return;
    }

    try {
      setGuardando(true);

      let imagenUrl = "";

      if (imagenUri) {
        setEstadoGuardado(
          "Subiendo foto del medicamento..."
        );

        imagenUrl =
          await subirImagenCloudinary(imagenUri);

        console.log(
          "🌐 URL Cloudinary:",
          imagenUrl
        );
      }

      setEstadoGuardado(
        "Guardando medicamento..."
      );

      await registrarMedicamento({
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        categoria,
        laboratorio,
        vencimiento,
        imagenUrl,
      });

      console.log(
        "✅ Medicamento + imagen guardados correctamente"
      );

      setExito(true);

      setMensaje(
        imagenUrl
          ? "El medicamento y su fotografía se guardaron correctamente."
          : "El medicamento se guardó correctamente."
      );

      setModalVisible(true);
    } catch (error) {
      console.error(
        "❌ Error guardando medicamento:",
        error
      );

      setExito(false);

      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el medicamento."
      );

      setModalVisible(true);
    } finally {
      setGuardando(false);
      setEstadoGuardado("");
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);

    if (exito) {
      onVolver();
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  const placeholderColor = dark
    ? "#64748B"
    : "#94A3B8";

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* CABECERA */}

        <View
          style={[
            styles.icono,
            {
              backgroundColor: dark
                ? "#24456D"
                : "#DBEAFE",
            },
          ]}
        >
          <Text style={styles.iconoTexto}>
            💊
          </Text>
        </View>

        <Text
          style={[
            styles.titulo,
            {
              color: colors.text,
            },
          ]}
        >
          Registrar medicamento
        </Text>

        <Text
          style={[
            styles.subtitulo,
            {
              color: dark
                ? "#94A3B8"
                : "#64748B",
            },
          ]}
        >
          Agrega un nuevo producto al inventario
        </Text>

        {/* FOTO */}

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
            Foto del medicamento
          </Text>

          <Text
            style={[
              styles.descripcion,
              {
                color: dark
                  ? "#94A3B8"
                  : "#64748B",
              },
            ]}
          >
            Selecciona una foto de la galería o toma una nueva
          </Text>

          <View
            style={[
              styles.preview,
              {
                borderColor: colors.border,
                backgroundColor: dark
                  ? "#0F172A"
                  : "#F8FAFC",
              },
            ]}
          >
            {imagenUri ? (
              <Image
                source={{
                  uri: imagenUri,
                }}
                style={styles.imagen}
                resizeMode="contain"
              />
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 55,
                  }}
                >
                  💊
                </Text>

                <Text
                  style={[
                    styles.sinImagen,
                    {
                      color: dark
                        ? "#94A3B8"
                        : "#64748B",
                    },
                  ]}
                >
                  Sin imagen seleccionada
                </Text>
              </>
            )}
          </View>

          {/* BOTONES FOTO */}

          <View style={styles.botonesFotoFila}>
            <Pressable
              onPress={seleccionarFoto}
              disabled={guardando}
              style={[
                styles.botonFotoSecundario,
                {
                  borderColor: colors.primary,
                  opacity: guardando ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.botonFotoSecundarioTexto,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                🖼️ Galería
              </Text>
            </Pressable>

            <Pressable
              onPress={tomarFoto}
              disabled={guardando}
              style={[
                styles.botonFoto,
                {
                  backgroundColor: colors.primary,
                  opacity: guardando ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.botonFotoTexto}>
                📷 Cámara
              </Text>
            </Pressable>
          </View>

          {imagenUri && (
            <Pressable
              onPress={() =>
                setImagenUri(null)
              }
              disabled={guardando}
              style={styles.quitarFoto}
            >
              <Text
                style={{
                  color: "#EF4444",
                  fontWeight: "700",
                }}
              >
                ✕ Quitar foto
              </Text>
            </Pressable>
          )}
        </View>

        {/* FORMULARIO */}

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
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Nombre
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Ej. Amoxicilina 500 mg"
            placeholderTextColor={placeholderColor}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Precio
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Ej. 25"
            placeholderTextColor={placeholderColor}
            keyboardType="decimal-pad"
            value={precio}
            onChangeText={setPrecio}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Stock
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Ej. 20"
            placeholderTextColor={placeholderColor}
            keyboardType="number-pad"
            value={stock}
            onChangeText={setStock}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Categoría
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Ej. Antibiótico"
            placeholderTextColor={placeholderColor}
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Laboratorio
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="Ej. La Santé"
            placeholderTextColor={placeholderColor}
            value={laboratorio}
            onChangeText={setLaboratorio}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Fecha de vencimiento
          </Text>

          <TextInput
            style={inputStyle}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={placeholderColor}
            value={vencimiento}
            onChangeText={setVencimiento}
          />

          <Text
            style={[
              styles.ayuda,
              {
                color: dark
                  ? "#94A3B8"
                  : "#64748B",
              },
            ]}
          >
            Ejemplo: 2028-06-30
          </Text>
        </View>

        {/* GUARDAR */}

        <Pressable
          onPress={guardarMedicamento}
          disabled={guardando}
          style={[
            styles.botonGuardar,
            {
              backgroundColor: colors.primary,
              opacity: guardando ? 0.7 : 1,
            },
          ]}
        >
          {guardando ? (
            <View style={styles.guardandoFila}>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <View>
                <Text style={styles.botonTexto}>
                  Guardando...
                </Text>

                {estadoGuardado !== "" && (
                  <Text
                    style={
                      styles.estadoGuardado
                    }
                  >
                    {estadoGuardado}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <Text style={styles.botonTexto}>
              ＋ Registrar medicamento
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={onVolver}
          disabled={guardando}
          style={[
            styles.botonVolver,
            {
              borderColor: colors.border,
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
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>

      {/* MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={cerrarModal}
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
            <Text style={styles.modalIcono}>
              {exito ? "✅" : "⚠️"}
            </Text>

            <Text
              style={[
                styles.modalTitulo,
                {
                  color: colors.text,
                },
              ]}
            >
              {exito
                ? "Medicamento registrado"
                : "No se pudo registrar"}
            </Text>

            <Text
              style={[
                styles.modalMensaje,
                {
                  color: dark
                    ? "#94A3B8"
                    : "#64748B",
                },
              ]}
            >
              {mensaje}
            </Text>

            <Pressable
              onPress={cerrarModal}
              style={[
                styles.modalBoton,
                {
                  backgroundColor: colors.primary,
                },
              ]}
            >
              <Text
                style={
                  styles.modalBotonTexto
                }
              >
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
  },

  icono: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 15,
  },

  iconoTexto: {
    fontSize: 36,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
  },

  subtitulo: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },

  cardTitulo: {
    fontSize: 18,
    fontWeight: "800",
  },

  descripcion: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 15,
  },

  preview: {
    width: "100%",
    height: 220,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  imagen: {
    width: "100%",
    height: "100%",
  },

  sinImagen: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },

  botonesFotoFila: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  botonFoto: {
    flex: 1,
    height: 54,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  botonFotoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  botonFotoSecundario: {
    flex: 1,
    height: 54,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  botonFotoSecundarioTexto: {
    fontSize: 15,
    fontWeight: "800",
  },

  quitarFoto: {
    alignItems: "center",
    paddingVertical: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    marginBottom: 8,
  },

  ayuda: {
    fontSize: 12,
    marginTop: 2,
  },

  botonGuardar: {
    minHeight: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },

  botonTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  estadoGuardado: {
    color: "#DBEAFE",
    fontSize: 11,
    marginTop: 2,
  },

  guardandoFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  botonVolver: {
    marginTop: 12,
    height: 54,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  botonVolverTexto: {
    fontSize: 15,
    fontWeight: "700",
  },

  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    borderRadius: 25,
    borderWidth: 1,
    padding: 25,
    alignItems: "center",
  },

  modalIcono: {
    fontSize: 55,
    marginBottom: 15,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  modalMensaje: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },

  modalBoton: {
    width: "100%",
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBotonTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});