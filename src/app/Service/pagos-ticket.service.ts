import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PagosTicketDTO } from '../Interface/PagosTicketDTO';
import { Result } from '../Interface/Result';
import { TicketDTO } from '../Interface/TicketDTO';
import { TicketPagoDTO } from '../Interface/TicketPagoDTO';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagosTicketService {

  private url = "http://" + environment.ipUrl + ":8081/api/pago";

  constructor(private http: HttpClient) { }

  getPagosByTicket(idTicket: number): Observable<PagosTicketDTO[]> {
    return this.http.get<Result<PagosTicketDTO[]>>(`${this.url}/pagos/${idTicket}`).pipe(
      map(response => response.object)
    );
  }

  registrarPago(ticketPago: TicketPagoDTO): Observable<TicketDTO> {
    return this.http.post<Result<TicketDTO>>(this.url, ticketPago).pipe(
      map(response => response.object)
    );
  }

  deletePagosByTicket(idTicket: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/eliminarPagosTicket/${idTicket}`);
  }
}
