import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TicketDTO } from '../Interface/TicketDTO';
import { Result } from '../Interface/Result';
import { TicketEstatusDTO } from '../Interface/TicketEstatusDTO';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private url = "http://localhost:8081/api/ticket";

  constructor(private http: HttpClient) { }

  getAll(): Observable<TicketDTO[]> {
    return this.http.get<Result<TicketDTO[]>>(this.url).pipe(
      map(response => response.object)
    );
  }

  registrarTicket(ticket: TicketDTO): Observable<TicketDTO> {
    return this.http.post<Result<TicketDTO>>(this.url, ticket).pipe(
      map(response => response.object)
    );
  }

  eliminarTicket(idTicket: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${idTicket}`);
  }

  actualizarEstatusTicket(idTicket: number, estatus: TicketEstatusDTO): Observable<void> {
  return this.http.patch<void>(`${this.url}/ActualizarEstatus/${idTicket}`, estatus);
}
}
