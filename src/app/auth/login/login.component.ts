import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule] 
})
export class LoginComponent {
  usuario: string = ''; 
  contrasena: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const credenciales = {
      usuId: this.usuario,
      usuContraseña: this.contrasena
    };
  
    this.authService.login(credenciales).subscribe(
      response => {
        if (response.token) {
          this.authService.setToken(response.token); // Guardar token
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            timer: 1500,
            showConfirmButton: false
          });
          this.router.navigate(['/principal']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Usuario o contraseña inválidos'
          });
        }
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: 'Usuario o contraseña inválidos'
        });
      }
    );
  }
  
}
