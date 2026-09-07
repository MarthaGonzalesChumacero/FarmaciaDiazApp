export type Pedido = {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: string;
  usuarioId: string;
  creadoEn?: Date | null;
};