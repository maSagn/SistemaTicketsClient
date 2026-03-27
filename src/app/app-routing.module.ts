import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './Components/productos/productos.component';
import { ProductoFormComponent } from './Components/producto-form/producto-form.component';
import { TicketsComponent } from './Components/tickets/tickets.component';
import { LoginComponent } from './Components/login/login.component';
import { AccessDeniedComponent } from './Components/access-denied/access-denied.component';
import { authGuard } from './Guards/auth.guard';
import { functionalGuard } from './Guards/functional.guard';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'producto', component: ProductoFormComponent, canActivate: [authGuard] },
  { path: 'producto/:id', component: ProductoFormComponent, canActivate: [authGuard] },
  { path: 'tickets', component: TicketsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '403', component: AccessDeniedComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
