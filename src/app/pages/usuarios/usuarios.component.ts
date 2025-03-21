import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-usuarios',
  imports: [HttpClientModule,CommonModule,FormsModule,SidebarComponent,RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})

export class UsuariosComponent implements OnInit  {
  usuarios: any[] = [];
  roles: any[] = [];
  modalAbierto: boolean = false;
  editando = false;
  usuario: any = {
    usuId: '',
    usuPNombre: '',
    usuPApellido: '',
    usuCui: '',
    usuNit: '',
    usuFecNacimiento: '',
    usuFecIngreso: '',
    usuDireccion: '',
    usuTelMovil: '',
    usuGenero: '',
    usuEstado: 'A',
    usuPuesto: '',
    rolId: null,
    usuContrasena: '',
    usuEmail: ''
  };
  
  filtroSeleccionado: string = 'usuPNombre'; // Opción de filtro activa (por defecto: nombre)
  filtroVisible: boolean = false; // Estado del menú desplegable
  usuariosFiltrados: any[] = []; // Lista de usuarios filtrados
  searchTerm: string = '';


  constructor(
    private usuarioService: UsuarioService, 
    private http: HttpClient // ✅ Inyectamos HttpClient aquí
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles(); // Método para cargar los roles

  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      this.usuariosFiltrados = data; // ✅ Inicializar la lista filtrada con todos los usuarios
    });
  }
  

  cargarRoles(): void {
    this.usuarioService.getRoles().subscribe(
      data => {
        console.log('Roles recibidos:', data);  // 👀 Verifica en la consola
        this.roles = data; // Usa directamente `data` ya que es un array
      },
      error => {
        console.error('Error al cargar roles:', error);
      }
    );
  }
  

  

  abrirModal(editando = false, usuarioExistente: any = null) {
    this.modalAbierto = true;
    this.editando = editando;
  
    if (editando && usuarioExistente && typeof usuarioExistente === 'object') {
      this.usuario = { ...usuarioExistente };  // Clon seguro del usuario existente
    } else {
      this.usuario = {
        usuId: '', // <-- Puede causar problemas si la API espera un valor generado automáticamente
        usuPNombre: '',
        usuPApellido: '',
        usuCui: '',
        usuNit: '',
        usuFecNacimiento: '',
        usuFecIngreso: '',
        usuDireccion: '',
        usuTelMovil: '',
        usuGenero: '',
        usuEstado: '',
        usuPuesto: '',
        rolId: null,
        usuContrasena: '',
        usuEmail: ''
      };
    }
  }
  
  
  crearUsuario() {
    if (!this.usuario.usuPNombre || !this.usuario.usuPApellido || !this.usuario.usuEmail) {
        alert("Todos los campos obligatorios deben llenarse.");
        return;
    }

    // ✅ Ajustar formato de fechas antes de enviar al backend
    this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0]; 
    this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];

    // ✅ Convertir usuGenero y usuEstado a valores correctos
    this.usuario.usuGenero = this.usuario.usuGenero.charAt(0);  // "Masculino" -> "M"
    this.usuario.usuEstado = this.usuario.usuEstado.charAt(0);  // "Activo" -> "A"

    console.log("Datos enviados:", this.usuario); // 👀 Verificar en consola

    this.usuarioService.crearUsuario(this.usuario).subscribe({
        next: (response) => {
            console.log('Usuario creado con éxito:', response);
            this.cerrarModal();
            this.cargarUsuarios();
        },
        error: (error) => {
            console.error('Error al crear usuario:', error);
            alert(`Error: ${error.status} - ${error.error?.message || 'Revisa los datos ingresados.'}`);
        }
    });
}


  
  
  
  
  ajustarFormatoFecha(campo: string) {
    if (this.usuario[campo]) {
      // 📌 Se asegura de convertir la fecha a `yyyy-MM-dd` antes de enviarla
      const fecha = new Date(this.usuario[campo]);
      this.usuario[campo] = fecha.toISOString().split('T')[0]; // Formato `yyyy-MM-dd`
    }
  }
  
  
  
  
  
  
 
  
  
  cerrarModal() {
    this.modalAbierto = false;
  }
  editarUsuario(usuario: any) {
    this.modalAbierto = true;
    this.editando = true;
    this.usuario = { ...usuario }; // Copiar los datos del usuario
  }

  filtrarUsuarios() {
    if (!this.searchTerm.trim()) { 
      this.usuariosFiltrados = this.usuarios; // ✅ Si no hay búsqueda, muestra todos los usuarios
      return;
    }
  
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const valor = usuario[this.filtroSeleccionado]?.toString().toLowerCase() || '';
      return valor.includes(this.searchTerm.toLowerCase());
    });
  }
  

  guardarUsuario() {
    if (this.editando) {
      this.usuarioService.updateUsuario(this.usuario.usuId, this.usuario).subscribe(() => {
        this.cargarUsuarios();
        this.cerrarModal();
      });
    } else {
      this.usuarioService.crearUsuario(this.usuario).subscribe(() => {
        this.cargarUsuarios();
        this.cerrarModal();
      });
    }
  }



  // Mostrar/ocultar el menú de filtros
  toggleFiltro() {
    this.filtroVisible = !this.filtroVisible;
  }

   deleteUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe(() => {
        this.cargarUsuarios(); // Recargar la lista después de eliminar
      });
    }
  }

   // ✏️ Editar usuario
   editUsuario(usuario: any) {
    console.log('Editar usuario:', usuario);
  } 

   // Métodos para abrir el modal de creación y edición
   

}
