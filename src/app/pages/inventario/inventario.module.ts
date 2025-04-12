import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { InventarioComponent } from './inventario.component';

@NgModule({
  declarations: [InventarioComponent],
  imports: [
    CommonModule,
    FormsModule, // Asegúrate de importar FormsModule aquí
  ],
  exports: [InventarioComponent],
})
export class InventarioModule {}
