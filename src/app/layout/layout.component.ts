import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent]
})
export class LayoutComponent {
  // Controla si el sidebar está expandido o no
  sidebarExpandido: boolean = true;

  onSidebarChange(expandido: boolean) {
    this.sidebarExpandido = expandido;
  }
}
