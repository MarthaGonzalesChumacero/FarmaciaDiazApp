import { File } from "expo-file-system";

const CLOUD_NAME = "v4p3yjqq";
const UPLOAD_PRESET = "farmacia_diaz";

export async function subirImagenCloudinary(
  uri: string
): Promise<string> {
  try {
    const archivo = new File(uri);

    const formData = new FormData();

    formData.append("file", archivo as any);
    formData.append("upload_preset", UPLOAD_PRESET);

    const respuesta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error(
        "❌ Error Cloudinary:",
        datos
      );

      throw new Error(
        datos?.error?.message ||
          "No se pudo subir la imagen."
      );
    }

    console.log(
      "✅ Imagen subida:",
      datos.secure_url
    );

    return datos.secure_url;
  } catch (error) {
    console.error(
      "❌ Error subiendo imagen:",
      error
    );

    throw error;
  }
}