package com.hibernate.ferreteria.servicios;

import com.hibernate.ferreteria.dto.ArticulosDTO;
import com.hibernate.ferreteria.entity.Articulos;
import com.hibernate.ferreteria.mapper.ArticuloMapper;
import com.hibernate.ferreteria.repositorios.Repo_articulos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticulosServices {
    @Autowired
    private Repo_articulos repo;

    public List<ArticulosDTO> serv_consulta() {
        return repo.findAll().stream().map(ArticuloMapper::toDTO)
                .collect(Collectors.toList());

    }

    public ArticulosDTO serv_buscaId(Long id) {
        Articulos articuloporid = repo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "articulo por id: " + id + "no encontrado"));
        return ArticuloMapper.toDTO(articuloporid);
    }

    public ArticulosDTO serv_inserta(ArticulosDTO dto) {
        Articulos articulo = ArticuloMapper.toEntity(dto);
        Articulos insertado = repo.save(articulo);
        return ArticuloMapper.toDTO(insertado);
    }

    public ArticulosDTO serv_actualiza (long id, ArticulosDTO dto) {
        Optional<Articulos> existe = repo.findById(id);

        if (existe.isPresent()) {
            Articulos articulo = existe.get();

            articulo.setNombreArticulo(dto.getNombreArticulo());
            articulo.setPrecio(dto.getPrecio());
            articulo.setExistencia(dto.getExistencia());

            Articulos actualizado = repo.save(articulo);

            return ArticuloMapper.toDTO(actualizado);

        } else {
            throw new RuntimeException("articulo no encontrado con id: " + id);
        }
    }

    public String eliminaArticulos(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "articulo eliminado";
        } else {
            return "articulo: " + id + " no encontrado";
        }
    }
}
