import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { inject } from '@angular/core';

export const functionalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("Usuario:", authService.getRole());
  console.log("Es admin:", authService.isAdmin());

  if (authService.isAdmin()) {
    return true; // Permitir acceso
  } else {
    router.navigate(['/403']); // Redirigir a una página de error o home
    return false; // Bloquear acceso
  }
};
