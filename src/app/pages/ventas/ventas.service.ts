import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'https://localhost:7282/api/ventas'; // URL del endpoint del backend

  constructor(private http: HttpClient) {}

  // Método para obtener las ventas con los productos relacionados
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}