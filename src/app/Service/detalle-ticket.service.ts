import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleTicketDTO } from '../Interface/DetalleTicketDTO';
import { map, Observable } from 'rxjs';
import { Result } from '../Interface/Result';
import { TicketDTO } from '../Interface/TicketDTO';

@Injectable({
  providedIn: 'root'
})
export class DetalleTicketService {

  private url = "http://localhost:8081/api/detalle";

  constructor(private http: HttpClient) { }

  agregarDetalle(ticket: TicketDTO): Observable<TicketDTO> {
    return this.http.post<Result<TicketDTO>>(this.url, ticket).pipe(
      map(response => response.object)
    );
  }

  detallesByTicket(idTicket: number): Observable<DetalleTicketDTO[]> {
    return this.http.get<Result<DetalleTicketDTO[]>>(`${this.url}/detalleTickets/${idTicket}`).pipe(
      map(response => response.object)
    );
  }

  deleteDetallesByTicket(idTicket: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminarDetalleTicket/${idTicket}`);
  }
}
