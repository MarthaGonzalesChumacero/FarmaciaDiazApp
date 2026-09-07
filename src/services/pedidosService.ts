import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { signInAnonymously } from "firebase/auth";

import {
  auth,
  db,
} from "../config/firebase";

import { Medicamento } from "../types/Medicamento";

export async function registrarPedido(
  medicamento: Medicamento,
  cantidad: number
) {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  const medicamentoRef = doc(
    db,
    "medicamentos",
    medicamento.id
  );

  const pedidoRef = doc(
    collection(db, "pedidos")
  );

  const movimientoRef = doc(
    collection(db, "movimientos")
  );

  let nuevoStockFinal = 0;

  await runTransaction(
    db,
    async (transaction) => {
      const medicamentoSnapshot =
        await transaction.get(
          medicamentoRef
        );

      if (
        !medicamentoSnapshot.exists()
      ) {
        throw new Error(
          "El medicamento ya no existe."
        );
      }

      const datos =
        medicamentoSnapshot.data();

      const stockActual = Number(
        datos.stock ?? 0
      );

      if (cantidad <= 0) {
        throw new Error(
          "La cantidad no es válida."
        );
      }

      if (
        stockActual < cantidad
      ) {
        throw new Error(
          `Solo quedan ${stockActual} unidades disponibles.`
        );
      }

      const nuevoStock =
        stockActual - cantidad;

      nuevoStockFinal =
        nuevoStock;

      // ACTUALIZAR STOCK
      transaction.update(
        medicamentoRef,
        {
          stock:
            nuevoStock,

          actualizadoEn:
            serverTimestamp(),
        }
      );

      // CREAR PEDIDO
      transaction.set(
        pedidoRef,
        {
          medicamentoId:
            medicamento.id,

          medicamentoNombre:
            medicamento.nombre,

          cantidad,

          precioUnitario:
            medicamento.precio,

          total:
            medicamento.precio *
            cantidad,

          estado:
            "pendiente",

          creadoEn:
            serverTimestamp(),

          usuarioId:
            auth.currentUser?.uid ??
            null,
        }
      );

      // REGISTRAR MOVIMIENTO
      transaction.set(
        movimientoRef,
        {
          medicamentoId:
            medicamento.id,

          medicamentoNombre:
            medicamento.nombre,

          tipo:
            "salida",

          cantidad,

          motivo:
            "Pedido",

          stockAnterior:
            stockActual,

          stockNuevo:
            nuevoStock,

          pedidoId:
            pedidoRef.id,

          creadoEn:
            serverTimestamp(),

          usuarioId:
            auth.currentUser?.uid ??
            null,
        }
      );
    }
  );

  return {
    pedidoId:
      pedidoRef.id,

    movimientoId:
      movimientoRef.id,

    nuevoStock:
      nuevoStockFinal,
  };
}