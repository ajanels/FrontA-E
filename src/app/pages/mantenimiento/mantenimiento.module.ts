import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MantenimientoRoutingModule } from './mantenimiento-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { CategoriasComponent } from './categorias/categorias.component'; // Asegúrate de agregar esto
import { RouterModule } from '@angular/router'; // Asegúrate de que esté importado
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MantenimientoRoutingModule,
    DashboardComponent,
    ConfiguracionesComponent,
     FormsModule,
    HttpClientModule  // Importa el componente standalone
  ]
})
export class MantenimientoModule { }
