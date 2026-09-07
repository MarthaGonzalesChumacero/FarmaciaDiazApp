import { signInAnonymously } from "firebase/auth";
import {
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

const medicamentosIniciales = [
  {
    id: "paracetamol-500mg",
    nombre: "Paracetamol 500 mg",
    precio: 10,
    stock: 20,
    categoria: "Analgésico",
    laboratorio: "INTI",
    vencimiento: "2027-12-20",
    imagenUrl: "",
    activo: true,
  },
  {
    id: "ibuprofeno-400mg",
    nombre: "Ibuprofeno 400 mg",
    precio: 15,
    stock: 12,
    categoria: "Antiinflamatorio",
    laboratorio: "INTI",
    vencimiento: "2027-08-15",
    imagenUrl: "",
    activo: true,
  },
  {
    id: "amoxicilina-500mg",
    nombre: "Amoxicilina 500 mg",
    precio: 25,
    stock: 8,
    categoria: "Antibiótico",
    laboratorio: "BAGO",
    vencimiento: "2027-05-10",
    imagenUrl: "",
    activo: true,
  },
  {
    id: "omeprazol-20mg",
    nombre: "Omeprazol 20 mg",
    precio: 18,
    stock: 15,
    categoria: "Gastrointestinal",
    laboratorio: "COFAR",
    vencimiento: "2028-01-25",
    imagenUrl: "",
    activo: true,
  },
  {
    id: "loratadina-10mg",
    nombre: "Loratadina 10 mg",
    precio: 12,
    stock: 6,
    categoria: "Antialérgico",
    laboratorio: "LAFAR",
    vencimiento: "2027-10-30",
    imagenUrl: "",
    activo: true,
  },
  {
    id: "diclofenaco-50mg",
    nombre: "Diclofenaco 50 mg",
    precio: 14,
    stock: 25,
    categoria: "Antiinflamatorio",
    laboratorio: "BAGO",
    vencimiento: "2028-03-18",
    imagenUrl: "",
    activo: true,
  },
];

export async function cargarMedicamentosIniciales() {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const batch = writeBatch(db);

    medicamentosIniciales.forEach((medicamento) => {
      const referencia = doc(
        db,
        "medicamentos",
        medicamento.id
      );

      batch.set(
        referencia,
        {
          nombre: medicamento.nombre,
          precio: medicamento.precio,
          stock: medicamento.stock,
          categoria: medicamento.categoria,
          laboratorio: medicamento.laboratorio,
          vencimiento: medicamento.vencimiento,
          imagenUrl: medicamento.imagenUrl,
          activo: medicamento.activo,
          actualizadoEn: serverTimestamp(),
          versionDatos: 3,
        },
        {
          merge: true,
        }
      );
    });

    await batch.commit();

    console.log(
      "✅ Medicamentos actualizados correctamente - versión 3"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Error actualizando medicamentos:",
      error
    );

    return false;
  }
}