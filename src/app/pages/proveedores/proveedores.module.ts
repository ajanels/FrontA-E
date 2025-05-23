// src/app/pages/proveedores/proveedores.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresComponent } from './proveedores.component';

const routes: Routes = [
  { path: '', component: ProveedoresComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ProveedoresComponent  // ← aquí, no en declarations
  ]
})
export class ProveedoresModule {}
