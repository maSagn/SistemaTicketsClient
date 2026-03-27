import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from './Service/carrito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AngularTickets';
  isCollapsed = false;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('carrito');
    this.carritoService.vaciar();
    this.router.navigate(['/login']);
  }

  isLogin(): boolean {
    return this.router.url === '/login';
  }
}
