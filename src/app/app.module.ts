import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsuarioService } from './services/usuario.service';
// Importar Interceptor
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { UsuariosComponent } from './pages/usuarios/usuarios.component'; // Importa el componente


@NgModule({
  declarations: [
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AppComponent,
    UsuariosComponent
  ],
  providers: [
    UsuarioService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule { }
