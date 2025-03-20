import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 

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
          this.authService.setToken(response.token); // ✅ Guardar token en memoria
          this.router.navigate(['/principal']); // ✅ Redirigir al dashboard
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error => {
        alert('Error en el login. Verifica tus credenciales.');
      }
    );
  }
}
