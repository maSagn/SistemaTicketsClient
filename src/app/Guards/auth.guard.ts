import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

export class authGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
        const token = localStorage.getItem('token');

        if (token) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
};
