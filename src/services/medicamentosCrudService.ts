import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { signInAnonymously } from "firebase/auth";

import { auth, db } from "../config/firebase";

async function asegurarAutenticacion() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

export type DatosMedicamento = {
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  laboratorio: string;
  vencimiento: string;
  imagenUrl?: string;
};

// CREAR MEDICAMENTO
export async function registrarMedicamento(
  datos: DatosMedicamento
) {
  await asegurarAutenticacion();

  const referencia = await addDoc(
    collection(db, "medicamentos"),
    {
      nombre: datos.nombre.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      categoria: datos.categoria.trim(),
      laboratorio: datos.laboratorio.trim(),
      vencimiento: datos.vencimiento,
      imagenUrl: datos.imagenUrl ?? "",
      activo: true,
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
    }
  );

  console.log(
    "✅ Medicamento registrado:",
    referencia.id
  );

  return referencia.id;
}

// EDITAR MEDICAMENTO
export async function editarMedicamento(
  id: string,
  datos: DatosMedicamento
) {
  await asegurarAutenticacion();

  const referencia = doc(
    db,
    "medicamentos",
    id
  );

  await updateDoc(referencia, {
    nombre: datos.nombre.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    categoria: datos.categoria.trim(),
    laboratorio: datos.laboratorio.trim(),
    vencimiento: datos.vencimiento,
    imagenUrl: datos.imagenUrl ?? "",
    actualizadoEn: serverTimestamp(),
  });

  console.log(
    "✅ Medicamento actualizado:",
    id
  );
}

// ELIMINAR MEDICAMENTO
export async function eliminarMedicamento(
  id: string
) {
  await asegurarAutenticacion();

  const referencia = doc(
    db,
    "medicamentos",
    id
  );

  await deleteDoc(referencia);

  console.log(
    "🗑️ Medicamento eliminado:",
    id
  );
}