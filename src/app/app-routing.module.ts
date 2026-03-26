import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './Components/productos/productos.component';
import { ProductoFormComponent } from './Components/producto-form/producto-form.component';
import { TicketsComponent } from './Components/tickets/tickets.component';
import { LoginComponent } from './Components/login/login.component';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: 'producto', component: ProductoFormComponent },
  { path: 'producto/:id', component: ProductoFormComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
