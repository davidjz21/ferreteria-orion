import { Pencil, Trash2, Package, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function ArticuloTabla({ articulos, onEditar, onEliminar, esAdmin }) {
  if (!articulos || articulos.length === 0) {
    return (
      <div className="text-center py-5">
        <Package size={48} className="text-muted mb-3 opacity-50" />
        <h5 className="text-secondary fw-semibold">No se encontraron productos</h5>
        <p className="text-muted small mb-0">
          {esAdmin ? 'Agrega un nuevo artículo usando el botón superior.' : 'Catálogo temporalmente vacío.'}
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-orion align-middle">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>ID</th>
            <th>Producto</th>
            <th style={{ width: '150px' }}>Precio</th>
            <th style={{ width: '160px' }}>Stock</th>
            <th style={{ width: '180px' }} className="text-end">
              {esAdmin ? 'Acciones' : 'Modo'}
            </th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((art) => {
            const esStockBajo = art.existencia <= 5;

            return (
              <tr key={art.id}>
                <td className="text-muted fw-bold">#{art.id}</td>
                <td>
                  <span className="fw-semibold text-dark d-block">
                    {art.nombreArticulo}
                  </span>
                </td>
                <td>
                  <span className="fw-bold text-dark fs-6">
                    ${Number(art.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td>
                  <span className={esStockBajo ? 'badge-stock-low d-inline-flex align-items-center gap-1' : 'badge-stock-normal d-inline-flex align-items-center gap-1'}>
                    {esStockBajo && <AlertTriangle size={13} />}
                    {art.existencia} {art.existencia === 1 ? 'unidad' : 'unidades'}
                  </span>
                </td>
                <td className="text-end">
                  {esAdmin ? (
                    <div className="d-inline-flex gap-2">
                      <button
                        type="button"
                        className="btn-outline-orion"
                        title="Editar producto"
                        onClick={() => onEditar(art)}
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                        title="Eliminar producto"
                        onClick={() => onEliminar(art.id)}
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted small fst-italic">
                      Solo consulta
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}  