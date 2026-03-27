import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductosComponent } from './Components/productos/productos.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductoFormComponent } from './Components/producto-form/producto-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TicketsComponent } from './Components/tickets/tickets.component';
import { CommonModule } from '@angular/common';
import { DetalleTicketComponent } from './Components/detalle-ticket/detalle-ticket.component';
import { PagosComponent } from './Components/pagos/pagos.component';
import { LoginComponent } from './Components/login/login.component';
import { authInterceptor } from './Service/auth.interceptor';
import { AccessDeniedComponent } from './Components/access-denied/access-denied.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductosComponent,
    ProductoFormComponent,
    TicketsComponent,
    DetalleTicketComponent,
    PagosComponent,
    LoginComponent,
    AccessDeniedComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  providers: [
    // Interceptor
    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
