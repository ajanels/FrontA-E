import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Rol {
  rolId: number;
  rolNombre: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'https://localhost:7282/api/Roles';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  createRole(role: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, role);
  }

  updateRole(id: number, role: Rol): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, role);
  }
}
