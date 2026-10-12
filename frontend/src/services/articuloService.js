const API_URL = "http://localhost:8080/api/articulos"

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo)
    });
    if (!res.ok) throw new Error("Error al crear artículo");
    return res.json();
};

export const updateArticulo = async (id, articulo) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo)
    });
    if (!res.ok) throw new Error("Error al actualizar artículo");
    return res.json();
};

export const deleteArticulo = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar artículo");
    return res.text();
}; 