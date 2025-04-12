import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://localhost:7282/api/Usuarios';
  private apiRolesUrl = 'https://localhost:7282/api/Roles';
  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

   // Obtener todos los roles
   getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiRolesUrl}`);
}


  getUsuarioById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/Usuarios`);
  }

  // Crear un nuevo usuario
//   crearUsuario(usuario: any): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}`, usuario);
// }
crearUsuario(usuario: any): Observable<any> {
  // Cifrar la contraseña antes de enviarla al backend
  const salt = bcrypt.genSaltSync(10); // Genera un salt
  usuario.usuContrasena = bcrypt.hashSync(usuario.usuContrasena, salt); // Cifra la contraseña

  // Enviar el usuario al backend
  return this.http.post<any>(`${this.apiUrl}`, usuario);
}

// updateUsuario(id: string, usuario: any): Observable<any> {
//   return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
// }

updateUsuario(id: string, usuario: any): Observable<any> {
  // Verificar si el usuario ingresó una nueva contraseña
  if (usuario.usuContrasena && usuario.usuContrasena.trim() !== '') {
    // Cifrar la nueva contraseña antes de enviarla al backend
    const salt = bcrypt.genSaltSync(10);
    usuario.usuContrasena = bcrypt.hashSync(usuario.usuContrasena, salt);
  } else {
    // Si no se ingresó una nueva contraseña, no modificar el campo
    delete usuario.usuContrasena;
  }

  // Enviar el usuario actualizado al backend
  return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
}

   // Eliminar un usuario
   deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  


}
