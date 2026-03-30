import { Component } from '@angular/core';
import { TicketDTO } from '../../Interface/TicketDTO';
import { TicketService } from '../../Service/ticket.service';
import { DetalleTicketService } from '../../Service/detalle-ticket.service';
import { switchMap } from 'rxjs';
import { PagosTicketService } from '../../Service/pagos-ticket.service';
import { AuthService } from '../../Service/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketEstatusDTO } from '../../Interface/TicketEstatusDTO';

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
  ticketForm!: FormGroup;

  constructor(
    private ticketService: TicketService,
    private detalleTicketService: DetalleTicketService,
    private pagosTicketService: PagosTicketService,
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarTickets();
    this.ticketForm = this.fb.group({
      estatus: ['']
    });
  }

  cargarTickets() {
    this.ticketService.getAll().subscribe(
      data => {

        console.log("Tickets cargados", data);
        if (this.authService.isAdmin()) {
          this.tickets = data;
        } else if (this.authService.isUser()) {
          const userId = this.authService.getUserId();
          this.tickets = data.filter(ticket => ticket.usuarioDTO?.idUsuario === userId);
        }
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

        this.pagosTicketService.deletePagosByTicket(idTicket).pipe(
          switchMap(() => this.detalleTicketService.deleteDetallesByTicket(idTicket)),
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

  filtrar() {
    const estatusValue = this.ticketForm.value.estatus;

  const ticket: TicketEstatusDTO | null = estatusValue ? { estatus: estatusValue } : {} as TicketEstatusDTO;

    this.ticketService.filtro(ticket).subscribe(
      data => {
        console.log("Tickets filtrados cargados", data);
        const userId = this.authService.getUserId();

        if (this.authService.isAdmin()) {
          this.tickets = data;
        } else if (this.authService.isUser()) {
          const userId = this.authService.getUserId();
          this.tickets = data.filter(ticket => ticket.usuarioDTO?.idUsuario === userId);
        }

        //this.tickets = data.filter(ticket => ticket.usuarioDTO?.idUsuario === userId);

      },
      error => {
        console.log("Error al obtener los tickets filtrados");

      }
    )
  }

  borrarFiltro() {
    this.ticketForm.reset({ estatus: '' });
  this.filtrar();
  }

  get filtroActivo(): boolean {
  return !!this.ticketForm.get('estatus')?.value;
}
}
