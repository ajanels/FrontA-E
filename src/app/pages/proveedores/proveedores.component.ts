import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  filtrados: any[] = [];
  proveedor: any = {};
  modalAbierto = false;
  editando = false;
  busqueda = '';

  private apiUrl = 'https://localhost:7282/api/Proveedores';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.proveedores = data;
        this.filtrados = data;
      },
      error: err => console.error('Error al obtener proveedores', err)
    });
  }

  filtrar(): void {
    const filtro = this.busqueda.toLowerCase();
    this.filtrados = this.proveedores.filter(p =>
      p.proveedorNombre.toLowerCase().includes(filtro)
    );
  }

  abrirModal(edit = false, proveedorExistente?: any): void {
    this.modalAbierto = true;
    this.editando = edit;
    this.proveedor = edit && proveedorExistente ? { ...proveedorExistente } : {};
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.proveedor = {};
    this.editando = false;
  }

  guardar(): void {
    if (this.editando) {
      this.http.put(`${this.apiUrl}/${this.proveedor.proveedorId}`, this.proveedor).subscribe(() => {
        this.obtenerProveedores();
        this.cerrarModal();
      });
    } else {
      this.http.post(this.apiUrl, this.proveedor).subscribe(() => {
        this.obtenerProveedores();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.obtenerProveedores();
    });
  }
}
