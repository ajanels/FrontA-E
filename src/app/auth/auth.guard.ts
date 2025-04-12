import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // console.log("✅ Usuario autenticado, acceso permitido.");
      return true;
    } else {
      console.log("❌ No hay sesión activa, redirigiendo a /login.");
      this.router.navigate(['/login']);
      return false;
    }
}
}
