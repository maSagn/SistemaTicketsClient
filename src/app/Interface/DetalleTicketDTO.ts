import { ProductoModel } from "./ProductoModel";

export interface DetalleTicketDTO {
    idTicket?: number;
    cantidad: number;
    precioUnitario: number;
    totalLinea: number;
    //idProducto: number;
    //Producto?: { IdProducto: number };
    Producto: ProductoModel;

}