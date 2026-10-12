package com.hibernate.ferreteria.mapper;
import com.hibernate.ferreteria.dto.ArticulosDTO;
import com.hibernate.ferreteria.entity.Articulos;

public class ArticuloMapper {
    public static ArticulosDTO toDTO(Articulos articulo) {
        return new ArticulosDTO(
                articulo.getNombreArticulo(),
                articulo.getId(),
                articulo.getPrecio(),
                articulo.getExistencia()
        );
    }

    public static Articulos toEntity(ArticulosDTO dto) {
        Articulos articulo = new Articulos();
        articulo.setId((Long) dto.getId());
        articulo.setNombreArticulo(dto.getNombreArticulo());
        articulo.setPrecio(dto.getPrecio());
        articulo.setExistencia(dto.getExistencia());
        return articulo;
    }
}
