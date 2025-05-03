import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = 'https://localhost:7282/api/ventas';
 
  constructor(private http: HttpClient) {}

  // Obtener todas las ventas
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //Obtener productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7282/api/productos');
  }

  // Obtener usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7282/api/usuarios');
  }

  // Crear una  nueva venta
  createVenta(venta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }

  // Actualizar una venta existente
  updateVenta(id: number, venta: any) {
    return this.http.put(`${this.apiUrl}/${id}`, venta);
  }

  // Eliminar una venta
  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // (Opcional) Obtener una sola venta por ID
  getVentaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  //Factura
  // generarFacturaPDF(ventaId: number, payload: any): Observable<Blob> {
  //   return this.http.post(`${this.apiUrlT}/factura/${ventaId}`, payload, {
  //     responseType: 'blob',
  //   });
  // }
  // generarFacturaPDF(ventaId: number, payload: any): Observable<Blob> {
  //   return this.http.post<Blob>(
  //     `https://localhost:7282/api/facturas/factura/${ventaId}`,
  //     payload,  // Enviar directamente el payload (que ya contiene la descripcion)
  //     {
  //       responseType: 'blob' as 'json'  // Especificamos que la respuesta es de tipo Blob
  //     }
  //   );
  // }
  // VentasService
// generarFacturaPDFMultiple(payload: any) {
//   return this.http.post<Blob>(
//     `https://localhost:7282/api/ventas/factura-multiple`, // <-- cambia ruta si es necesario
//     payload,
//     {
//       responseType: 'blob' as 'json',
//     }
//   );
// }
// Factura individual
// generarFacturaPDF(ventaId: number, payload: any): Observable<Blob> {
//   return this.http.post(
//     `https://localhost:7282/api/ventas/factura/${ventaId}`,
//     payload,
//     { responseType: 'blob' }
//   );
// }

generarFacturaPDF(ventaId: number, payload: any): Observable<Blob> {
  return this.http.post(
    `${this.apiUrl}/factura/${ventaId}`,
    payload,
    { responseType: 'blob' }
  );
}
}
