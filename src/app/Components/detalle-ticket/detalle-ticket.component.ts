import { Component, Input, SimpleChanges } from '@angular/core';
import { DetalleTicketDTO } from '../../Interface/DetalleTicketDTO';
import { DetalleTicketService } from '../../Service/detalle-ticket.service';

@Component({
  selector: 'app-detalle-ticket',
  standalone: false,
  templateUrl: './detalle-ticket.component.html',
  styleUrl: './detalle-ticket.component.css'
})
export class DetalleTicketComponent {

  @Input() idTicket!: number;
  detallesTicket: DetalleTicketDTO[] = [];
  cargando: boolean = false;
  error: string = '';

  constructor(
    private detalleTicketService: DetalleTicketService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idTicket'] && this.idTicket) {
      this.cargarDetalleTicket(this.idTicket);
    }
    
  }

  cargarDetalleTicket(idTicket: number) {
    this.cargando = true;
    this.error = '';

    this.detalleTicketService.detallesByTicket(idTicket).subscribe(
      (data: any) => {
        //this.detallesTicket = data;
        // Mapear cada detalle para que la propiedad Producto apunte al productoDTO del back
      this.detallesTicket = data.map((d:any) => ({
        idTicket: d.idTicket,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        totalLinea: d.totalLinea,
        Producto: d.productoDTO
      }));
        this.cargando = false;
        console.log("Detalle del ticket cargado", data);
      },
      error => {
        this.error = "Error al cargar los detalles del ticket.";
        this.cargando = false;
        console.log("Error al obtener el detalle del ticket", error);
        
      });
  }
}
