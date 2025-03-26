import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-inventario',
  imports: [CommonModule,RouterModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent {
  titulo = 'Ventas';
}
