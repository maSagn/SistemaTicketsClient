import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../Interface/LoginRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = "http://localhost:8081/api/auth";

  constructor(
    private http: HttpClient,
    private route: Router
  ) { }

  login(usuario: LoginRequest): Observable<string> {
    return this.http.post(this.url, usuario, { responseType: 'text' });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodePayload(token: string): any | null {
    try {
      const payloadBase64 = token.split('.')[1];
      // Convertir base64url a base64 estándar
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando el token', error);
      return null;
    }
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.decodePayload(token);
      console.log("el payload es: ", payload);
      return payload?.role || null;
    } catch (error) {
      console.log('token invalido en el auth service');
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'Administrador';
  }

  isUser(): boolean {
    return this.getRole() === 'Usuario';
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodePayload(token);
    if (!payload || !payload.id) return null;

    return Number(payload.id);
  }
}
