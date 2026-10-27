import React from 'react';
import { Package, Boxes, AlertTriangle } from 'lucide-react';

export default function Metricas({ articulos = [] }) {
    const totalArticulos = articulos.length
    const existenciasTotales = articulos.reduce((total, art) => total + (Number(art.existencia) || 0), 0)
    const stockCritico = articulos.filter((art) => (Number(art.existencia) || 0) <= 5).length

    return (
        <div className="row g-3 mb-4">
            <div className="col-md-4">
                <div className="stat-card d-flex align-items-center gap-3">
                    <div className="p-3 bg-light rounded-circle text-primary">
                        <Package size={26} color="#ea580c"></Package>
                    </div>
                    <div>
                        <small className="text-muted text-uppercase fw-semibold" style={{
                            fontSize: '0.75rem'
                        }}>
                            Artículos Registrados
                        </small>
                        <h3 className="mb-0 fw-bold text-dark">{totalArticulos}</h3>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="stat-card d-flex align-items-center gap-3">
                    <div className="p-3 bg-light rounded-circle text-success">
                        <Boxes size={26} color="#16a34a" />
                    </div>
                    <div>
                        <small className="text-muted text-uppercase fw-semibold" style={{
                            fontSize: '0.75rem'
                        }}>
                            Existencias Totales
                        </small>
                        <h3 className="mb-0 fw-bold text-dark">
                            {existenciasTotales} <span className="fs-6 text-muted fw-normal">unidades</span>
                        </h3>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="stat-card d-flex align-items-center gap-3">
                    <div className="p-3 bg-light rounded-circle text-warning">
                        <AlertTriangle size={26} color="#dc2626" />
                    </div>
                    <div>
                        <small className="text-muted text-uppercase fw-semibold" style={{
                            fontSize: '0.75rem'
                        }}>
                            Stock Crítico (≤ 5)
                        </small>
                        <h3 className="mb-0 fw-bold text-dark">
                            {stockCritico} <span className="fs-6 text-muted fw-normal">productos</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
