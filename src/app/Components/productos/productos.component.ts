import { Component } from '@angular/core';
import { ProductoModel } from '../../Interface/ProductoModel';
import { ProductoService } from '../../Service/producto.service';
import { CarritoService } from '../../Service/carrito.service';
import { combineLatest, forkJoin, map, Observable, switchMap, take } from 'rxjs';
import { CarritoItem } from '../../Interface/CarritoItem';
import { TicketService } from '../../Service/ticket.service';
import { TicketDTO } from '../../Interface/TicketDTO';
import { DetalleTicketDTO } from '../../Interface/DetalleTicketDTO';
import { DetalleTicketService } from '../../Service/detalle-ticket.service';
import { PagosTicketService } from '../../Service/pagos-ticket.service';
import { TicketPagoDTO } from '../../Interface/TicketPagoDTO';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos: ProductoModel[] = [];
  totalItems$!: Observable<number>;
  mostrarCarrito = false;
  carrito$!: Observable<CarritoItem[]>;
  total$!: Observable<number>;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private ticketService: TicketService,
    private detalleTicketService: DetalleTicketService,
    private pagoTicketService: PagosTicketService) { }

  ngOnInit(): void {
    this.cargarProductos();

    // Carrito completo
    this.carrito$ = this.carritoService.carrito$;

    // Total de dinero
    this.total$ = this.carritoService.carrito$.pipe(
      map(items => items.reduce((acc, item) => acc + item.producto.precioUnitario * item.cantidad, 0))
    );

    // Cantidad total de productos agregados al carrito
    this.totalItems$ = this.carritoService.carrito$.pipe(
      map(items => items.reduce((acc, item) => acc + item.cantidad, 0))
    );
  }

  cargarProductos() {
    this.productoService.getAll().subscribe(
      data => {
        this.productos = data;
        console.log("Productos cargados", data);
      },
      error => {
        console.log("Error al obtener los productos", error);
      });
  }

  eliminar(idProducto: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir este proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, elimínalo!",
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {
        // Solo eliminar si confirmó
        this.productoService.delete(idProducto).subscribe(() => {
          Swal.fire({
            title: "¡Eliminado!",
            text: "El producto ha sido eliminado satisfactoriamente.",
            icon: "success"
            // timer: 2000
          });
          // Recargar lista después de eliminar
          this.cargarProductos();
        }, error => {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el producto.",
            icon: "error"
          });
        });
      }
    });
  }

  agregarAlCarrito(producto: ProductoModel) {
    this.carritoService.agregar(producto);

    Swal.fire({
      title: "Agregado",
      text: "Producto añadido al carrito",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Carrito desplegable
  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  // Eliminar un producto del carrito
  eliminarDelCarrito(idProducto: number) {
    this.carritoService.eliminar(idProducto);
  }

  // Vaciar carrito
  vaciarCarrito() {
    this.carritoService.vaciar();
  }

  /*finalizarCompra() {

    function generarFolio(): number {
      return Math.floor(100000000 + Math.random() * 900000000);
    }

    combineLatest([this.total$, this.carrito$]).pipe(
      take(1),
      switchMap(([totalValue, carritoItems]) => {

        if (!carritoItems || carritoItems.length === 0) {
          throw new Error("Carrito vacío");
        }

        // Crear ticket
        const ticket: TicketDTO = {
          folio: generarFolio(),
          fechaCreacion: new Date().toISOString(),
          fechaPago: new Date().toISOString(),
          total: totalValue,
          estatus: 'PAGADO',
          Detalleticket: []
        };

        return this.ticketService.registrarTicket(ticket).pipe(
          map(ticketCreado => ({ ticketCreado, carritoItems }))
        );
      }),
      switchMap(({ ticketCreado, carritoItems }) => {

        // Armamos el ticket con detalles
        const ticketConDetalles: TicketDTO = {
          idTicket: ticketCreado.idTicket,
          folio: ticketCreado.folio,
          fechaCreacion: ticketCreado.fechaCreacion,
          fechaPago: ticketCreado.fechaPago,
          total: ticketCreado.total,
          estatus: ticketCreado.estatus,
          Detalleticket: carritoItems.map(item => ({
            cantidad: item.cantidad,
            precioUnitario: item.producto.precioUnitario,
            totalLinea: item.producto.precioUnitario * item.cantidad,

            Producto: {
              idProducto: item.producto.idProducto,
              nombre: item.producto.nombre,
              precioUnitario: item.producto.precioUnitario,
              descripcion: item.producto.descripcion
            }
          }))
        };

        return this.detalleTicketService.agregarDetalle(ticketConDetalles);
      })
    ).subscribe({
      next: () => {
        this.carritoService.vaciar();

        Swal.fire({
          title: '¡Compra exitosa!',
          text: 'Tu compra ha sido registrada correctamente.',
          icon: 'success'
        });
      },
      error: (err) => {
        console.error(err);

        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al registrar la compra.',
          icon: 'error'
        });
      }
    });
  }*/






  registrarVenta() {
    combineLatest([this.total$, this.carrito$])
      .pipe(take(1))
      .subscribe(([totalValue, carritoItems]) => {

        if (!carritoItems || carritoItems.length === 0) {
          Swal.fire("Error", "Carrito vacío", "error");
          return;
        }

        Swal.fire({
          title: "Registrar pago",
          html: `
          <p>Total: <b>$${totalValue.toFixed(2)}</b></p>
          <input id="abono" type="number" class="swal2-input" placeholder="¿Cuánto deseas abonar?">
        `,
          confirmButtonText: "Pagar",
          showCancelButton: true,
          preConfirm: () => {
            const abono = (document.getElementById('abono') as HTMLInputElement).value;
            if (!abono || Number(abono) <= 0) {
              Swal.showValidationMessage("Ingresa un monto válido");
            }
            return Number(abono);
          }
        }).then((result: any) => {

          if (!result.isConfirmed) return;

          const abono = result.value;

          if (abono > totalValue) {
            Swal.fire("Error", "El abono no puede ser mayor al total", "error");
            return;
          }

          // LLamar la funcion procesar venta
          this.procesarVenta(totalValue, carritoItems, abono);
        });

      });
  }


  procesarVenta(totalValue: number, carritoItems: CarritoItem[], abono: number) {

    function generarFolio(): number {
      return Math.floor(100000000 + Math.random() * 900000000);
    }

    const estatus = abono >= totalValue ? 'PAGADO' : 'PENDIENTE';

    const ticket: TicketDTO = {
      folio: generarFolio(),
      fechaCreacion: new Date().toISOString(),
      fechaPago: estatus === 'PAGADO' ? new Date().toISOString() : null,
      total: totalValue,
      estatus: estatus,
      Detalleticket: []
    };

    this.ticketService.registrarTicket(ticket).pipe(

      switchMap(ticketCreado => {

        // DETALLES
        const ticketConDetalles: TicketDTO = {
          idTicket: ticketCreado.idTicket,
          folio: ticketCreado.folio,
          fechaCreacion: ticketCreado.fechaCreacion,
          fechaPago: ticketCreado.fechaPago,
          total: ticketCreado.total,
          estatus: ticketCreado.estatus,
          Detalleticket: carritoItems.map(item => ({
            cantidad: item.cantidad,
            precioUnitario: item.producto.precioUnitario,
            totalLinea: item.producto.precioUnitario * item.cantidad,
            Producto: {
              idProducto: item.producto.idProducto,  // datos completos del producto
              nombre: item.producto.nombre,
              precioUnitario: item.producto.precioUnitario,
              descripcion: item.producto.descripcion
            }
          }))
        };

        return this.detalleTicketService.agregarDetalle(ticketConDetalles).pipe(
          map(() => ticketCreado)
        );
      }),

      // REGISTRAR PAGO
      switchMap(ticketCreado => {

        const ticketPago: TicketPagoDTO = {
          idTicket: ticketCreado.idTicket!,
          Pagosticket: [
            {
              numeroPago: 1,
              folio: generarFolio(),
              monto: abono,
              fechaCreacion: new Date().toISOString()
            }
          ]
        };

        return this.pagoTicketService.registrarPago(ticketPago);
      })

    ).subscribe({
      next: () => {
        this.carritoService.vaciar();

        Swal.fire({
          title: 'Pago registrado',
          text: abono >= totalValue
            ? '¡Compra liquidada!'
            : 'Pago parcial registrado',
          icon: 'success'
        });
      },
      error: () => {
        Swal.fire("Error", "No se pudo registrar la venta", "error");
      }
    });
  }



}
