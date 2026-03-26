import { DetalleTicketDTO } from "./DetalleTicketDTO";

export interface TicketDTO {
    idTicket?: number;
    folio: number;
    fechaCreacion: string;
    fechaPago?: string | null;
    total: number;
    estatus: string;
    Detalleticket?: DetalleTicketDTO[];
}