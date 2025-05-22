import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms'; // ✅ Importar FormsModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth/auth-interceptor.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule, FormsModule, HttpClientModule), // ✅ Agregar FormsModule aquí
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, provideCharts(withDefaultRegisterables())
  ]
}).catch(err => console.error(err));
