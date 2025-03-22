import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

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
  intervalId: any;
  rolIdActual: number | null = null;
  rolId: number = 0;
  rolUsuario: number = 0;

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
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerRolDesdeToken();
    this.cargarUsuarios();
    this.cargarRoles();
  
    // Actualizar la tabla cada 1 segundo
    //this.intervalId = setInterval(() => {
      //this.cargarUsuarios();
    //}, 1000);
  }

  obtenerRolDesdeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.rolId = +decoded.rol; // asegúrate que el claim se llama "rol"
      console.log("Rol actual:", this.rolId);
    }
  }
  
  
  
  
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: data => {
        this.usuarios = data;
        this.usuariosFiltrados = data; // 👈 mostrar todos al inicio
      },
      error: err => {
        console.error('Error al cargar usuarios', err);
      }
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
  
    if (editando && usuarioExistente) {
      console.log("🧩 Usuario a editar:", usuarioExistente); // 👈 Verifica si trae el usuId
      this.usuario = { ...usuarioExistente }; // Copiar datos del usuario
    } else {
      this.usuario = {
        usuId: '', // ⚠️ IMPORTANTE: El ID solo debe llenarse en edición, no en creación
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

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(this.usuario.usuEmail)) {
      alert("El correo electrónico no es válido.");
      return;
    }

// ✅ Validación de rol seleccionado
if (!this.usuario.rolId || this.usuario.rolId <= 0) {
  alert("Debe seleccionar un rol.");
  return;
}

    // ✅ Ajustar formato de fechas antes de enviar al backend
    this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0];
this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];

    // ✅ Convertir usuGenero y usuEstado a valores correctos
    this.usuario.usuGenero = this.usuario.usuGenero.charAt(0); // "Masculino" -> "M"
    this.usuario.usuEstado = this.usuario.usuEstado.charAt(0); // "Activo" -> "A"
    
    console.log("Datos enviados:", JSON.stringify(this.usuario, null, 2));

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


editarUsuario(usuario: any) {
  this.modalAbierto = true;
  this.editando = true;
  this.usuario = { ...usuario }; // Copia segura del usuario para edición
}

guardarUsuario() {
  if (this.editando) {
    // Si estamos editando, se usa PUT con el ID del usuario
    console.log("Editando usuario con ID:", this.usuario.usuId);
    this.usuarioService.updateUsuario(this.usuario.usuId, this.usuario).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: 'Los cambios se guardaron correctamente.'
        });
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'No se pudo actualizar el usuario.'
        });
        console.error("Error al actualizar usuario:", error);
      }
    );
  } else {
    // Si estamos creando, se usa POST y el backend asignará el ID
    console.log("Creando nuevo usuario...");
    this.usuarioService.crearUsuario(this.usuario).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El nuevo usuario ha sido registrado exitosamente.'
        });
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'No se pudo registrar el usuario.'
        });
        console.error("Error al crear usuario:", error);
      }
    );
  }
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
    this.usuario = {};
    this.editando = false;
  }


  filtrarUsuarios() {
    if (!this.searchTerm.trim()) {  
      this.usuariosFiltrados = this.usuarios; // 🔹 Restaurar lista si no hay búsqueda
      return;
    }
  
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const valor = usuario[this.filtroSeleccionado]?.toLowerCase() || '';
      return valor.includes(this.searchTerm.toLowerCase());
    });
  }
  // Mostrar/ocultar el menú de filtros

  deleteUsuario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará el usuario permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.cargarUsuarios(); // Refrescar lista
            Swal.fire('Eliminado', 'El usuario fue eliminado con éxito.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Ocurrió un error al eliminar el usuario.', 'error');
          }
        });
      }
    });
  }
  
  

   // ✏️ Editar usuario
   editUsuario(usuario: any) {
    this.abrirModal(true, usuario); // 🔹 Abre el modal en modo edición
  }
  
   //obtener rol para log

   
}
