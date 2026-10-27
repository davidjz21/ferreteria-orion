import { NavLink } from 'react-router-dom';
import { Wrench, Package, ArrowLeftRight, LogIn, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ esAdmin, usuarioActual, onLogout, onAbrirLogin }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-orion shadow-sm py-2">
            <div className="container">

                <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2 mb-0 text-decoration-none">
                    <span className="bg-white text-dark p-2 rounded-3 shadow-sm d-flex">
                        <Wrench size={22} color="#ea580c" />
                    </span>
                    <div>
                        <span className="fw-bold fs-5 d-block lh-1 text-white">Ferretería Orion</span>
                        <small className="text-white-50" style={{ fontSize: '0.72rem' }}>Panel de Inventario</small>
                    </div>
                </NavLink>

                <div className="d-flex align-items-center flex-wrap gap-2 gap-sm-3">
                    <ul className="navbar-nav flex-row gap-1">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center gap-2 px-2 px-sm-3 py-2 rounded-3          
                                        ${isActive ? 'active-tab fw-bold' : 'text-white-50'}`
                                }
                            >
                                <Package size={18} />
                                <span>Catálogo & Stock</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/movimientos"
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center gap-2 px-2 px-sm-3 py-2 rounded-3          
                                        ${isActive ? 'active-tab fw-bold' : 'text-white-50'}`
                                }
                            >
                                <ArrowLeftRight size={18} />
                                <span>Entradas y Salidas</span>
                            </NavLink>
                        </li>
                    </ul>

                    <div>
                        {esAdmin ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-white text-dark py-2 px-3 rounded-pill d-inline-flex     
                                    align-items-center gap-1 shadow-sm">
                                    <ShieldCheck size={16} color="#ea580c" />
                                    <strong>{usuarioActual}</strong>
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-1"
                                    onClick={onLogout}
                                    title="Cerrar sesión"
                                >
                                    <LogOut size={15} />
                                    <span>Salir</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-light text-dark fw-semibold btn-sm d-inline-flex                
                                    align-items-center gap-2 px-3 shadow-sm"
                                onClick={onAbrirLogin}
                            >
                                <LogIn size={16} color="#ea580c" />
                                <span>Acceso Admin</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}