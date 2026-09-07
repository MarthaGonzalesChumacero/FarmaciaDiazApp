import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";

type TipoMovimiento =
  | "entrada"
  | "salida"
  | "ajuste";

type RegistrarMovimientoParams = {
  medicamentoId: string;
  medicamentoNombre: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  stockAnterior: number;
  stockNuevo: number;
};

export async function registrarMovimiento({
  medicamentoId,
  medicamentoNombre,
  tipo,
  cantidad,
  motivo,
  stockAnterior,
  stockNuevo,
}: RegistrarMovimientoParams) {
  const movimientoRef = doc(
    collection(db, "movimientos")
  );

  await runTransaction(
    db,
    async (transaction) => {
      transaction.set(
        movimientoRef,
        {
          medicamentoId,
          medicamentoNombre,
          tipo,
          cantidad,
          motivo,
          stockAnterior,
          stockNuevo,
          creadoEn:
            serverTimestamp(),
        }
      );
    }
  );

  return {
    movimientoId:
      movimientoRef.id,
  };
}