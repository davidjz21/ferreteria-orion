import { useState } from 'react';
import { X } from 'lucide-react';

export default function ArticuloModal({ articulo, onCerrar, onGuardar }) {
  const [nombre, setNombre] = useState(articulo ? articulo.nombreArticulo : '');
  const [precio, setPrecio] = useState(articulo ? articulo.precio : '');
  const [existencia, setExistencia] = useState(articulo ? articulo.existencia : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    onGuardar({
      ...(articulo ? { id: articulo.id } : {}),
      nombreArticulo: nombre.trim(),
      precio: parseFloat(precio) || 0,
      existencia: parseInt(existencia, 10) || 0
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content card-orion border-0 shadow">
          {/* Cabecera del modal */}
          <div className="modal-header modal-header-orion px-4 py-3">
            <h5 className="modal-title fw-bold text-white mb-0">
              {articulo ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h5>
            <button type="button" className="btn btn-sm text-white p-0" onClick={onCerrar}>
              <X size={22} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white">
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Nombre del
                  Producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Martillo de bola"
                  required
                  autoFocus
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Precio Unitario
                    ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    step="0.01"
                    min="0"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary small">Stock /
                    Existencia</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={existencia}
                    onChange={(e) => setExistencia(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer px-4 py-3 bg-light border-0">
              <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-orion">
                {articulo ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 