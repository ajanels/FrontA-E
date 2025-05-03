import { Component, OnInit } from '@angular/core';
import { VentasService } from './ventas.service';
import { ProductosService } from '../inventario/inventario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  productos: any[] = [];
  ventas: any[] = [];
  productoSeleccionado: any = null;
  fechaVentaGenerada: string = '';
  usuarios: any[] = [];
  cantidadOriginal: number = 0;
  modoEdicion: boolean = false;
  ventaEnEdicionId: number | null = null;

  ventaSeleccionadaParaFactura: any = null;
  descripcionFactura: string = '';

  productoCantidad = 1; // o cualquier valor predeterminado
  //Carrito
  carritoVentas: any[] = []; // Nuevo array para almacenar las ventas en el carrito
  
  sidebarAbierto: boolean = false;
  totalCarrito: number = 0;
  usuarioSeleccionado: number | null = null; // Si el ID del usuario es un número, o null si no se ha seleccionado uno
  venta = {
    productoId: null,
    cantidad: 1,
  };

  botonGuardarDeshabilitado: boolean = false;

  nuevaVenta: any = {
    productoId: null,
    productoCantidad: null,
    ventaTotal: 0,
    usuId: null,
    descripcion: '', // <-- nuevo campo
  };

  totalVenta: number = 0;
  mensajeError: string = '';

  constructor(
    private ventasService: VentasService,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.productosService.getProductos().subscribe((data) => {
      this.productos = data;
    });

    this.ventasService.getUsuarios().subscribe((data) => {
      // console.log('Usuarios cargados:', data);
      this.usuarios = data;
    });

    this.obtenerVentas(); // lo llamas al iniciar

    this.dataProducts();
  }

  dataProducts() {
    this.ventasService.getVentas().subscribe((data: any[]) => {
      this.ventas = data.map((venta) => {
        const producto = this.productos.find(
          (p) => p.productoId === venta.productoId
        );
        return {
          ...venta,
          producto,
        };
      });
    });
  }

  actualizarProductoSeleccionado() {
    this.productoSeleccionado = this.productos.find(
      (p) => p.productoId === this.nuevaVenta.productoId
    );
    this.actualizarTotalVenta();
  }

  actualizarTotalVenta() {
    const cantidad = this.nuevaVenta.productoCantidad;

    if (!this.productoSeleccionado || !cantidad || cantidad <= 0) {
      this.nuevaVenta.ventaTotal = 0;
      this.mensajeError = '';
      this.botonGuardarDeshabilitado = true;
      return;
    }

    const precio = parseFloat(this.productoSeleccionado.productoPrecio);
    const stock = this.productoSeleccionado.productoStock;

    // Validación: stock agotado
    if (stock === 0) {
      this.mensajeError = 'Producto agotado. No se puede realizar la venta.';
      this.nuevaVenta.ventaTotal = 0;
      this.botonGuardarDeshabilitado = true;
      return;
    }

    // Validación: cantidad mayor al stock
    if (cantidad > stock) {
      this.mensajeError = 'Cantidad excede el stock disponible.';
      this.nuevaVenta.ventaTotal = 0;
      this.botonGuardarDeshabilitado = true;
      return;
    }

    this.nuevaVenta.ventaTotal = precio * cantidad;
    this.mensajeError = '';
    this.botonGuardarDeshabilitado = false;
  }

  calcularTotal() {
    if (this.productoSeleccionado && this.venta.cantidad) {
      const cantidad = this.venta.cantidad;

      if (cantidad > this.productoSeleccionado.productoStock) {
        this.mensajeError = 'Cantidad excede el stock disponible.';
        this.totalVenta = 0;
      } else {
        this.mensajeError = '';
        this.totalVenta = cantidad * this.productoSeleccionado.productoPrecio;
      }
    }
  }

  // guardarVenta() {
  //   const venta = {
  //     productoId: this.nuevaVenta.productoId,
  //     productoCantidad: this.nuevaVenta.productoCantidad,
  //     ventaTotal: this.nuevaVenta.ventaTotal,
  //     ventaFecha: new Date().toISOString(),
  //     usuId: this.nuevaVenta.usuId,
  //   };

  //   this.ventasService.createVenta(venta).subscribe(() => {
  //     alert('Venta guardada con éxito');
  //     this.obtenerVentas();
  //     this.resetFormulario();
  //   });
  // }
  guardarVenta() {
    const venta = {
      ventaId: this.ventaEnEdicionId,
      productoId: this.nuevaVenta.productoId,
      productoCantidad: this.nuevaVenta.productoCantidad,
      ventaTotal: this.nuevaVenta.ventaTotal,
      usuId: this.nuevaVenta.usuId,
      descripcion: this.nuevaVenta.descripcion,
      ventaFecha: new Date().toISOString(),
    };

    const producto = this.productos.find(
      (p) => p.productoId === venta.productoId
    );

    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }

    if (this.modoEdicion && this.ventaEnEdicionId !== null) {
      // 🧮 Calculamos diferencia entre nueva y original
      const diferencia = venta.productoCantidad - this.cantidadOriginal;

      // ⛔ Si la diferencia es positiva, hay que verificar stock disponible
      if (diferencia > 0 && diferencia > producto.productoStock) {
        this.mensajeError = 'Cantidad excede el stock disponible.';
        return;
      }

      // 🔄 Ajustamos el stock (puede sumar o restar según el signo)
      producto.productoStock -= diferencia;

      this.productosService.updateProducto(producto).subscribe(() => {
        console.log('Stock actualizado en edición');
      });

      this.ventasService.updateVenta(this.ventaEnEdicionId, venta).subscribe(
        () => {
          alert('Venta actualizada con éxito');
          this.obtenerVentas();
          this.resetFormulario();
        },
        (error) => {
          console.error('Error al actualizar la venta', error);
        }
      );
    } else {
      // 🆕 Nueva venta
      if (venta.productoCantidad > producto.productoStock) {
        this.mensajeError = 'Cantidad excede el stock disponible.';
        return;
      }

      producto.productoStock -= venta.productoCantidad;

      this.productosService.updateProducto(producto).subscribe(() => {
        console.log('Stock actualizado en nueva venta');
      });

      this.ventasService.createVenta(venta).subscribe(() => {
        alert('Venta guardada con éxito');
        this.obtenerVentas();
        this.resetFormulario();
      });
    }
  }

  editarVenta(venta: any) {
    this.nuevaVenta = {
      productoId: venta.productoId,
      productoCantidad: venta.productoCantidad,
      ventaTotal: venta.ventaTotal,
      usuId: venta.usuId,
      descripcion: venta.descripcion || '',
    };

    this.ventaEnEdicionId = venta.ventaId;
    this.cantidadOriginal = venta.productoCantidad; // <-- Aquí guardamos la cantidad original

    this.modoEdicion = true;
    this.productoSeleccionado = this.productos.find(
      (p) => p.productoId === venta.productoId
    );
    this.actualizarTotalVenta();
  }

  obtenerVentas() {
    this.ventasService.getVentas().subscribe((data: any[]) => {
      this.ventas = data.map((venta) => {
        const producto = this.productos.find(
          (p) => p.productoId === venta.productoId
        );
        return {
          ...venta,
          producto,
        };
      });
    });
  }

  resetFormulario() {
    this.nuevaVenta = {
      productoId: null,
      productoCantidad: 1,
      ventaTotal: 0,
      usuId: null,
      descripcion: '',
    };
    this.productoSeleccionado = null;
    this.mensajeError = '';
    this.botonGuardarDeshabilitado = true;
    this.modoEdicion = false;
    this.ventaEnEdicionId = null;
    this.cantidadOriginal = 0;
  }

  //Products
  obtenerNombreProducto(productoId: number): string {
    const producto = this.productos.find((p) => p.productoId === productoId);
    return producto ? producto.productoNombre : 'Producto no encontrado';
  }

  obtenerImagenProducto(productoId: number): string {
    const producto = this.productos.find((p) => p.productoId === productoId);
    return producto?.productoImagen || 'ruta/imagen-placeholder.jpg';
  }

  abrirDetallesVenta(venta: any) {
    // Aquí puedes abrir un modal con más información detallada de la venta
    alert(
      `Detalles de venta:\nProducto: ${this.obtenerNombreProducto(
        venta.productoId
      )}\nCantidad: ${venta.productoCantidad}\nTotal: Q.${venta.ventaTotal}`
    );
  }

  generarFactura(ventaId: number, descripcion: string) {
    const payload = { descripcion };
    this.ventasService.generarFacturaPDF(ventaId, payload).subscribe(
      (pdf: Blob) => window.open(URL.createObjectURL(pdf)),
      (err: any) => console.error('Error generando la factura', err)
    );
  }
  
  
  
  // generarFacturaMultiple(ventas: any[]) {
  //   const payload = {
  //     descripcion: 'Factura de múltiples productos vendidos.',
  //     ventas: ventas.map(v => ({
  //       ventaId: v.ventaId,
  //       descripcion: v.descripcion
  //     }))
  //   };
  
  //   this.ventasService.generarFacturaPDF(ventas.ventaId ,payload).subscribe(
  //     (response: Blob) => {
  //       const file = new Blob([response], { type: 'application/pdf' });
  //       const fileURL = URL.createObjectURL(file);
  //       window.open(fileURL);
  //       alert('Factura generada con éxito');
  //       this.carritoVentas = []; // Limpiar carrito
  //       this.sidebarAbierto = false; // Cerrar el sidebar
  //       this.totalCarrito = 0;
  //       this.obtenerVentas(); // Actualizar listado
  //     },
  //     (error) => {
  //       console.error('Error al generar factura múltiple', error);
  //     }
  //   );
  // }
  

  guardarDescripcionYGenerarFactura() {
  if (!this.ventaSeleccionadaParaFactura) return;

  const id = this.ventaSeleccionadaParaFactura.ventaId;
  const desc = this.descripcionFactura.trim();
  if (!id) {
    console.error('ventaEnSeleccionada no tiene ventaId');
    return;
  }

  // 1) Actualiza la descripción en la venta
  const dto = { ...this.ventaSeleccionadaParaFactura, descripcion: desc };
  this.ventasService.updateVenta(id, dto).subscribe(
    () => {
      // 2) Cierra modal y genera factura pasando id + desc
      this.cerrarModalFactura();
      this.generarFactura(id, desc || 'Factura sin descripción');
    },
    (error: any) => {
      console.error('Error al guardar la descripción', error);
      alert('No se pudo guardar la descripción');
    }
  );
}

  confirmarEliminacion(venta: any) {
    const confirm1 = confirm(
      '¿Estás seguro de que deseas eliminar esta venta?'
    );
    if (confirm1) {
      const confirm2 = confirm(
        'Esta acción es irreversible. ¿Confirmas la eliminación?'
      );
      if (confirm2) {
        this.ventasService.deleteVenta(venta.ventaId).subscribe(() => {
          alert('Venta eliminada con éxito');
          this.obtenerVentas();
        });
      }
    }
  }

  ///modal
  abrirModalFactura(venta: any) {
    this.ventaSeleccionadaParaFactura = venta;
    this.descripcionFactura = ''; // limpiar campo
  }
  cerrarModalFactura() {
    this.ventaSeleccionadaParaFactura = null;
    this.descripcionFactura = '';
  }
  //Agregar al carrito
  agregarAlCarrito(producto: any, cantidad: number) {
    if (!producto) {
      alert('Seleccione un producto válido.');
      return;
    }
    if (cantidad > producto.productoStock) {
      alert('La cantidad supera el stock disponible.');
      return;
    }
  
    const venta = {
      productoId:       producto.productoId,       // ← aquí el ID real
      productoCantidad: cantidad,                  // ← la cantidad que elijas
      ventaTotal:       cantidad * producto.productoPrecio,
      usuId:            this.usuarioSeleccionado!, // ya debe ser número
      descripcion:      this.nuevaVenta.descripcion,
      productoNombre:   producto.productoNombre,
      productoImg:      producto.productoImg,
      productoPrecio:   producto.productoPrecio
    };
  
    this.carritoVentas.push(venta);
  }
  
  //Confirmar ventas
  // confirmarVenta() {
  //   if (this.carritoVentas.length === 0) {
  //     alert('El carrito está vacío.');
  //     return;
  //   }

  //   for (const venta of this.carritoVentas) {
  //     const producto = this.productos.find(
  //       (p) => p.productoId === venta.productoId
  //     );

  //     if (producto) {
  //       if (venta.productoCantidad > producto.productoStock) {
  //         alert(
  //           `Stock insuficiente para el producto: ${producto.productoNombre}`
  //         );
  //         return;
  //       }
  //       producto.productoStock -= venta.productoCantidad;

  //       this.productosService.updateProducto(producto).subscribe(() => {
  //         console.log(`Stock actualizado para ${producto.productoNombre}`);
  //       });

  //       const ventaParaGuardar = {
  //         productoId: venta.productoId,
  //         productoCantidad: venta.productoCantidad,
  //         ventaTotal: venta.ventaTotal,
  //         usuId: venta.usuId,
  //         descripcion: venta.descripcion,
  //         ventaFecha: new Date().toISOString(),
  //       };

  //       this.ventasService.createVenta(ventaParaGuardar).subscribe(
  //         () => {
  //           console.log('Venta guardada');
  //         },
  //         (error) => {
  //           console.error('Error al guardar venta', error);
  //         }
  //       );
  //     }
  //   }

  //   alert('Ventas guardadas con éxito.');
  //   this.carritoVentas = []; // Limpiar carrito
  //   this.obtenerVentas(); // Refrescar ventas
  // }



  // confirmarVenta() {
  //   if (this.carritoVentas.length === 0) {
  //     alert('El carrito está vacío.');
  //     return;
  //   }
  
  //   if (!this.usuarioSeleccionado) {
  //     alert('Selecciona un usuario para completar la venta.');
  //     return;
  //   }
  
    
  
  //   for (const item of this.carritoVentas) {
  //     if (item.productoCantidad > this.obtenerStockDisponible(item.productoId)) {
  //       alert(`No hay suficiente stock para el producto: ${item.productoNombre}`);
  //       return;
  //     }
  
  //     const venta = {
  //       productoId: item.productoId,
  //       productoCantidad: item.productoCantidad,
  //       ventaTotal: item.productoCantidad * item.productoPrecio,
  //       ventaFecha: new Date().toISOString(),
  //       usuId: this.usuarioSeleccionado,
  //       descripcion: item.descripcion || '', // <- Asegura que lleve su descripción
  //     };
  //     const ventasACrear: any[] = [];


  
  //     ventasACrear.push(venta);
  //   }
  
  //   // Guardar todas las ventas
 
  
  //   const guardarSiguienteVenta = (index: number) => {
  //     const ventasACrear: any[] = [];

  //     if (index >= ventasACrear.length) {
  //       // Todas las ventas guardadas, ahora generar la factura
  //       const ventasGuardadas: any[] = [];
  //       this.generarFactura(ventasGuardadas);
  //       return;
  //     }
  
  //     const ventaActual = ventasACrear[index];
  //     const producto = this.productos.find(p => p.productoId === ventaActual.productoId);
  
  //     if (producto) {
  //       const ventasGuardadas: any[] = [];
  //       producto.productoStock -= ventaActual.productoCantidad;
  //       this.productosService.updateProducto(producto).subscribe(() => {
  //         this.ventasService.createVenta(ventaActual).subscribe((nuevaVenta) => {
  //           ventasGuardadas.push(nuevaVenta);
  //           guardarSiguienteVenta(index + 1); // Procesar siguiente
  //         });
  //       });
  //     }
  //   };
  
  //   guardarSiguienteVenta(0);
  // }
  
  confirmarVenta() {
    if (!this.carritoVentas.length) {
      return alert('El carrito está vacío.');
    }
    if (this.usuarioSeleccionado == null) {
      return alert('Selecciona un usuario para completar la venta.');
    }
  
    this.carritoVentas.forEach(item => {
      // Validar stock local
      if (item.productoCantidad > this.obtenerStockDisponible(item.productoId)) {
        return alert(`Stock insuficiente: ${item.productoNombre}`);
      }
  
      // Armar DTO
      const dto = {
        productoId:       item.productoId,
        productoCantidad: item.productoCantidad,
        ventaTotal:       item.ventaTotal,
        ventaFecha:       new Date().toISOString(),
        usuId:            this.usuarioSeleccionado, // <-- número garantizado
        descripcion:      item.descripcion || ''
      };
  
      // Llamar al backend
      this.ventasService.createVenta(dto).subscribe(
        (ventaGuardada: any) => {
          // Actualizar stock en frontend y backend
          const prod = this.productos.find(p => p.productoId === ventaGuardada.productoId)!;
          prod.productoStock -= ventaGuardada.productoCantidad;
          this.productosService.updateProducto(prod).subscribe();
  
          // Generar factura individual
          this.generarFactura(ventaGuardada.ventaId, ventaGuardada.descripcion);
        },
        (err: any) => {
          console.error('Error al guardar venta', err);
          alert(`Error al guardar la venta de ${item.productoNombre}`);
        }
      );
    });
  
    // Limpiar y refrescar
    alert('Ventas registradas y facturas en curso.');
    this.carritoVentas = [];
    this.totalCarrito = 0;
    this.obtenerVentas();
  }
  
  
  

  // Abrir/Cerrar el sidebar
  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
    this.recalcularTotal();
  }

  // Recalcular total de todos los productos en el carrito
  recalcularTotal() {
    this.totalCarrito = this.carritoVentas.reduce((total, item) => {
      return total + item.productoCantidad * item.productoPrecio;
    }, 0);
  }

  // Eliminar un producto del carrito
  eliminarDelCarrito(index: number) {
    this.carritoVentas.splice(index, 1);
    this.recalcularTotal();
  }

  // Obtener el stock disponible para validar el máximo en input cantidad
  obtenerStockDisponible(productoId: number): number {
    const producto = this.productos.find((p) => p.productoId === productoId);
    return producto ? producto.productoStock : 1;
  }
}
