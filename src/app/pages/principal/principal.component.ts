import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PrincipalComponent {
  menuExpandido = false; // Estado del menú
  moduloActivo = ''; // Módulo seleccionado

  constructor(private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.menuExpandido = !this.menuExpandido;
  }

  navegar(modulo: string) {
    this.moduloActivo = modulo;
    this.router.navigate([`/${modulo}`]); // Redirige al módulo seleccionado
  }

  logout() {
    this.authService.logout(); // ✅ Borra el token en memoria
    this.router.navigate(['/login']); // ✅ Redirigir al login
  }
}
