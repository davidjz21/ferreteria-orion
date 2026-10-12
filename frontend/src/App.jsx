import { useState, useEffect, useMemo } from 'react';
import * as api from './services/articuloService';
import ArticuloTabla from './components/ArticuloTabla';
import ArticuloModal from './components/ArticuloModal';
import Swal from 'sweetalert2';
import { Wrench, Plus, RefreshCw, Search, Package, Boxes, AlertTriangle } from 'lucide-react';
import './App.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function App() {
  const [articulos, setArticulos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);

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

  // Filtrado reactivo en tiempo real
  const articulosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return articulos;
    const termino = busqueda.toLowerCase().trim();
    return articulos.filter(
      (a) =>
        a.nombreArticulo.toLowerCase().includes(termino) ||
        String(a.id).includes(termino)
    );
  }, [articulos, busqueda]);

  // Métricas rápidas
  const totalStock = useMemo(() => {
    return articulos.reduce((acc, curr) => acc + (Number(curr.existencia) || 0), 0);
  }, [articulos]);

  const bajoStockCount = useMemo(() => {
    return articulos.filter((a) => (Number(a.existencia) || 0) <= 5).length;
  }, [articulos]);

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción removerá el artículo de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
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
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el artículo',
          icon: 'error',
          confirmButtonColor: '#ea580c'
        });
      }
    }
  };

  const handleGuardar = async (formData) => {
    try {
      if (formData.id) {
        await api.updateArticulo(formData.id, formData);
        Swal.fire({
          title: 'Actualizado',
          text: 'Producto modificado exitosamente',
          icon: 'success',
          confirmButtonColor: '#ea580c',
          timer: 1800
        });
      } else {
        await api.createArticulo(formData);
        Swal.fire({
          title: 'Registrado',
          text: 'Nuevo producto agregado al catálogo',
          icon: 'success',
          confirmButtonColor: '#ea580c',
          timer: 1800
        });
      }
      setModalAbierto(false);
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

  return (
    <>
      {/* Barra de Navegación Principal */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-orion shadow-sm py-2">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center gap-2 mb-0">
            <span className="bg-white text-dark p-2 rounded-3 shadow-sm d-flex">
              <Wrench size={22} color="#ea580c" />
            </span>
            <div>
              <span className="fw-bold fs-4 d-block lh-1 text-white">Ferretería Orion</span>
              <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Gestión de Inventario & Ventas</small>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container my-4 flex-grow-1">
        {/* Fila de Metricas / KPIs */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-primary">
                <Package size={26} color="#ea580c" />
              </div>
              <div>
                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Artículos Registrados
                </small>
                <h3 className="mb-0 fw-bold text-dark">{articulos.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-success">
                <Boxes size={26} color="#16a34a" />
              </div>
              <div>
                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Existencias Totales
                </small>
                <h3 className="mb-0 fw-bold text-dark">{totalStock} <span className="fs-6 text-muted fw-normal">unidades</span></h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card d-flex align-items-center gap-3">
              <div className="p-3 bg-light rounded-circle text-warning">
                <AlertTriangle size={26} color="#dc2626" />
              </div>
              <div>
                <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                  Stock Crítico (≤ 5)
                </small>
                <h3 className="mb-0 fw-bold text-dark">{bajoStockCount} <span className="fs-6 text-muted fw-normal">productos</span></h3>
              </div>
            </div>
          </div>
        </div>

        {/* Panel del Catalogo de Productos */}
        <div className="card card-orion p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 border-bottom">
            <div>
              <h4 className="fw-bold text-dark mb-1">Catálogo de Productos</h4>
              <p className="text-muted small mb-0">Consulta, agrega o actualiza los artículos en bodega.</p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                onClick={cargarArticulos}
                disabled={cargando}
                title="Actualizar datos"
              >
                <RefreshCw size={16} />
                <span>{cargando ? 'Cargando...' : 'Recargar'}</span>
              </button>

              <button
                type="button"
                className="btn-orion"
                onClick={() => {
                  setArticuloSeleccionado(null);
                  setModalAbierto(true);
                }}
              >
                <Plus size={18} />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Barra de Busqueda Rapida */}
          <div className="row mb-3">
            <div className="col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-1"
                  placeholder="Buscar por nombre o ID..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button
                    className="btn btn-outline-secondary border-start-0"
                    type="button"
                    onClick={() => setBusqueda('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabla de Articulos */}
          <ArticuloTabla
            articulos={articulosFiltrados}
            onEditar={(art) => {
              setArticuloSeleccionado(art);
              setModalAbierto(true);
            }}
            onEliminar={handleEliminar}
          />
        </div>
      </main>

      <footer className="text-center py-3 text-muted small border-top bg-white mt-auto">
        Ferretería Orion &copy; {CURRENT_YEAR} &mdash; Control de Inventario
      </footer>

      {modalAbierto && (
        <ArticuloModal
          key={articuloSeleccionado ? articuloSeleccionado.id : 'nuevo'}
          articulo={articuloSeleccionado}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={handleGuardar}
        />
      )}
    </>
  );
}