import { ProductoModel } from "./ProductoModel";

export interface CarritoItem {
    producto: ProductoModel;
    cantidad: number;
}