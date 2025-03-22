import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, usuario);
}

updateUsuario(id: string, usuario: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
}


   // Eliminar un usuario
   deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  


}
