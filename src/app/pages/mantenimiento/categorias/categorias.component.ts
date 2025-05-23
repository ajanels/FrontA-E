import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
standalone: true,
imports: [CommonModule, FormsModule], // 👈 Importar aquí
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  nuevaCategoria = {
    catProductoNombre: '',
    catProductoDescripcion: ''
  };

  constructor(private http: HttpClient) {}

  

  ngOnInit() {
    this.obtenerCategorias();
  }

  mostrarModalEdicion = false;
categoriaSeleccionada: any = {};


  obtenerCategorias() {
    this.http.get<any[]>('https://localhost:7282/api/CategoriaProductos').subscribe(
      data => this.categorias = data,
      error => console.error('Error al cargar las categorías', error)
    );
  }

  guardarCategoria() {
    this.http.post('https://localhost:7282/api/CategoriaProductos', this.nuevaCategoria).subscribe(
      () => {
        this.nuevaCategoria = { catProductoNombre: '', catProductoDescripcion: '' };
        this.obtenerCategorias();
      },
      error => console.error('Error al guardar la categoría', error)
    );
  }

eliminarCategoria(id: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¡No podrás revertir esta acción!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si confirma, hacemos la eliminación
      this.http.delete(`https://localhost:7282/api/CategoriaProductos/${id}`)
        .subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Categoría eliminada correctamente', 'success');
            this.obtenerCategorias();
          },
          error: err => {
            console.error('Error al eliminar', err);
            Swal.fire('Error', 'No se pudo eliminar la categoría', 'error');
          }
        });
    }
  });
}



  editarCategoria(categoria: any) {
    this.nuevaCategoria = { ...categoria };
    // Puedes agregar lógica para actualizar con PUT si lo deseas
  }




abrirModalEdicion(categoria: any) {
  this.categoriaSeleccionada = {
    catProductoId: categoria.catProductoId,
    catProductoNombre: categoria.catProductoNombre,
    catProductoDescripcion: categoria.catProductoDescripcion
  };
  this.mostrarModalEdicion = true;
}





cerrarModal() {
  this.mostrarModalEdicion = false;
}

guardarEdicion() {
  console.log('Guardando edición:', this.categoriaSeleccionada);  // 👈 Verifica que esto se imprima
  const id = this.categoriaSeleccionada.catProductoId;
  if (!id) {
    console.error('ID inválido al guardar edición');
    return;
  }

  this.http.put(`https://localhost:7282/api/CategoriaProductos/${id}`, this.categoriaSeleccionada)
    .subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Categoría actualizada con éxito', 'success');
        this.obtenerCategorias();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      }
    });
}



}
