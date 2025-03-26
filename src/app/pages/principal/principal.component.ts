import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PrincipalComponent {
  // Indica si el sidebar está expandido o no
  sidebarExpandido: boolean = true;

  onSidebarChange(expandido: boolean) {
    this.sidebarExpandido = expandido;
  }
}
