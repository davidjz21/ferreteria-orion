import { useState } from 'react';
import { X, Save, Edit3, PlusCircle, DollarSign, Boxes, Tag } from 'lucide-react';

export default function ArticuloModal({ articulo, onCerrar, onGuardar }) {
  const [formData, setFormData] = useState({
    nombreArticulo: articulo ? (articulo.nombreArticulo || '') : '',
    precio: articulo ? (articulo.precio ?? '') : '',
    existencia: articulo ? (articulo.existencia ?? '') : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombreArticulo.trim()) return;

    onGuardar({
      ...(articulo ? { id: articulo.id } : {}),
      nombreArticulo: formData.nombreArticulo.trim(),
      precio: parseFloat(formData.precio) || 0,
      existencia: parseInt(formData.existencia, 10) || 0
    });
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
      onClick={onCerrar}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content card-orion border-0 overflow-hidden shadow-lg">
          <div className="modal-header modal-header-orion px-4 py-3">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0">
              {articulo ? <Edit3 size={20} /> : <PlusCircle size={20} />}
              {articulo ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-link text-white text-decoration-none p-0 d-flex"
              onClick={onCerrar}
              title="Cerrar"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white">
              <div className="mb-3">
                <label htmlFor="nombreArticulo" className="form-label fw-semibold text-secondary small text-uppercase">
                  <Tag size={14} className="me-1 text-muted" /> Nombre del Producto
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg fs-6"
                  id="nombreArticulo"
                  name="nombreArticulo"
                  value={formData.nombreArticulo}
                  onChange={handleChange}
                  placeholder="Ej. Martillo de bola 16oz"
                  required
                  autoFocus
                />
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="precio" className="form-label fw-semibold text-secondary small text-uppercase">
                    <DollarSign size={14} className="me-1 text-muted" /> Precio Unitario
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted">$</span>
                    <input
                      type="number"
                      className="form-control border-start-0 ps-1"
                      id="precio"
                      name="precio"
                      step="0.01"
                      min="0"
                      value={formData.precio}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label htmlFor="existencia" className="form-label fw-semibold text-secondary small text-uppercase">
                    <Boxes size={14} className="me-1 text-muted" /> Existencia (Stock)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="existencia"
                    name="existencia"
                    min="0"
                    value={formData.existencia}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3 border-top">
              <button type="button" className="btn btn-outline-secondary px-3" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn-orion">
                <Save size={16} />
                {articulo ? 'Guardar Cambios' : 'Registrar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}