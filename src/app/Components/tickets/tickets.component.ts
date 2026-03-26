import { Component } from '@angular/core';
import { TicketDTO } from '../../Interface/TicketDTO';
import { TicketService } from '../../Service/ticket.service';
import { DetalleTicketService } from '../../Service/detalle-ticket.service';
import { switchMap } from 'rxjs';

declare var bootstrap: any;

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-tickets',
  standalone: false,
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent {

  tickets: TicketDTO[] = [];
  ticketSeleccionadoId!: number;

  constructor(
    private ticketService: TicketService,
    private detalleTicketService: DetalleTicketService
  ) { }

  ngOnInit(): void {
    this.cargarTickets();
  }

  cargarTickets() {
    this.ticketService.getAll().subscribe(
      data => {
        this.tickets = data;
        console.log("Tickets cargados", data);
      },
      error => {
        console.log("Error al obtener los tickets", error);

      });
  }

  verDetalle(idTicket: number) {
    console.log("Ticket seleccionado: ", idTicket);
    this.ticketSeleccionadoId = idTicket;

    // Abrir modal
    const modalDetalle = document.getElementById("detalleTicketModal");

    if (modalDetalle) {
      const modal = new bootstrap.Modal(modalDetalle);
      modal.show();
    }
  }

  verPagos(idTicket: number) {
    console.log("El ticket seleccionado es: ", idTicket);
    this.ticketSeleccionadoId = idTicket;

    // Abrir modal
    const modalPagos = document.getElementById("pagosTicketModal");

    if (modalPagos) {
      const modal = new bootstrap.Modal(modalPagos);
      modal.show();
    } 
  }

  eliminarTicket(idTicket: number) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir este proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, elimínalo!",
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {

        this.detalleTicketService.deleteDetallesByTicket(idTicket).pipe(
          switchMap(() => this.ticketService.eliminarTicket(idTicket))
        ).subscribe({
          next: () => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "El ticket ha sido eliminado correctamente.",
              icon: "success"
            });
            this.cargarTickets();
          },
          error: () => {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el ticket.",
              icon: "error"
            });
          }
        });

      }
    });
  }
}
