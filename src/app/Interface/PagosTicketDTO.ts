import { TicketDTO } from "./TicketDTO";

export interface PagosTicketDTO {
    idPago?: number;
    numeroPago: number;
    folio: number;
    monto: number;
    fechaCreacion: string;
    Ticket?: TicketDTO
}