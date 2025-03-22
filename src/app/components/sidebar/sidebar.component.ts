import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule], // ❌ Aquí falta el `standalone: true`

})
export class SidebarComponent {
  menuExpandido = true; // El menú inicia expandido
  moduloActivo = 'principal';

  constructor(private router: Router) {}
    // ✅ Recuperar el estado del sidebar al iniciar

   
    ngOnInit() {
      this.menuExpandido = localStorage.getItem('sidebarState') !== 'collapsed';
    }

      toggleMenu() {
    this.menuExpandido = !this.menuExpandido;
    localStorage.setItem('sidebarState', this.menuExpandido ? 'expanded' : 'collapsed');
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }

    navigate(modulo: string) {
      this.moduloActivo = modulo;
      this.router.navigate([modulo]);
    }

  

  logout() {
    localStorage.removeItem('token'); // ✅ Eliminar el token de sesión
    this.router.navigate(['/login']); // ✅ Redirigir al login
  }
}
