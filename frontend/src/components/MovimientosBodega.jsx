import { useState } from 'react';
import * as api from '../services/articuloService';
import Swal from 'sweetalert2';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Download, Trash, AlertCircle } from
    'lucide-react';

export default function MovimientosBodega({ articulos, onStockActualizado, esAdmin }) {
    // Formulario                                                                                     
    const [articuloId, setArticuloId] = useState('');
    const [tipo, setTipo] = useState('ENTRADA');
    const [cantidad, setCantidad] = useState(1);
    const [guardando, setGuardando] = useState(false);

    // Bitacora guardada en localStorage                                                              
    const [historial, setHistorial] = useState(() => {
        const guardado = localStorage.getItem('orion_bitacora');
        return guardado ? JSON.parse(guardado) : [];
    });

    const articuloSeleccionado = articulos.find((a) => String(a.id) === String(articuloId));

    // Registrar movimiento                                                                           
    const handleGuardar = async (e) => {
        e.preventDefault();

        if (!articuloSeleccionado) {
            Swal.fire({
                title: 'Atención', text: 'Selecciona un producto', icon: 'warning',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        const cant = Number(cantidad);
        if (cant <= 0) return;

        if (tipo === 'SALIDA' && cant > articuloSeleccionado.existencia) {
            Swal.fire({
                title: 'Stock insuficiente',
                text: `Solo hay ${articuloSeleccionado.existencia} unidades disponibles`,
                icon: 'error',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        const nuevoStock = tipo === 'ENTRADA'
            ? articuloSeleccionado.existencia + cant
            : articuloSeleccionado.existencia - cant;

        setGuardando(true);
        try {
            // Actualizar el stock en el backend                                                       
            await api.updateArticulo(articuloSeleccionado.id, {
                id: articuloSeleccionado.id,
                nombreArticulo: articuloSeleccionado.nombreArticulo,
                precio: articuloSeleccionado.precio,
                existencia: nuevoStock
            });

            const nuevoRegistro = {
                id: Date.now(),
                fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {
                    hour:
                        '2-digit', minute: '2-digit'
                }),
                producto: articuloSeleccionado.nombreArticulo,
                tipo: tipo,
                cantidad: cant,
                stockAnterior: articuloSeleccionado.existencia,
                stockNuevo: nuevoStock
            };

            const nuevoHistorial = [nuevoRegistro, ...historial];
            setHistorial(nuevoHistorial);
            localStorage.setItem('orion_bitacora', JSON.stringify(nuevoHistorial));

            Swal.fire({
                title: tipo === 'ENTRADA' ? '¡Entrada registrada!' : '¡Salida registrada!',
                text: `Stock de "${articuloSeleccionado.nombreArticulo}" actualizado a ${nuevoStock}        
            unidades.`,
                icon: 'success',
                confirmButtonColor: '#ea580c'
            });

            onStockActualizado();
            setCantidad(1);
        } catch {
            Swal.fire({
                title: 'Error', text: 'No se pudo actualizar el stock en el backend', icon:
                    'error', confirmButtonColor: '#ea580c'
            });
        } finally {
            setGuardando(false);
        }
    };

    const descargarExcel = () => {
        if (historial.length === 0) return;

        const encabezados = 'Fecha,Tipo,Producto,Cantidad,Stock Anterior,Stock Resultante\n';
        const filas = historial
            .map((r) =>
                `"${r.fecha}","${r.tipo}","${r.producto}",${r.cantidad},${r.stockAnterior},${r.stockNuevo}`)
            .join('\n');

        const blob = new Blob([encabezados + filas], { type: 'text/csv;charset=utf-8;' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = `bitacora_almacen_${new Date().toISOString().slice(0, 10)}.csv`;
        enlace.click();
    };

    const limpiarBitacora = () => {
        setHistorial([]);
        localStorage.removeItem('orion_bitacora');
    };

    return (
        <div className="row g-4">

            <div className="col-lg-5">
                <div className="card card-orion p-4">
                    <h4 className="fw-bold text-dark mb-1">Registrar Movimiento</h4>
                    <p className="text-muted small mb-4">Aumenta o descuenta inventario por compras o
                        bajas.</p>

                    {!esAdmin && (
                        <div className="alert alert-warning small d-flex align-items-center gap-2 mb-3">
                            <AlertCircle size={18} />
                            <span>Inicia sesión como administrador para modificar inventario.</span>
                        </div>
                    )}

                    <form onSubmit={handleGuardar}>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted">Operación</label>
                            <div className="btn-group w-100">
                                <button
                                    type="button"
                                    className={`btn ${tipo === 'ENTRADA' ? 'btn-success text-white fw-bold' :
                                        'btn-outline-secondary'}`}
                                    onClick={() => setTipo('ENTRADA')}
                                    disabled={!esAdmin}
                                >
                                    <ArrowDownLeft size={16} className="me-1" /> Entrada (+ Stock)
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${tipo === 'SALIDA' ? 'btn-danger text-white fw-bold' :
                                        'btn-outline-secondary'}`}
                                    onClick={() => setTipo('SALIDA')}
                                    disabled={!esAdmin}
                                >
                                    <ArrowUpRight size={16} className="me-1" /> Salida (- Stock)
                                </button>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="selectArticulo" className="form-label small fw-semibold               
                  text-muted">Artículo</label>
                            <select
                                id="selectArticulo"
                                className="form-select"
                                value={articuloId}
                                onChange={(e) => setArticuloId(e.target.value)}
                                disabled={!esAdmin}
                                required
                            >
                                <option value="">-- Selecciona un artículo --</option>
                                {articulos.map((art) => (
                                    <option key={art.id} value={art.id}>
                                        #{art.id} - {art.nombreArticulo} (Stock actual: {art.existencia})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputCantidad" className="form-label small fw-semibold                
                  text-muted">Cantidad</label>
                            <input
                                id="inputCantidad"
                                type="number"
                                min="1"
                                className="form-control"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                disabled={!esAdmin}
                                required
                            />
                        </div>

                        {articuloSeleccionado && (
                            <div className="bg-light p-3 rounded mb-3 border small">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Stock actual:</span>
                                    <strong>{articuloSeleccionado.existencia} u.</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Nuevo stock:</span>
                                    <strong className={tipo === 'ENTRADA' ? 'text-success' : 'text-danger'}>
                                        {tipo === 'ENTRADA'
                                            ? articuloSeleccionado.existencia + Number(cantidad || 0)
                                            : Math.max(0, articuloSeleccionado.existencia - Number(cantidad || 0))} u.
                                    </strong>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-orion w-100 py-2 d-flex align-items-center justify-content-center  
                  gap-2"
                            disabled={!esAdmin || guardando || !articuloId}
                        >
                            <CheckCircle2 size={18} />
                            <span>{guardando ? 'Guardando...' : 'Aplicar Movimiento'}</span>
                        </button>
                    </form>
                </div>
            </div>

            <div className="col-lg-7">
                <div className="card card-orion p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom 
              flex-wrap gap-2">
                        <div>
                            <h5 className="fw-bold text-dark mb-0">Bitácora de Movimientos</h5>
                            <small className="text-muted">Historial de entradas y salidas registradas</small>
                        </div>

                        {historial.length > 0 && (
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                                    onClick={descargarExcel}
                                    title="Descargar en formato CSV para Excel"
                                >
                                    <Download size={14} />
                                    <span>Excel (CSV)</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                                    onClick={limpiarBitacora}
                                    title="Vaciar historial"
                                >
                                    <Trash size={14} />
                                    <span>Limpiar</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {historial.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <p className="mb-0">Aún no hay movimientos registrados.</p>
                            <small>Usa el formulario de la izquierda para registrar entradas o salidas.</small>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0 small">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fecha y Hora</th>
                                        <th>Tipo</th>
                                        <th>Producto</th>
                                        <th className="text-center">Cant.</th>
                                        <th className="text-center">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.map((reg) => (
                                        <tr key={reg.id}>
                                            <td className="text-muted">{reg.fecha}</td>
                                            <td>
                                                <span className={`badge ${reg.tipo === 'ENTRADA' ? 'bg-success' :
                                                    'bg-danger'}`}>
                                                    {reg.tipo}
                                                </span>
                                            </td>
                                            <td className="fw-semibold text-dark">{reg.producto}</td>
                                            <td className="text-center fw-bold">
                                                {reg.tipo === 'ENTRADA' ? `+${reg.cantidad}` : `-${reg.cantidad}`}
                                            </td>
                                            <td className="text-center text-muted">
                                                {reg.stockAnterior} &rarr; <strong>{reg.stockNuevo}</strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}