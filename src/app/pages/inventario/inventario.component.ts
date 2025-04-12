import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  titulo = 'Inventario';
  productos: any[] = [];
  productosFiltrados: any[] = [];
  productoSeleccionado: any = null;
  modeloProducto: any = {
    productoNombre: '',
    productoDescripcion: '',
    productoFecIngreso: '',
    productoFecVencimiento: '',
    productoStock: 0,
    productoPrecio: 0,
    productoImg: '',
    catProductoId: null,
  };
  busqueda: string = '';
  categoriaSeleccionada: number | null = null;
  mostrarModal: boolean = false;
  mostrarModalProducto: boolean = false;

  private apiUrl = 'https://localhost:7282/api/productos';

  categorias: any[] = [];
  categoriaSeleccionadaParaCRUD: any = null;
  mostrarModalCategoria = false;
  accionCategoria: 'crear' | 'editar' | 'eliminar' | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  obtenerProductos() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.productos = data.map((p) => ({
          id: p.productoId,
          nombre: p.productoNombre,
          descripcion: p.productoDescripcion,
          precio: p.productoPrecio,
          stock: p.productoStock,
          imagen: p.productoImg,
          catProductoId: p.catProductoId,
        }));
        this.aplicarFiltros();
      },
      (error) => {
        console.error('Error al obtener los productos:', error);
      }
    );
  }

  eliminarProducto(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(
      () => {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.aplicarFiltros();
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }

  buscarProductos() {
    this.aplicarFiltros();
  }

  manejarImagen(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.modeloProducto.productoImg = reader.result as string; // Guardar la URL base64
    };
    reader.readAsDataURL(file);
  }

  abrirModalCrear() {
    this.productoSeleccionado = null; // Limpia cualquier producto seleccionado
    this.modeloProducto = {
      productoNombre: '',
      productoDescripcion: '',
      productoFecIngreso: new Date().toISOString(), // Fecha actual
      productoFecVencimiento: new Date().toISOString(), // Fecha actual
      productoStock: 0,
      productoPrecio: 0,
      productoImg: '',
      catProductoId: null,
    };
    this.mostrarModal = true; // Muestra el modal
  }

  abrirModalEditar(producto: any) {
    this.productoSeleccionado = producto;
    this.modeloProducto = {
      productoNombre: producto.nombre,
      productoDescripcion: producto.descripcion,
      productoFecIngreso: producto.fecIngreso || new Date().toISOString(),
      productoFecVencimiento:
        producto.fecVencimiento || new Date().toISOString(),
      productoStock: producto.stock,
      productoPrecio: producto.precio,
      productoImg: producto.imagen,
      catProductoId: producto.catProductoId,
    };

    this.mostrarModal = true; // Muestra el modal
  }

  // guardarProducto() {
  //   console.log('Datos enviados al backend:', this.modeloProducto);

  //   if (this.productoSeleccionado) {
  //     const productoParaActualizar = {
  //       productoId: this.productoSeleccionado.id, // 👈 esto es crucial
  //       ...this.modeloProducto,
  //     };

  //     this.http
  //       .put(
  //         `${this.apiUrl}/${this.productoSeleccionado.id}`,
  //         productoParaActualizar
  //       )
  //       .subscribe(
  //         () => {
  //           const index = this.productos.findIndex(
  //             (p) => p.id === this.productoSeleccionado.id
  //           );

  //           if (index !== -1) {
  //             this.productos[index] = {
  //               id: this.productoSeleccionado.id,
  //               nombre: this.modeloProducto.productoNombre,
  //               descripcion: this.modeloProducto.productoDescripcion,
  //               precio: this.modeloProducto.productoPrecio,
  //               stock: this.modeloProducto.productoStock,
  //               imagen: this.modeloProducto.productoImg,
  //               catProductoId: this.modeloProducto.catProductoId,
  //             };
  //           }
            
  //           this.aplicarFiltros();
  //           this.cerrarModal();
  //         },
  //         (error) => {
  //           console.error('Error al actualizar el producto:', error);
  //           console.error('Detalles del error:', error.error);
  //         }
  //       );
  //   } else {
  //     // Crear producto
  //     this.http
  //       .post('https://localhost:7282/api/Productos', this.modeloProducto)
  //       .subscribe(
  //         (data: any) => {
  //           const nuevoProducto = {
  //             id: data.productoId,
  //             nombre: data.productoNombre,
  //             descripcion: data.productoDescripcion,
  //             precio: data.productoPrecio,
  //             stock: data.productoStock,
  //             imagen: data.productoImg,
  //             catProductoId: data.catProductoId,
  //           };
  //           this.productos.push(nuevoProducto);

  //           this.aplicarFiltros();
  //           this.cerrarModal();
  //         },
  //         (error) => {
  //           console.error('Error al crear el producto:', error);
  //           if (error.error?.errors)
  //             console.error('Errores de validación:', error.error.errors);
  //         }
  //       );
  //   }
  // }
  guardarProducto() {
    console.log('Datos enviados al backend:', this.modeloProducto);
  
    if (this.productoSeleccionado) {
      const productoParaActualizar = {
        productoId: this.productoSeleccionado.id,
        ...this.modeloProducto,
      };
  
      this.http
        .put(
          `${this.apiUrl}/${this.productoSeleccionado.id}`,
          productoParaActualizar
        )
        .subscribe(
          () => {
            this.obtenerProductos(); // ✅ Recargar desde el backend
            this.aplicarFiltros();
            this.cerrarModal();
          },
          (error) => {
            console.error('Error al actualizar el producto:', error);
            console.error('Detalles del error:', error.error);
          }
        );
    } else {
      this.http
        .post('https://localhost:7282/api/Productos', this.modeloProducto)
        .subscribe(
          () => {
            this.obtenerProductos(); // ✅ Recargar desde el backend
            this.aplicarFiltros();
            this.cerrarModal();
          },
          (error) => {
            console.error('Error al crear el producto:', error);
            if (error.error?.errors)
              console.error('Errores de validación:', error.error.errors);
          }
        );
    }
  }

  
  cerrarModal() {
    this.mostrarModal = false;
    this.resetearInputImagen(); // 👈 agregar esta línea
    this.modeloProducto = {
      productoNombre: '',
      productoDescripcion: '',
      productoFecIngreso: '',
      productoFecVencimiento: '',
      productoStock: 0,
      productoPrecio: 0,
      productoImg: '',
      catProductoId: null,
    };
    this.productoSeleccionado = null;
  }

  resetearInputImagen() {
    const input: any = document.querySelector('input[type="file"]');
    if (input) input.value = '';
  }

  aplicarFiltros() {
    this.productosFiltrados = this.productos.filter((p) => {
      const coincideBusqueda = this.busqueda
        ? p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
        : true;
      const coincideCategoria =
        this.categoriaSeleccionada != null
          ? p.catProductoId === this.categoriaSeleccionada
          : true;
      return coincideBusqueda && coincideCategoria;
    });
  }

  abrirModalCategorias() {
    this.obtenerCategorias(); // Carga las categorías desde el backend
    this.categoriaSeleccionadaParaCRUD = {
      nombre: '',
      descripcion: '',
    }; // Inicializa con un objeto vacío
    this.mostrarModalCategoria = true; // Muestra el modal de categorías
  }

  obtenerCategorias() {
    this.http
      .get<any[]>('https://localhost:7282/api/CategoriaProductos')
      .subscribe(
        (data) => {
          this.categorias = data.map((c) => ({
            id: c.catProductoId,
            nombre: c.catProductoNombre,
            descripcion: c.catProductoDescripcion,
          }));
        },
        (error) => {
          console.error('Error al obtener las categorías:', error);
        }
      );
  }

  guardarCategoria() {
    console.log(
      'Datos enviados al backend:',
      this.categoriaSeleccionadaParaCRUD
    );

    if (
      !this.categoriaSeleccionadaParaCRUD.nombre ||
      this.categoriaSeleccionadaParaCRUD.nombre.length < 3
    ) {
      console.error(
        'El nombre de la categoría debe tener al menos 3 caracteres.'
      );
      return;
    }

    if (
      !this.categoriaSeleccionadaParaCRUD.descripcion ||
      this.categoriaSeleccionadaParaCRUD.descripcion.length < 3
    ) {
      console.error(
        'La descripción de la categoría debe tener al menos 3 caracteres.'
      );
      return;
    }

    // Construye el objeto con las claves exactas esperadas por el backend
    const categoriaParaEnviar: any = {
      catProductoNombre: this.categoriaSeleccionadaParaCRUD.nombre,
      catProductoDescripcion: this.categoriaSeleccionadaParaCRUD.descripcion,
    };

    if (this.categoriaSeleccionadaParaCRUD.id) {
      // Si estás editando, agrega el ID con la clave correcta
      categoriaParaEnviar.catProductoId = this.categoriaSeleccionadaParaCRUD.id;

      this.http
        .put(
          `https://localhost:7282/api/CategoriaProductos/${categoriaParaEnviar.catProductoId}`,
          categoriaParaEnviar
        )
        .subscribe(
          () => {
            this.obtenerCategorias();
            this.categoriaSeleccionadaParaCRUD = {
              nombre: '',
              descripcion: '',
            };
          },
          (error) => {
            console.error('Error al actualizar la categoría:', error);
            console.error('Detalles del error:', error.error);
          }
        );
    } else {
      // Crear nueva categoría
      this.http
        .post<any>(
          'https://localhost:7282/api/CategoriaProductos',
          categoriaParaEnviar
        )
        .subscribe(
          (data) => {
            this.categorias.push({
              id: data.catProductoId,
              nombre: data.catProductoNombre,
              descripcion: data.catProductoDescripcion,
            });
            this.categoriaSeleccionadaParaCRUD = {
              nombre: '',
              descripcion: '',
            };
          },
          (error) => {
            console.error('Error al crear la categoría:', error);
            console.error('Detalles del error:', error.error);
          }
        );
    }
  }

  editarCategoria(categoria: any) {
    this.categoriaSeleccionadaParaCRUD = {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    };
  }

  eliminarCategoria(id: number) {
    this.http
      .delete(`https://localhost:7282/api/CategoriaProductos/${id}`)
      .subscribe(
        () => {
          this.categorias = this.categorias.filter((c) => c.id !== id);
        },
        (error) => {
          console.error('Error al eliminar la categoría:', error);
        }
      );
  }

  cerrarModalCategorias() {
    this.mostrarModalCategoria = false; // Oculta el modal de categorías
    this.categoriaSeleccionadaParaCRUD = null; // Limpia la categoría seleccionada
  }
  getNombreCategoria(catId: number): string {
    const categoria = this.categorias.find((c) => c.id === catId);
    // console.log('ID recibido:', catId, 'Categoría encontrada:', categoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  }
}
