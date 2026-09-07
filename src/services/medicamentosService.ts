import {
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";

import { auth, db } from "../config/firebase";
import { Medicamento } from "../types/Medicamento";

/**
 * Convierte el vencimiento de Firestore a texto YYYY-MM-DD.
 * Funciona tanto si Firestore tiene un string como un Timestamp.
 */
function normalizarVencimiento(valor: unknown): string {
  if (typeof valor === "string") {
    return valor;
  }

  if (valor instanceof Timestamp) {
    const fecha = valor.toDate();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }

  if (
    typeof valor === "object" &&
    valor !== null &&
    "toDate" in valor &&
    typeof (valor as { toDate?: unknown }).toDate === "function"
  ) {
    const fecha = (
      valor as {
        toDate: () => Date;
      }
    ).toDate();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  }

  return "";
}

/**
 * Escucha los medicamentos de Firestore en tiempo real.
 */
export async function escucharMedicamentos(
  onDatos: (medicamentos: Medicamento[]) => void,
  onError?: (error: Error) => void
) {
  try {
    // Necesario porque nuestras reglas requieren request.auth != null
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const referencia = collection(db, "medicamentos");

    const cancelarSuscripcion = onSnapshot(
      referencia,
      (snapshot) => {
        const lista: Medicamento[] = snapshot.docs
          .map((documento) => {
            const data = documento.data();

            return {
              id: documento.id,
              nombre: data.nombre ?? "",
              precio: Number(data.precio ?? 0),
              stock: Number(data.stock ?? 0),
              categoria: data.categoria ?? "",
              laboratorio: data.laboratorio ?? "",
              vencimiento: normalizarVencimiento(
                data.vencimiento
              ),
              imagenUrl: data.imagenUrl ?? "",
              activo: data.activo ?? true,
            };
          })
          .filter((medicamento) => medicamento.activo)
          .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );

        console.log(
          `🔥 ${lista.length} medicamentos recibidos desde Firestore`
        );

        onDatos(lista);
      },
      (error) => {
        console.error(
          "❌ Error leyendo medicamentos:",
          error
        );

        if (onError) {
          onError(error);
        }
      }
    );

    return cancelarSuscripcion;
  } catch (error) {
    console.error(
      "❌ Error conectando con Firestore:",
      error
    );

    if (onError && error instanceof Error) {
      onError(error);
    }

    return undefined;
  }
}