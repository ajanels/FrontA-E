import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { ReportesService } from './reportes.service';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, BaseChartDirective],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
  providers: [ReportesService],
})
export class ReportesComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('barChartDisponibilidad', { read: BaseChartDirective })
  barChartDisponibilidad: BaseChartDirective | undefined;

  //Cate
  // @ViewChild('barChartPromedio', { read: BaseChartDirective })
  // barChartPromedio: BaseChartDirective | undefined;
  @ViewChild('barChartTopProductos', { read: BaseChartDirective })
  barChartTopProductos: BaseChartDirective | undefined;

  //Pie
  // Pie 1: Ventas por día
  ventasPorDiaLabels: string[] = [];
  ventasPorDiaData: number[] = [];

  //Pie 2
  productosMasVendidosLabels: string[] = [];
  productosMasVendidosData: number[] = [];

   pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: string = 'pie';

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  //Pie 3
  ventasPorFechaLabels: string[] = [];
  ventasPorFechaData: number[] = [];
  // Nueva gráfica: Disponibilidad de productos
  public barChartOptionsDisponibilidad: ChartOptions<'bar'> = {
    responsive: true,
  };
  public barChartTypeDisponibilidad: 'bar' = 'bar';
  public barChartLegendDisponibilidad = true;
  public barChartDataDisponibilidad: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Cantidad' }],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };

  public barChartType: 'bar' = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Stock' }],
  };

  ventasPorCantidadLabels: string[] = [];
  ventasPorCantidadData: number[] = [];

    public pieChartOptionsCantidad: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
  public pieChartTypeCantidad: 'pie' = 'pie';


  //Categoria
  //   public barChartDataPromedio: ChartData<'bar'> = {
  //   labels: [],
  //   datasets: [{ data: [], label: 'Promedio Stock' }]
  // };

  // public barChartOptionsPromedio: ChartOptions<'bar'> = {
  //   responsive: true,
  // };

  // public barChartTypePromedio: 'bar' = 'bar';
  // public barChartLegendPromedio = true;
  public barChartDataTopProductos: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Stock' }],
  };

  public barChartOptionsTopProductos: ChartOptions<'bar'> = {
    responsive: true,
  };

  public barChartTypeTopProductos: 'bar' = 'bar';
  public barChartLegendTopProductos = true;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.obtenerDatosDelEndpoint();
    this.obtenerProductosDisponibilidad(); // nuevo
    //  this.obtenerPromedioStockPorCategoria(); // nuevo
    this.obtenerTopProductosPorStock(); // nuevo
    this.cargarVentasPorDia();
    this.cargarProductosMasVendidos();
    //
    this.cargarVentasPorCantidad();
  }

  obtenerDatosDelEndpoint(): void {
    this.reportesService.obtenerStockResumen().subscribe(
      (data: any[]) => {
        console.log('Datos de stock recibidos:', data);
        const labels = data.map((item) => item.nombre);
        const values = data.map((item) => item.stock);

        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = values;

        this.chart?.update();
      },
      (error) => {
        console.error('Error al obtener los datos de stock:', error);
      }
    );
  }

  // Método para cargar la data
  obtenerProductosDisponibilidad(): void {
    this.reportesService.obtenerProductosDisponibilidad().subscribe(
      (data: any[]) => {
        this.barChartDataDisponibilidad.labels = data.map(
          (item) => item.estado
        );
        this.barChartDataDisponibilidad.datasets[0].data = data.map(
          (item) => item.cantidad
        );
        this.barChartDisponibilidad?.update();
      },
      (error) => {
        console.error('Error al obtener disponibilidad de productos:', error);
      }
    );
  }

  //Cat
  //   obtenerPromedioStockPorCategoria(): void {
  //   this.reportesService.obtenerPromedioStockPorCategoria().subscribe(
  //     (data: any[]) => {
  //       this.barChartDataPromedio.labels = data.map(item => item.categoria);
  //       this.barChartDataPromedio.datasets[0].data = data.map(item => item.promedioStock);
  //       this.barChartPromedio?.update();
  //     },
  //     error => {
  //       console.error('Error al obtener promedio por categoría:', error);
  //     }
  //   );
  // }
  obtenerTopProductosPorStock(): void {
    this.reportesService.obtenerTopProductosStock().subscribe(
      (data: any[]) => {
        this.barChartDataTopProductos.labels = data.map((item) => item.nombre);
        this.barChartDataTopProductos.datasets[0].data = data.map(
          (item) => item.stock
        );
        this.barChartTopProductos?.update();
      },
      (error) => {
        console.error('Error al obtener top de productos por stock:', error);
      }
    );
  }

  //Pie
  cargarVentasPorDia(): void {
    this.reportesService.getVentasPorDia().subscribe((data) => {
      this.ventasPorDiaLabels = data.map((d: any) => d.fecha);
      this.ventasPorDiaData = data.map((d: any) => d.totalVentas);
    });
  }

  cargarProductosMasVendidos(): void {
    this.reportesService.getProductosMasVendidos().subscribe((data) => {
      this.productosMasVendidosLabels = data.map((d: any) => d.producto);
      this.productosMasVendidosData = data.map((d: any) => d.totalCantidad); // o usa d.totalVentas si prefieres
    });
  }

    private cargarVentasPorCantidad(): void {
    this.reportesService.getVentasPorCantidad().subscribe(data => {
      this.ventasPorCantidadLabels = data.map(d => d.cantidad.toString());
      this.ventasPorCantidadData   = data.map(d => d.totalVentas);
    });
  }
  // cargarVentasPorFecha(): void {
  //   this.reportesService.getVentasPorFecha().subscribe((data) => {
  //     this.ventasPorFechaLabels = data.map((d: any) => d.fecha);
  //     this.ventasPorFechaData = data.map((d: any) => d.total);
  //   });
  // }

}
