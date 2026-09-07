import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { signInAnonymously } from "firebase/auth";

import { auth, db } from "../config/firebase";
import { Pedido } from "../types/Pedido";

export async function escucharPedidos(
  onDatos: (pedidos: Pedido[]) => void,
  onError?: (error: Error) => void
) {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const referencia = collection(db, "pedidos");

    const consulta = query(
      referencia,
      orderBy("creadoEn", "desc")
    );

    const cancelar = onSnapshot(
      consulta,
      (snapshot) => {
        const lista: Pedido[] = snapshot.docs.map(
          (documento) => {
            const data = documento.data();

            let creadoEn: Date | null = null;

            if (data.creadoEn instanceof Timestamp) {
              creadoEn = data.creadoEn.toDate();
            }

            return {
              id: documento.id,

              medicamentoId:
                data.medicamentoId ?? "",

              medicamentoNombre:
                data.medicamentoNombre ?? "",

              cantidad:
                Number(data.cantidad ?? 0),

              precioUnitario:
                Number(
                  data.precioUnitario ?? 0
                ),

              total:
                Number(data.total ?? 0),

              estado:
                data.estado ?? "pendiente",

              usuarioId:
                data.usuarioId ?? "",

              creadoEn,
            };
          }
        );

        console.log(
          `🛒 ${lista.length} pedidos recibidos`
        );

        onDatos(lista);
      },

      (error) => {
        console.error(
          "❌ Error leyendo pedidos:",
          error
        );

        if (onError) {
          onError(error);
        }
      }
    );

    return cancelar;
  } catch (error) {
    console.error(
      "❌ Error conectando pedidos:",
      error
    );

    if (onError && error instanceof Error) {
      onError(error);
    }

    return undefined;
  }
}