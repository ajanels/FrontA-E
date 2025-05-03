import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, // Esta es la pantalla principal del módulo de mantenimiento
  { path: 'configuraciones', component: ConfiguracionesComponent } // Ruta para configuraciones

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoRoutingModule { }
