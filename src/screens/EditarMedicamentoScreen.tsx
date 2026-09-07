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

import { Medicamento } from "../types/Medicamento";
import { editarMedicamento } from "../services/medicamentosCrudService";
import { subirImagenCloudinary } from "../services/cloudinaryService";

type Props = {
  medicamento: Medicamento;
  onVolver: () => void;
};

export default function EditarMedicamentoScreen({
  medicamento,
  onVolver,
}: Props) {
  const { colors, dark } = useTheme();

  const [nombre, setNombre] = useState(
    medicamento.nombre
  );

  const [precio, setPrecio] = useState(
    medicamento.precio.toString()
  );

  const [stock, setStock] = useState(
    medicamento.stock.toString()
  );

  const [categoria, setCategoria] = useState(
    medicamento.categoria
  );

  const [laboratorio, setLaboratorio] = useState(
    medicamento.laboratorio
  );

  const [vencimiento, setVencimiento] = useState(
    medicamento.vencimiento
  );

  // Imagen que ya tenía el medicamento
  const [imagenActual, setImagenActual] = useState(
    medicamento.imagenUrl || ""
  );

  // Nueva imagen seleccionada o tomada con cámara
  const [imagenUri, setImagenUri] = useState<
    string | null
  >(null);

  const [guardando, setGuardando] =
    useState(false);

  const [estadoGuardado, setEstadoGuardado] =
    useState("");

  const [modalVisible, setModalVisible] =
    useState(false);

  const [exito, setExito] = useState(false);

  const [mensaje, setMensaje] = useState("");

  // ==============================
  // SELECCIONAR FOTO DE GALERÍA
  // ==============================

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
        const uri = resultado.assets[0].uri;

        setImagenUri(uri);

        console.log(
          "🖼️ Nueva imagen seleccionada:",
          uri
        );
      }
    } catch (error) {
      console.error(
        "❌ Error seleccionando imagen:",
        error
      );

      setExito(false);
      setMensaje(
        "No se pudo seleccionar la imagen."
      );
      setModalVisible(true);
    }
  };

  // ==============================
  // TOMAR FOTO CON CÁMARA
  // ==============================

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
        const uri = resultado.assets[0].uri;

        setImagenUri(uri);

        console.log(
          "📸 Nueva foto tomada:",
          uri
        );
      }
    } catch (error) {
      console.error(
        "❌ Error tomando foto:",
        error
      );

      setExito(false);
      setMensaje(
        "No se pudo tomar la fotografía."
      );
      setModalVisible(true);
    }
  };

  // ==============================
  // QUITAR FOTO
  // ==============================

  const quitarFoto = () => {
    setImagenUri(null);
    setImagenActual("");
  };

  // ==============================
  // VALIDAR
  // ==============================

  const validar = () => {
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
        "El stock debe ser un número entero."
      );
      setModalVisible(true);
      return false;
    }

    const formatoFecha =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoFecha.test(vencimiento)) {
      setExito(false);
      setMensaje(
        "Usa el formato YYYY-MM-DD para la fecha."
      );
      setModalVisible(true);
      return false;
    }

    return true;
  };

  // ==============================
  // GUARDAR CAMBIOS
  // ==============================

  const guardarCambios = async () => {
    if (!validar() || guardando) {
      return;
    }

    try {
      setGuardando(true);

      let imagenUrl = imagenActual;

      // Si seleccionó o tomó una nueva foto,
      // subirla primero a Cloudinary
      if (imagenUri) {
        setEstadoGuardado(
          "Subiendo nueva fotografía..."
        );

        imagenUrl =
          await subirImagenCloudinary(imagenUri);

        console.log(
          "🌐 Nueva URL Cloudinary:",
          imagenUrl
        );
      }

      setEstadoGuardado(
        "Actualizando medicamento..."
      );

      await editarMedicamento(
        medicamento.id,
        {
          nombre,
          precio: Number(precio),
          stock: Number(stock),
          categoria,
          laboratorio,
          vencimiento,
          imagenUrl,
        }
      );

      console.log(
        "✅ Medicamento actualizado correctamente"
      );

      setExito(true);

      setMensaje(
        imagenUri
          ? "Los datos y la fotografía se actualizaron correctamente."
          : "Los cambios se guardaron correctamente."
      );

      setModalVisible(true);
    } catch (error) {
      console.error(
        "❌ Error editando medicamento:",
        error
      );

      setExito(false);

      setMensaje(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el medicamento."
      );

      setModalVisible(true);
    } finally {
      setGuardando(false);
      setEstadoGuardado("");
    }
  };

  // ==============================
  // CERRAR MODAL
  // ==============================

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

  const imagenMostrar =
    imagenUri || imagenActual;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        contentContainerStyle={
          styles.container
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TÍTULO */}

        <Text
          style={[
            styles.titulo,
            {
              color: colors.text,
            },
          ]}
        >
          Editar medicamento
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
          Actualiza la información del producto
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
            {imagenMostrar ? (
              <Image
                source={{
                  uri: imagenMostrar,
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
                  Sin imagen
                </Text>
              </>
            )}
          </View>

          {/* BOTONES DE FOTO */}

          <View style={styles.botonesFotoFila}>
            <Pressable
              onPress={seleccionarFoto}
              disabled={guardando}
              style={[
                styles.botonFotoSecundario,
                {
                  borderColor:
                    colors.primary,
                  opacity: guardando
                    ? 0.7
                    : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.botonFotoSecundarioTexto,
                  {
                    color:
                      colors.primary,
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
                  backgroundColor:
                    colors.primary,
                  opacity: guardando
                    ? 0.7
                    : 1,
                },
              ]}
            >
              <Text
                style={
                  styles.botonFotoTexto
                }
              >
                📷 Cámara
              </Text>
            </Pressable>
          </View>

          {imagenMostrar && (
            <Pressable
              onPress={quitarFoto}
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

        {/* DATOS */}

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
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Amoxicilina 500 mg"
            placeholderTextColor={
              placeholderColor
            }
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
            value={precio}
            onChangeText={setPrecio}
            keyboardType="decimal-pad"
            placeholder="Ej. 25"
            placeholderTextColor={
              placeholderColor
            }
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
            value={stock}
            onChangeText={setStock}
            keyboardType="number-pad"
            placeholder="Ej. 20"
            placeholderTextColor={
              placeholderColor
            }
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
            value={categoria}
            onChangeText={setCategoria}
            placeholder="Ej. Antibiótico"
            placeholderTextColor={
              placeholderColor
            }
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
            value={laboratorio}
            onChangeText={setLaboratorio}
            placeholder="Ej. La Santé"
            placeholderTextColor={
              placeholderColor
            }
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
            value={vencimiento}
            onChangeText={setVencimiento}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={
              placeholderColor
            }
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
          onPress={guardarCambios}
          disabled={guardando}
          style={[
            styles.boton,
            {
              backgroundColor:
                colors.primary,
              opacity: guardando
                ? 0.7
                : 1,
            },
          ]}
        >
          {guardando ? (
            <View
              style={styles.guardandoFila}
            >
              <ActivityIndicator
                color="#FFFFFF"
              />

              <View>
                <Text
                  style={styles.botonTexto}
                >
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
            <Text
              style={styles.botonTexto}
            >
              💾 Guardar cambios
            </Text>
          )}
        </Pressable>

        {/* CANCELAR */}

        <Pressable
          onPress={onVolver}
          disabled={guardando}
          style={[
            styles.cancelar,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: "700",
            }}
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
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.border,
              },
            ]}
          >
            <Text
              style={styles.modalIcono}
            >
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
                ? "Medicamento actualizado"
                : "No se pudo actualizar"}
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

  titulo: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },

  subtitulo: {
    marginTop: 5,
    marginBottom: 22,
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
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 8,
  },

  ayuda: {
    fontSize: 12,
    marginTop: 2,
  },

  boton: {
    minHeight: 58,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 2,
  },

  botonTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  guardandoFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  estadoGuardado: {
    color: "#DBEAFE",
    fontSize: 11,
    marginTop: 2,
  },

  cancelar: {
    height: 54,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  modalFondo: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
  },

  modalIcono: {
    fontSize: 50,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },

  modalMensaje: {
    marginTop: 8,
    marginBottom: 22,
    textAlign: "center",
    lineHeight: 21,
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
    fontWeight: "800",
    fontSize: 16,
  },
});