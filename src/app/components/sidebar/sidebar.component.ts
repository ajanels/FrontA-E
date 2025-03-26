import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  menuExpandido = true;
  @Output() estadoSidebar = new EventEmitter<boolean>();
  
  // Declaramos la propiedad userName para mostrar el nombre del usuario en el header
  userName: string = 'Usuario';

  constructor(private router: Router) {}

  ngOnInit() {
    // Leer estado guardado en localStorage
    const storedState = localStorage.getItem('sidebarState');
    if (storedState) {
      this.menuExpandido = storedState === 'expanded';
    } else {
      this.menuExpandido = true;
    }
    // Emitir el estado inicial al componente padre
    this.estadoSidebar.emit(this.menuExpandido);
  }

  toggleMenu() {
    this.menuExpandido = !this.menuExpandido;
    localStorage.setItem('sidebarState', this.menuExpandido ? 'expanded' : 'collapsed');
    this.estadoSidebar.emit(this.menuExpandido);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
