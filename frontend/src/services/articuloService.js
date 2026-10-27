const API_URL = "http://localhost:8080/api/articulos";

// Manejo de credenciales en localStorage                                                           
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

// Cabecera Basic Auth                                                                              
const getAuthHeaders = () => {
    const token = localStorage.getItem("orion_auth");
    return token ? { "Authorization": `Basic ${token}` } : {};
};

// Peticiones a la API REST de Spring Boot                                                          
export const getArticulos = async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener artículos");
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
    if (!res.ok) throw new Error("Error al eliminar artículo");
    return res.text();
};

// Verificar credenciales del administrador                                                         
export const verificarCredenciales = async (usuario, password) => {
    const credencialBase64 = btoa(`${usuario}:${password}`);
    const res = await fetch(`${API_URL}/auth/verificar`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${credencialBase64}`
        }
    });

    if (!res.ok) {
        throw new Error("Usuario o contraseña incorrectos");
    }
    return res.json();
};