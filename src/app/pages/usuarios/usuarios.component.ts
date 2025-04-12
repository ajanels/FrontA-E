import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
//Data encrypt
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-usuarios',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];
  modalAbierto: boolean = false;
  editando = false;
  intervalId: any;
  rolIdActual: number | null = null;
  rolId: number = 0;
  rolUsuario: number = 0;

  formSubmitted: boolean = false;

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
    usuEmail: '',
  };

  filtroSeleccionado: string = 'usuPNombre'; // Opción de filtro activa (por defecto: nombre)
  filtroVisible: boolean = false; // Estado del menú desplegable
  usuariosFiltrados: any[] = []; // Lista de usuarios filtrados
  searchTerm: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {}

  fechaMaximaNacimiento: string = '';

  ngOnInit(): void {
    this.obtenerRolDesdeToken();
    this.cargarUsuarios();
    this.cargarRoles();

    //Fecha valida de nacimiento
    const fechaActual = new Date();
    const anioMaximo = fechaActual.getFullYear() - 18; // Usuario debe ser mayor de 18 años
    this.fechaMaximaNacimiento = `${anioMaximo}-12-31`;
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
      // console.log('Rol actual:', this.rolId);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data; // 👈 mostrar todos al inicio
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
      },
    });
  }
  //V2
  // cargarUsuarios() {
  //   this.usuarioService.getUsuarios().subscribe({
  //     next: data => {
  //       this.usuarios = data.map(usuario => ({
  //         ...usuario,
  //         usuFecNacimiento: this.formatearFecha(usuario.usuFecNacimiento),
  //         usuFecIngreso: this.formatearFecha(usuario.usuFecIngreso)
  //       }));
  //       this.usuariosFiltrados = this.usuarios; // 👈 mostrar todos al inicio
  //     },
  //     error: err => {
  //       console.error('Error al cargar usuarios', err);
  //     }
  //   });
  // }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  // cargarRoles(): void {
  //   this.usuarioService.getRoles().subscribe(
  //     data => {
  //       console.log('Roles recibidos:', data);  // 👀 Verifica en la consola
  //       this.roles = data; // Usa directamente `data` ya que es un array
  //     },
  //     error => {
  //       console.error('Error al cargar roles:', error);
  //     }
  //   );
  // }
  cargarRoles(): void {
    this.usuarioService.getRoles().subscribe(
      (data) => {
        // console.log('Roles recibidos:', data); // Verifica si los datos son correctos
        this.roles = data.map((rol: any) => ({
          ...rol,
          rolId: Number(rol.rolId), // Asegúrate de que sea un número
        }));
      },
      (error) => {
        console.error('Error al cargar roles:', error);
      }
    );
  }
  // abrirModal(editando = false, usuarioExistente: any = null) {
  //   this.modalAbierto = true;
  //   this.editando = editando;

  //   if (editando && usuarioExistente) {
  //     console.log("🧩 Usuario a editar:", usuarioExistente); // 👈 Verifica si trae el usuId
  //     this.usuario = { ...usuarioExistente }; // Copiar datos del usuario
  //   } else {
  //     this.usuario = {
  //       usuId: '', // ⚠️ IMPORTANTE: El ID solo debe llenarse en edición, no en creación
  //       usuPNombre: '',
  //       usuPApellido: '',
  //       usuCui: '',
  //       usuNit: '',
  //       usuFecNacimiento: '',
  //       usuFecIngreso: '',
  //       usuDireccion: '',
  //       usuTelMovil: '',
  //       usuGenero: '',
  //       usuEstado: '',
  //       usuPuesto: '',
  //       rolId: null,
  //       usuContrasena: '',
  //       usuEmail: ''
  //     };
  //   }
  // }

  // abrirModal(editando = false, usuarioExistente: any = null) {
  //   // console.log('Usuario antes de abrir el modal:', usuarioExistente);
  //   this.modalAbierto = true;
  //   this.editando = editando;

  //   if (editando && usuarioExistente) {
  //     this.usuario = {
  //       ...usuarioExistente,
  //       usuFecNacimiento: this.extraerFecha(usuarioExistente.usuFecNacimiento),
  //       usuFecIngreso: this.extraerFecha(usuarioExistente.usuFecIngreso),
  //       rolId: Number(usuarioExistente.rolId), // Asegúrate de que sea un número
  //     };
  //     // console.log('Usuario cargado para edición:', this.usuario);
  //   } else {
  //     this.usuario = {
  //       usuId: '',
  //       usuPNombre: '',
  //       usuPApellido: '',
  //       usuCui: '',
  //       usuNit: '',
  //       usuFecNacimiento: '',
  //       usuFecIngreso: '',
  //       usuDireccion: '',
  //       usuTelMovil: '',
  //       usuGenero: '',
  //       usuEstado: '',
  //       usuPuesto: '',
  //       rolId: null,
  //       usuContrasena: '',
  //       usuEmail: '',
  //     };
  //   }
  // }

  abrirModal(editando = false, usuarioExistente: any = null): void {
    this.modalAbierto = true;
    this.editando = editando;
  
    if (editando && usuarioExistente) {
      this.usuario = {
        ...usuarioExistente,
        usuFecNacimiento: this.extraerFecha(usuarioExistente.usuFecNacimiento),
        usuFecIngreso: this.extraerFecha(usuarioExistente.usuFecIngreso),
        rolId: Number(usuarioExistente.rolId),
      };
      // Dejar el campo de contraseña vacío para que el usuario pueda ingresar una nueva
      this.usuario.usuContrasena = '';
    } else {
      this.usuario = {
        // usuId: '',
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
        usuEmail: '',
      };
    }
  
    // Generar el usuario automáticamente si el nombre y apellido ya están presentes
    this.generarUsuarioId();
  }

  extraerFecha(fechaCompleta: string): string {
    if (!fechaCompleta) return '';
    // Extrae solo la parte de la fecha (yyyy-MM-dd) de la cadena completa
    return fechaCompleta.split('T')[0];
  }

  // crearUsuario() {
  //   // Validar campos obligatorios
  //   if (
  //     !this.usuario.usuPNombre ||
  //     !this.usuario.usuPApellido ||
  //     !this.usuario.usuEmail
  //   ) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en los datos',
  //       text: 'Todos los campos obligatorios deben llenarse.',
  //     });
  //     return;
  //   }

  //   if (!this.validarUsuario()) {
  //     return;
  //   }

  //   // Validar longitud de DPI y NIT
  //   if (this.usuario.usuCui.length !== 13) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el DPI',
  //       text: 'El DPI debe tener exactamente 13 caracteres.',
  //     });
  //     return;
  //   }

  //   if (this.usuario.usuNit.length !== 9) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el NIT',
  //       text: 'El NIT debe tener exactamente 9 caracteres.',
  //     });
  //     return;
  //   }

  //   // Validar formato de correo electrónico
  //   const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!correoValido.test(this.usuario.usuEmail)) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el correo',
  //       text: 'El correo electrónico no es válido.',
  //     });
  //     return;
  //   }

  //   // Validar fecha de nacimiento
  //   const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
  //   const hoy = new Date();
  //   if (fechaNacimiento >= hoy) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
  //     });
  //     return;
  //   }

  //   // Ajustar formato de fechas antes de enviar al backend
  //   this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0];
  //   this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];

  //   // Crear usuario (POST)
  //   console.log('Creando nuevo usuario...');
  //   this.usuarioService.crearUsuario(this.usuario).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Usuario creado',
  //         text: 'El nuevo usuario ha sido registrado exitosamente.',
  //       });
  //       this.cargarUsuarios();
  //       this.cerrarModal();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al crear',
  //         text: 'No se pudo registrar el usuario. Revisa los datos ingresados.',
  //       });
  //       console.error('Error al crear usuario:', error);
  //     }
  //   );
  // }

  // crearUsuario() {
  //   // Validar campos obligatorios
  //   if (
  //     !this.usuario.usuPNombre ||
  //     !this.usuario.usuPApellido ||
  //     !this.usuario.usuEmail
  //   ) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en los datos',
  //       text: 'Todos los campos obligatorios deben llenarse.',
  //     });
  //     return;
  //   }
  
  //   // Validar fecha de nacimiento
  //   if (!this.usuario.usuFecNacimiento) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento es obligatoria.',
  //     });
  //     return;
  //   }
  
  //   const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
  //   const hoy = new Date();
  //   const fechaMaxima = new Date('2007-12-31');
  
  //   if (fechaNacimiento >= hoy) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
  //     });
  //     return;
  //   }
  
  //   if (fechaNacimiento > fechaMaxima) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento no puede ser posterior al 31 de diciembre de 2007.',
  //     });
  //     return;
  //   }
  
  //   // Validar longitud de DPI y NIT
  //   if (this.usuario.usuCui.length !== 13) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el DPI',
  //       text: 'El DPI debe tener exactamente 13 caracteres.',
  //     });
  //     return;
  //   }
  
  //   if (this.usuario.usuNit.length !== 9) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el NIT',
  //       text: 'El NIT debe tener exactamente 9 caracteres.',
  //     });
  //     return;
  //   }
  
  //   // Validar formato de correo electrónico
  //   const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!correoValido.test(this.usuario.usuEmail)) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en el correo',
  //       text: 'El correo electrónico no es válido.',
  //     });
  //     return;
  //   }
  
  //   // Ajustar formato de fechas antes de enviar al backend
  //   this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0];
  //   this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];
  
  //   // Crear usuario (POST)
  //   console.log('Creando nuevo usuario...');
  //   this.usuarioService.crearUsuario(this.usuario).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Usuario creado',
  //         text: 'El nuevo usuario ha sido registrado exitosamente.',
  //       });
  //       this.cargarUsuarios();
  //       this.cerrarModal();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al crear',
  //         text: 'No se pudo registrar el usuario. Revisa los datos ingresados.',
  //       });
  //       console.error('Error al crear usuario:', error);
  //     }
  //   );
  // }
  // crearUsuario() {
  //   // Validar campos obligatorios
  //   if (!this.usuario.usuPNombre || !this.usuario.usuPApellido || !this.usuario.usuEmail) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en los datos',
  //       text: 'Todos los campos obligatorios deben llenarse.',
  //     });
  //     return;
  //   }
  
  //   // Validar fecha de nacimiento
  //   if (!this.usuario.usuFecNacimiento) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento es obligatoria.',
  //     });
  //     return;
  //   }
  
  //   const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
  //   const hoy = new Date();
  //   const fechaMaxima = new Date('2007-12-31');
  
  //   if (fechaNacimiento >= hoy) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
  //     });
  //     return;
  //   }
  
  //   if (fechaNacimiento > fechaMaxima) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la fecha de nacimiento',
  //       text: 'La fecha de nacimiento no puede ser posterior al 31 de diciembre de 2007.',
  //     });
  //     return;
  //   }
  
  //   // Cifrar la contraseña antes de enviarla
  //   const salt = bcrypt.genSaltSync(10); // Genera un salt
  //   this.usuario.usuContrasena = bcrypt.hashSync(this.usuario.usuContrasena, salt); // Cifra la contraseña
  
  //   // Ajustar formato de fechas antes de enviar al backend
  //   this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0];
  //   this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];
  
  //   // Crear usuario (POST)
  //   console.log('Creando nuevo usuario...');
  //   this.usuarioService.crearUsuario(this.usuario).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Usuario creado',
  //         text: 'El nuevo usuario ha sido registrado exitosamente.',
  //       });
  //       this.cargarUsuarios();
  //       this.cerrarModal();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error al crear',
  //         text: 'No se pudo registrar el usuario. Revisa los datos ingresados.',
  //       });
  //       console.error('Error al crear usuario:', error);
  //     }
  //   );
  // }
  crearUsuario() {
    // Validar campos obligatorios
    if (!this.usuario.usuPNombre || !this.usuario.usuPApellido || !this.usuario.usuEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Error en los datos',
        text: 'Todos los campos obligatorios deben llenarse.',
      });
      return;
    }
  
    // Validar fecha de nacimiento
    if (!this.usuario.usuFecNacimiento) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento es obligatoria.',
      });
      return;
    }
  
    const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
    const hoy = new Date();
    const fechaMaxima = new Date('2007-12-31');
  
    if (fechaNacimiento >= hoy) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
      });
      return;
    }
  
    if (fechaNacimiento > fechaMaxima) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento no puede ser posterior al 31 de diciembre de 2007.',
      });
      return;
    }
  
    // Cifrar la contraseña antes de enviarla
    const salt = bcrypt.genSaltSync(10); // Genera un salt
    this.usuario.usuContrasena = bcrypt.hashSync(this.usuario.usuContrasena, salt); // Cifra la contraseña
  
    // Ajustar formato de fechas antes de enviar al backend
    this.usuario.usuFecNacimiento = this.usuario.usuFecNacimiento.split('T')[0];
    this.usuario.usuFecIngreso = this.usuario.usuFecIngreso.split('T')[0];
  
    // Crear usuario (POST)
    this.usuarioService.crearUsuario(this.usuario).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El nuevo usuario ha sido registrado exitosamente.',
        });
        this.cargarUsuarios();
        this.cerrarModal();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'No se pudo registrar el usuario. Revisa los datos ingresados.',
        });
        console.error('Error al crear usuario:', error);
      }
    );
  }
  
  editarUsuario(usuario: any) {
    this.modalAbierto = true;
    this.editando = true;
    this.usuario = { ...usuario }; // Copia segura del usuario para edición
  }

  guardarUsuario() {
    this.formSubmitted = true;

    // Validar si todos los campos obligatorios están llenos
    if (!this.validarUsuario()) {
      Swal.fire({
        icon: 'error',
        title: 'Error en los datos',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    // Continuar con la lógica de guardar o crear usuario
    if (this.editando) {
      this.usuarioService
        .updateUsuario(this.usuario.usuId, this.usuario)
        .subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Usuario actualizado',
              text: 'Los cambios se guardaron correctamente.',
            });
            this.cargarUsuarios();
            this.cerrarModal();
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al actualizar',
              text: 'No se pudo actualizar el usuario. Revisa los datos ingresados.',
            });
            console.error('Error al actualizar usuario:', error);
          }
        );
    } else {
      this.usuarioService.crearUsuario(this.usuario).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El nuevo usuario ha sido registrado exitosamente.',
          });
          this.cargarUsuarios();
          this.cerrarModal();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: 'No se pudo registrar el usuario. Revisa los datos ingresados.',
          });
          console.error('Error al crear usuario:', error);
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

    this.usuariosFiltrados = this.usuarios.filter((usuario) => {
      const valor = usuario[this.filtroSeleccionado]?.toLowerCase() || '';
      return valor.includes(this.searchTerm.toLowerCase());
    });
  }
  // Mostrar/ocultar el menú de filtros

  validarUsuario(): boolean {
    if (
      !this.usuario.usuPNombre ||
      !this.usuario.usuPApellido ||
      !this.usuario.usuEmail
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error en los datos',
        text: 'Todos los campos obligatorios deben llenarse.',
      });
      return false;
    }

    if (!this.usuario.usuFecNacimiento) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento es obligatoria.',
      });
      return false;
    }
    
    const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
  const fechaMaxima = new Date('2007-12-31');
  if (fechaNacimiento > fechaMaxima) {
    Swal.fire({
      icon: 'error',
      title: 'Error en la fecha de nacimiento',
      text: 'La fecha de nacimiento no puede ser posterior al 31 de diciembre de 2007.',
    });
    return false;
  }

  const hoy = new Date();
  if (fechaNacimiento >= hoy) {
    Swal.fire({
      icon: 'error',
      title: 'Error en la fecha de nacimiento',
      text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
    });
    return false;
  }

    if (this.usuario.usuCui.length !== 13) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el DPI',
        text: 'El DPI debe tener exactamente 13 caracteres.',
      });
      return false;
    }

    if (this.usuario.usuNit.length !== 9) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el NIT',
        text: 'El NIT debe tener exactamente 9 caracteres.',
      });
      return false;
    }

    if (this.usuario.usuTelMovil.length !== 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el teléfono',
        text: 'El número telefónico debe tener exactamente 8 caracteres.',
      });
      return false;
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoValido.test(this.usuario.usuEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el correo',
        text: 'El correo electrónico no es válido.',
      });
      return false;
    }

    
   
    if (fechaNacimiento >= hoy) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la fecha de nacimiento',
        text: 'La fecha de nacimiento no puede ser hoy o en el futuro.',
      });
      return false;
    }

    return true;
  }

  deleteUsuario(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción eliminará el usuario permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.cargarUsuarios(); // Refrescar lista
            Swal.fire(
              'Eliminado',
              'El usuario fue eliminado con éxito.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el usuario.',
              'error'
            );
          },
        });
      }
    });
  }

  generarUsuarioId(): void {
    if (this.usuario.usuPNombre && this.usuario.usuPApellido) {
      const nombre = this.usuario.usuPNombre.trim().toLowerCase();
      const apellido = this.usuario.usuPApellido.trim().toLowerCase();
  
      // Toma las primeras 3 letras del nombre y las primeras 2 o 3 letras del apellido
      const nombreParte = nombre.substring(0, 3);
      const apellidoParte = apellido.length >= 3 ? apellido.substring(0, 3) : apellido.substring(0, 2);
  
      // Genera el usuario concatenando las partes
      this.usuario.usuId = `${nombreParte}${apellidoParte}`;
    }
  }

  fechaNacimientoValida(): boolean {
    if (!this.usuario.usuFecNacimiento) {
      return false;
    }
    const fechaNacimiento = new Date(this.usuario.usuFecNacimiento);
    const fechaMaxima = new Date('2007-12-31');
    return fechaNacimiento <= fechaMaxima;
  }

  // ✏️ Editar usuario
  editUsuario(usuario: any) {
    this.abrirModal(true, usuario); // 🔹 Abre el modal en modo edición
  }

  //obtener rol para log
}
