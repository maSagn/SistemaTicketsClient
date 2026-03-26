import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {

    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLogin(): boolean {
    return this.router.url === '/login';
  }
}
