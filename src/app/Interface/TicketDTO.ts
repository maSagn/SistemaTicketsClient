import { DetalleTicketDTO } from "./DetalleTicketDTO";
import { UsuarioDTO } from "./UsuarioDTO";

export interface TicketDTO {
    idTicket?: number;
    folio: number;
    fechaCreacion: string;
    fechaPago?: string | null;
    total: number;
    estatus: string;
    Detalleticket?: DetalleTicketDTO[];
    Usuario?: UsuarioDTO; // Para crear el ticket
    usuarioDTO?: UsuarioDTO // Para cargar la lista
}