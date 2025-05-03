import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas.component';
import { VentasRoutingModule } from './ventas-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,
    FormsModule,
  ],
  exports: [
    VentasComponent
  ],
})
export class VentasModule { }
