import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './layout/layout.component'; // Nuevo componente de layout
import { AuthGuard } from './auth/auth.guard';
import { PrincipalComponent } from './pages/principal/principal.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'principal', component: PrincipalComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'mantenimiento', component: MantenimientoComponent },
      { path: '', redirectTo: 'principal', pathMatch: 'full' } // Redirige a principal
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
