import { useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import Metricas from './Metricas';
import ArticuloTabla from './ArticuloTabla';

export default function Catalogo({
    articulos,
    cargando,
    esAdmin,
    onRecargar,
    onNuevoProducto,
    onEditarProducto,
    onEliminarProducto
}) {
    const [busqueda, setBusqueda] = useState('');

    // Filtrar articulos por nombre o ID                                                             
    const termino = busqueda.toLowerCase().trim();
    const articulosFiltrados = termino
        ? articulos.filter((art) =>
            art.nombreArticulo.toLowerCase().includes(termino) ||
            String(art.id).includes(termino)
        )
        : articulos;

    return (
        <>
            {/* Tarjetas de estadisticas */}
            <Metricas articulos={articulos} />

            {/* Contenedor del catalogo */}
            <div className="card card-orion p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 pb-3 
            border-bottom">
                    <div>
                        <h4 className="fw-bold text-dark mb-1">Catálogo de Productos</h4>
                        <p className="text-muted small mb-0">Consulta, agrega o actualiza los artículos en
                            bodega.</p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                            onClick={onRecargar}
                            disabled={cargando}
                        >
                            <RefreshCw size={16} />
                            <span>{cargando ? 'Cargando...' : 'Recargar'}</span>
                        </button>

                        {esAdmin && (
                            <button
                                type="button"
                                className="btn-orion"
                                onClick={onNuevoProducto}
                            >
                                <Plus size={18} />
                                <span>Nuevo Producto</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Buscador */}
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

                <ArticuloTabla
                    articulos={articulosFiltrados}
                    esAdmin={esAdmin}
                    onEditar={onEditarProducto}
                    onEliminar={onEliminarProducto}
                />
            </div>
        </>
    )
}