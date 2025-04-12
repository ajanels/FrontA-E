import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasService } from './ventas.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  title = 'Ventas';
  ventas: any[] = []; // Lista de ventas
  modalVisible = false; // Control del modal
  ventaSeleccionada: any = null; // Producto actual en detalle

  constructor(private ventasService: VentasService) {}

  ngOnInit() {
    this.cargarVenta();
  }

  cargarVenta() {
    this.ventasService.getVentas().subscribe(
      (data) => {
        this.ventas = data;
        // console.log('Ventas cargadas:', this.ventas);
      },
      (error) => {
        // console.error('Error al cargar las ventas:', error);
      }
    );
  }

  //Modal
  abrirModal(venta: any) {
    this.ventaSeleccionada = venta;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.ventaSeleccionada = null;
  }

  agregarAlCarrito(venta: any) {
    console.log('Producto agregado al carrito:', venta);
    // Aquí puedes agregar lógica real para agregar al carrito
  }
}
