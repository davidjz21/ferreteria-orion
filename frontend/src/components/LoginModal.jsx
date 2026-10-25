import { useState } from 'react';
import { Lock, User, LogIn, X } from 'lucide-react';

export default function LoginModal({ onCerrar, onLoginExitoso }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!usuario.trim() || !password.trim()) return;
        onLoginExitoso(usuario.trim(), password);
    };

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}
        >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
                <div className="modal-content card-orion shadow-lg border-0 overflow-hidden">
                    <div className="modal-header modal-header-orion py-3 px-4 d-flex align-items-center       
  justify-content-between">
                        <h5 className="modal-title text-white fw-bold d-flex align-items-center gap-2 mb-0 fs-  
  5">
                            <Lock size={20} />
                            Acceso Administrativo
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            aria-label="Cerrar"
                            onClick={onCerrar}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <p className="text-muted small mb-3">
                                Inicia sesión con tu cuenta de administrador para gestionar productos del catálogo.
                            </p>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Usuario</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted">
                                        <User size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej. user1"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label fw-semibold small text-dark">Contraseña</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted">
                                        <Lock size={16} />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer bg-light px-4 py-3 d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-light border text-secondary"
                                onClick={onCerrar}
                            >
                                <X size={16} className="me-1" />
                                Cancelar
                            </button>
                            <button type="submit" className="btn-orion">
                                <LogIn size={16} />
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 