import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PagosTicketDTO } from '../../Interface/PagosTicketDTO';
import { PagosTicketService } from '../../Service/pagos-ticket.service';
import { TicketPagoDTO } from '../../Interface/TicketPagoDTO';
import { TicketService } from '../../Service/ticket.service';
import { TicketEstatusDTO } from '../../Interface/TicketEstatusDTO';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;
declare var bootstrap: any;

@Component({
  selector: 'app-pagos',
  standalone: false,
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent {
  @Input() idTicket!: number;
  pagosTicket: PagosTicketDTO[] = [];
  cargando: boolean = false;
  error: string = '';
  totalPendiente: number = 0;
  @Output() ticketLiquidado = new EventEmitter<void>();

  constructor(
    private pagosTicketService: PagosTicketService,
    private ticketService: TicketService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idTicket'] && this.idTicket) {
      this.cargarPagosTicket(this.idTicket);
    }
  }

  cargarPagosTicket(idTicket: number) {
    this.cargando = true;
    this.error = '';

    this.pagosTicketService.getPagosByTicket(idTicket).subscribe(
      (data: any) => {
        this.pagosTicket = data.map((p: any) => ({
          idPago: p.idPago,
          numeroPago: p.numeroPago,
          folio: p.folio,
          monto: p.monto,
          fechaCreacion: p.fechaCreacion,
          Ticket: p.ticketDTO
        }));

        // Calcular total pendiente
        const totalPagado = this.pagosTicket.reduce((acc, p) => acc + p.monto, 0);

        // Total ticket
        const totalTicket = this.pagosTicket[0]?.Ticket?.total || 0;

        this.totalPendiente = totalTicket - totalPagado;


        this.cargando = false;
        console.log("Pagos de ticket cargado", data);
      },
      error => {
        this.error = "Error al cargar los pagos del ticket.";
        this.cargando = false;
        console.log("Error al obtener los pagos del ticket", error);

      });
  }

  // realizarPago() {
  //   Swal.fire({
  //     title: 'Realizar abono',
  //     html: `
  //   <p>Total pendiente: <b>$${this.totalPendiente.toFixed(2)}</b></p>
  //   <input id="abono" type="number" class="swal2-input" placeholder="¿Cuánto deseas abonar?"  min="0" step="any">
  // `,
  //     showCancelButton: true,
  //     confirmButtonText: 'Pagar',
  //     cancelButtonText: 'Cancelar',
  //     didOpen: () => {
  //   // Enfocamos el input al abrir la alerta
  //   const inputEl = document.getElementById('abono') as HTMLInputElement;
  //   if (inputEl) inputEl.focus();
  // },
  //     preConfirm: () => {
  //       // Tomamos el valor del input
  //       const inputEl = document.getElementById('abono') as HTMLInputElement;
  //       const value = parseFloat(inputEl.value);

  //       if (isNaN(value) || value <= 0 || value > this.totalPendiente) {
  //         Swal.showValidationMessage(`Ingresa un monto válido (1 - ${this.totalPendiente})`);
  //         return;
  //       }

  //       return value; // este valor se pasa a then()
  //     }
  //   }).then((result: any) => {
  //     if (result.isConfirmed && result.value) {
  //       const abono = parseFloat(result.value);

  //       // Validacion para que no ingrese numeros invalidos
  //       if (abono <= 0 || abono > this.totalPendiente) {
  //         Swal.fire("Error", "El monto ingresado es inválido", "error");
  //         return;
  //       }

  //       // Preparar DTO de pago
  //       const ticketPago: TicketPagoDTO = {
  //         idTicket: this.idTicket,
  //         Pagosticket: [
  //           {
  //             numeroPago: this.pagosTicket.length + 1, // siguiente número de pago
  //             folio: Math.floor(100000000 + Math.random() * 900000000),
  //             monto: abono,
  //             fechaCreacion: new Date().toISOString()
  //           }
  //         ]
  //       };

  //       // Registrar pago
  //       this.pagosTicketService.registrarPago(ticketPago).subscribe({
  //         next: () => {
  //           Swal.fire("¡Abono registrado!", `Se registró un abono de ${abono}`, "success");
  //           this.cargarPagosTicket(this.idTicket); // refrescar tabla
  //         },
  //         error: () => {
  //           Swal.fire("Error", "No se pudo registrar el abono", "error");
  //         }
  //       });
  //     }
  //   });
  // }



  realizarPago() {
    // Cerrar modal de Bootstrap si está abierto
    const modalPagosEl = document.getElementById("pagosTicketModal");
    let bootstrapModal: any;
    if (modalPagosEl) {
      bootstrapModal = bootstrap.Modal.getInstance(modalPagosEl);
      if (bootstrapModal) bootstrapModal.hide();
    }

    // Abrir SweetAlert
    Swal.fire({
      title: 'Realizar abono',
      text: `Total pendiente: $${this.totalPendiente.toFixed(2)}`,
      input: 'number',
      inputAttributes: {
        min: '0',
        step: 'any'
      },
      showCancelButton: true,
      confirmButtonText: 'Pagar',
      cancelButtonText: 'Cancelar',
      preConfirm: (value: string | null) => {
        const abono = parseFloat(value as string);
        // Validacion para que no se ingresen valores invalidos
        if (isNaN(abono) || abono <= 0 || abono > this.totalPendiente) {
          Swal.showValidationMessage(`Ingresa un monto válido (1 - ${this.totalPendiente})`);
        }
        return abono;
      }
    }).then((result: any) => {
      if (result.isConfirmed && result.value) {
        const abono = result.value as number;

        const ticketPago: TicketPagoDTO = {
          idTicket: this.idTicket,
          Pagosticket: [
            {
              numeroPago: this.pagosTicket.length + 1,
              folio: Math.floor(100000000 + Math.random() * 900000000),
              monto: abono,
              fechaCreacion: new Date().toISOString()
            }
          ]
        };

        this.pagosTicketService.registrarPago(ticketPago).subscribe({
          next: () => {
            // Revisar si ya se liquidó el ticket
            const totalPagado = this.pagosTicket.reduce((acc, p) => acc + p.monto, 0) + abono;
            const totalTicket = this.pagosTicket[0]?.Ticket?.total || 0;
            const nuevoEstatus = totalPagado >= totalTicket ? 'PAGADO' : 'PENDIENTE';

            const ticketUpdate: TicketEstatusDTO = {
              estatus: nuevoEstatus
            };

            // Actualizar estatus del ticket en la BD
            this.ticketService.actualizarEstatusTicket(this.idTicket, ticketUpdate).subscribe({
              next: () => {
                Swal.fire("¡Abono registrado!", `Se registró un abono de $${abono}`, "success");
                this.cargarPagosTicket(this.idTicket);
                if (nuevoEstatus === 'PAGADO') {
                  this.ticketLiquidado.emit();
                }
                if (modalPagosEl && bootstrapModal) bootstrapModal.show();
              },
              error: () => {
                Swal.fire("Error", "No se pudo actualizar el estado del ticket", "error");
                if (modalPagosEl && bootstrapModal) bootstrapModal.show();
              }
            });
          },
          error: () => {
            Swal.fire("Error", "No se pudo registrar el abono", "error");
          }
        });
      } else {
        // Si canceló, reabrir modal
        if (modalPagosEl && bootstrapModal) bootstrapModal.show();
      }
    });
  }
}
