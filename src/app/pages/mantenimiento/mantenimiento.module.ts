import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    DashboardComponent,
    ConfiguracionesComponent  // Importa el componente standalone
  ]
})
export class MantenimientoModule { }
