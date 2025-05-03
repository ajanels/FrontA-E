import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService, Rol } from '../../../services/rol.service'; // Ajusta la ruta según corresponda
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConfiguracionesComponent implements OnInit {
  roles: Rol[] = [];
  newRole: Rol = { rolId: 0, rolNombre: '', activo: true };

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: data => {
        this.roles = data;
      },
      error: err => {
        Swal.fire('Error al cargar roles', err);
        Swal.fire('Error al cargar roles');
      }
    });
  }

  createRole(): void {
    if (!this.newRole.rolNombre.trim()) {
      Swal.fire('El nombre del rol es obligatorio.');
      return;
    }
    this.rolService.createRole(this.newRole).subscribe({
      next: (role) => {
        Swal.fire('Rol creado correctamente');
        this.newRole = { rolId: 0, rolNombre: '', activo: true };
        this.loadRoles();
      },
      error: err => {
        Swal.fire('Error al crear rol', err);
        Swal.fire('Error al crear rol');
      }
    });
  }

  // Método para alternar el estado activo de un rol (habilitar/deshabilitar)
  toggleRoleState(role: Rol): void {
    const updatedRole: Rol = { ...role, activo: !role.activo };
    this.rolService.updateRole(role.rolId, updatedRole).subscribe({
      next: () => {
        Swal.fire(`Rol ${updatedRole.activo ? 'habilitado' : 'deshabilitado'} correctamente`);
        this.loadRoles();
      },
      error: err => {
        Swal.fire('Error al actualizar rol', err);
        Swal.fire('Error al actualizar rol');
      }
    });
  }
}
