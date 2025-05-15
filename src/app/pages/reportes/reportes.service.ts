// // // import { Injectable } from '@angular/core';
// // // import { HttpClient } from '@angular/common/http';
// // // import { Observable } from 'rxjs';

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class ReportesService {
// // //     private apiUrl = 'https://localhost:7282/api/productos/';

// // //   constructor(private http: HttpClient) { }

// // //   obtenerDatosReportes(): Observable<any> {
// // //     // Ajusta la URL del endpoint según tu API
// // //     return this.http.get<any>(`${this.apiUrl}/stock-resumen`);
// // //   }
// // // }
// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable } from 'rxjs';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class ReportesService {
// //   private apiUrl = 'https://localhost:7282/api/productos'; // Elimina la barra final

// //   constructor(private http: HttpClient) { }

// //   obtenerDatosReportes(): Observable<any> {
// //     // Ajusta la URL del endpoint según tu API
// //     return this.http.get<any>(`${this.apiUrl}/stock-resumen`); // La barra se agrega aquí
// //   }
// // }
// // // import { Injectable } from '@angular/core';
// // // import { HttpClient } from '@angular/common/http';
// // // import { Observable } from 'rxjs';

// // // @Injectable({
// // //   providedIn: 'root'
// // // })
// // // export class ReportesService {
// // //     private apiUrl = 'https://localhost:7282/api/productos/';

// // //   constructor(private http: HttpClient) { }

// // //   obtenerDatosReportes(): Observable<any> {
// // //     // Ajusta la URL del endpoint según tu API
// // //     return this.http.get<any>(`${this.apiUrl}/stock-resumen`);
// // //   }
// // // }
// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Observable } from 'rxjs';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class ReportesService {
// //   private apiUrl = 'https://localhost:7282/api/productos'; // Elimina la barra final

// //   constructor(private http: HttpClient) { }

// //   obtenerDatosReportes(): Observable<any> {
// //     // Ajusta la URL del endpoint según tu API
// //     return this.http.get<any>(`${this.apiUrl}/stock-resumen`); // La barra se agrega aquí
// //   }
// // }
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReportesService {
//   private apiUrl = 'https://localhost:7282/api/productos';

//   constructor(private http: HttpClient) { }

//   obtenerDatosStock(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/stock-resumen`);
//   }

//   obtenerPrecioPromedioPorCategoria(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/precio-promedio-categoria`);
//   }

//   obtenerDistribucionProductosPorCategoria(): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/distribucion-productos-categoria`);
//   }

//   obtenerResumenVentas(): Observable<any> {
//     return this.http.get<any>('https://localhost:7282/api/ventas/resumen-ventas-producto');
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private apiUrl = 'https://localhost:7282/api';

  constructor(private http: HttpClient) {}

  // Productos
  obtenerStockResumen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/stock-resumen`);
  }
  obtenerProductosDisponibilidad(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos/disponibilidad`);
  }

  //   obtenerPromedioStockPorCategoria(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/productos/scategoria`);
  // }

  obtenerTopProductosStock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/topstock`);
  }

  //Ventas
  getVentasPorDia() {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/ventasxdia`);
  }

  getProductosMasVendidos() {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/masvendido`);
  }

  // getVentasPorFecha() {
  //   return this.http.get<any[]>(`${this.apiUrl}/ventas/ventasxfecha`);
  // }
  //   obtenerPorcentajeVendidosVsStock(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiUrl}/ventas/stockvsproductos`);
  // }
  getVentasPorCantidad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ventas/ventasxcantidad`);
  }
}
