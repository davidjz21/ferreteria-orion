const API_URL = "http://localhost:8080/api/articulos"

// Funciones para gestionar la sesión en el navegador                                               
export const guardarSesion = (usuario, password) => {
    const credencialBase64 = btoa(`${usuario}:${password}`);
    localStorage.setItem("orion_auth", credencialBase64);
    localStorage.setItem("orion_usuario", usuario);
};

export const obtenerUsuarioSesion = () => {
    return localStorage.getItem("orion_usuario");
};

export const cerrarSesion = () => {
    localStorage.removeItem("orion_auth");
    localStorage.removeItem("orion_usuario");
};

// Genera la cabecera Authorization si hay una sesion activa                                        
const getAuthHeaders = () => {
    const token = localStorage.getItem("orion_auth");
    return token ? { "Authorization": `Basic ${token}` } : {};
};

export const getArticulos = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener artículos");
    return res.json();
};

export const getArticuloById = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Artículo no encontrado");
    return res.json();
};

export const createArticulo = async (articulo) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(articulo)
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error("No tienes permisos de Administrador para crear productos");
    }
    if (!res.ok) throw new Error("Error al crear artículo");
    return res.json();
};

export const updateArticulo = async (id, articulo) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(articulo)
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error("No tienes permisos de Administrador para editar");
    }
    if (!res.ok) throw new Error("Error al actualizar artículo");
    return res.json();
};

export const deleteArticulo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders()
        }
    });
    if (res.status === 401 || res.status === 403) {
        throw new Error("No tienes permisos de Administrador para eliminar");
    }
    if (!res.ok) throw new Error("Error al eliminar artículo");
    return res.text();
}; 