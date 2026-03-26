export interface TicketPagoDTO {
  idTicket: number;
  Pagosticket: {
    numeroPago: number;
    folio: number;
    monto: number;
    fechaCreacion: string;
  }[];
}