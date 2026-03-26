import { Injectable } from '@angular/core';
import { CarritoItem } from '../Interface/CarritoItem';
import { BehaviorSubject } from 'rxjs';
import { ProductoModel } from '../Interface/ProductoModel';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: CarritoItem[] = [];

  private carritoSubject = new BehaviorSubject<CarritoItem[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor() { 
    this.CargarCarrito(); 
  }

  /* ===== Agregar ===== */
  agregar(producto: ProductoModel) {
    const item = this.carrito.find(p => p.producto.idProducto === producto.idProducto);

    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ producto, cantidad: 1});
    }

    this.actualizar();
  }

  /* ===== Eliminar ===== */
  eliminar(idProducto: number) {
    this.carrito = this.carrito.filter(p => p.producto.idProducto !== idProducto);
    this.actualizar();
  }

  /* ===== Vaciar ===== */
  vaciar() {
    this.carrito = [];
    this.actualizar();
  }

  /* ===== Total ===== */
  getTotal(): number {
    return this.carrito.reduce((total, item) => 
      total + (item.producto.precioUnitario * item.cantidad), 0);
  }

  /* ===== Cantidad total ===== */
  getCantidad(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  /* ===== Local storage ===== */
  private GuardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  private CargarCarrito() {
    const data = localStorage.getItem('carrito');
    if (data) {
      this.carrito = JSON.parse(data);
      this.carritoSubject.next(this.carrito);
    }
  }

  /* ===== Update ===== */
  private actualizar() {
    this.carritoSubject.next(this.carrito);
    this.GuardarCarrito();
  }
}
