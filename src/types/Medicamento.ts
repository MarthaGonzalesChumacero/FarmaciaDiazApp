export type Medicamento = {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  laboratorio: string;
  vencimiento: string;
  imagenUrl: string;
  activo: boolean;
};