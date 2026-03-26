import { Component } from '@angular/core';
import { LoginRequest } from '../../Interface/LoginRequest';
import { AuthService } from '../../Service/auth.service';
import { Router } from '@angular/router';

// Sweet alert (solo cuando se usa CDN)
declare var Swal: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuario: LoginRequest = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login() {
    this.authService.login(this.usuario).subscribe({
      next: (token) => {
        localStorage.setItem('token', token); // Guardar token
        console.log("Token guardado: ", token);

        const role = this.authService.getRole();

        if (role === 'Administrador') {
          this.router.navigate(['productos']);
        } else if (role === 'Usuario') {
          this.router.navigate(['productos'])
        }
      },
      error: (err) => {
        console.log("Error de logueo", err);

        Swal.fire({
          title: "Error",
          text: err.error,
          icon: "error"
        });

      }
    });
  }
}
