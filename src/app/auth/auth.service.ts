import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // ✅ Correcto

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5133/api/auth/login'; 
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // login(credenciales: any): Observable<any> {
  //   return this.http.post(this.apiUrl, credenciales);
  // }
  
  login(credenciales: any): Observable<any> {
  return this.http.post(this.apiUrl, credenciales);
}

  getRolId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded.rolId || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }
  
  setToken(token: string) {
    this.token = token; // Guardar token en memoria
  }

  getToken(): string | null {
    return this.token; //Obtener token en memoria
  }

  logout() {
    this.token = null; //Limpiar el token en memoria
  }

  isAuthenticated(): boolean {
    return this.token !== null; // Verificar si el usuario está autenticado
  }
}
