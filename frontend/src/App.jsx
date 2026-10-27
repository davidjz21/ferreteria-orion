import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as api from './services/articuloService';
import Navbar from './components/Navbar';
import Catalogo from './components/Catalogo';
import MovimientosBodega from './components/MovimientosBodega';
import ArticuloModal from './components/ArticuloModal';
import LoginModal from './components/LoginModal';
import './App.css';

export default function App() {
  const [articulos, setArticulos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(api.obtenerUsuarioSesion());

  const [modalArticuloAbierto, setModalArticuloAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [modalLoginAbierto, setModalLoginAbierto] = useState(false);

  const esAdmin = Boolean(usuarioActual);

  // Cargar artículos desde la API                                                                  
  const cargarArticulos = async () => {
    setCargando(true);
    try {
      const data = await api.getArticulos();
      setArticulos(data);
    } catch {
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
        icon: 'error',
        confirmButtonColor: '#ea580c'
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  const iniciarSesion = (user, pass) => {
    api.guardarSesion(user, pass);
    setUsuarioActual(user);
    setModalLoginAbierto(false);
    Swal.fire({
      title: 'Sesión iniciada',
      text: `Bienvenido administrador ${user}`,
      icon: 'success',
      confirmButtonColor: '#ea580c',
      timer: 2000
    });
  };

  const cerrarSesion = () => {
    api.cerrarSesion();
    setUsuarioActual(null);
    Swal.fire({
      title: 'Sesión finalizada',
      text: 'Has vuelto al modo de solo lectura',
      icon: 'info',
      confirmButtonColor: '#ea580c',
      timer: 1800
    });
  };

  const guardarArticulo = async (datosArticulo) => {
    try {
      if (datosArticulo.id) {
        await api.updateArticulo(datosArticulo.id, datosArticulo);
        Swal.fire({
          title: 'Actualizado',
          text: 'Producto modificado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ea580c',
          timer: 1800
        });
      } else {
        await api.createArticulo(datosArticulo);
        Swal.fire({
          title: 'Registrado',
          text: 'Nuevo producto agregado al catálogo',
          icon: 'success',
          confirmButtonColor: '#ea580c',
          timer: 1800
        });
      }
      setModalArticuloAbierto(false);
      cargarArticulos();
    } catch {
      Swal.fire({
        title: 'Error al guardar',
        text: 'Revisa los datos e intenta nuevamente',
        icon: 'error',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  const eliminarArticulo = async (id) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción removerá el artículo de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
      try {
        await api.deleteArticulo(id);
        Swal.fire({
          title: 'Eliminado',
          text: 'Artículo eliminado correctamente',
          icon: 'success',
          confirmButtonColor: '#ea580c',
          timer: 1800
        });
        cargarArticulos();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo eliminar el artículo',
          icon: 'error',
          confirmButtonColor: '#ea580c'
        })
      }
    }
  }

  return (
    <>
      <Navbar
        esAdmin={esAdmin}
        usuarioActual={usuarioActual}
        onLogout={cerrarSesion}
        onAbrirLogin={() => setModalLoginAbierto(true)}
      />

      <main className="container my-4 flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <Catalogo
                articulos={articulos}
                cargando={cargando}
                esAdmin={esAdmin}
                onRecargar={cargarArticulos}
                onNuevoProducto={() => {
                  setArticuloSeleccionado(null);
                  setModalArticuloAbierto(true);
                }}
                onEditarProducto={(art) => {
                  setArticuloSeleccionado(art);
                  setModalArticuloAbierto(true);
                }}
                onEliminarProducto={eliminarArticulo}
              />
            }
          />
          <Route
            path="/movimientos"
            element={
              <MovimientosBodega
                articulos={articulos}
                onStockActualizado={cargarArticulos}
                esAdmin={esAdmin}
              />
            }
          />
        </Routes>
      </main>

      <footer className="text-center py-3 text-muted small border-top bg-white mt-auto">
        Ferretería Orion @2026 - Control de inventarios
      </footer>

      {modalArticuloAbierto && (
        <ArticuloModal
          key={articuloSeleccionado ? articuloSeleccionado.id : 'nuevo'}
          articulo={articuloSeleccionado}
          onCerrar={() => setModalArticuloAbierto(false)}
          onGuardar={guardarArticulo}
        />
      )}

      {modalLoginAbierto && (
        <LoginModal
          onCerrar={() => setModalLoginAbierto(false)}
          onLoginExitoso={iniciarSesion}
        />
      )}
    </>
  );
}