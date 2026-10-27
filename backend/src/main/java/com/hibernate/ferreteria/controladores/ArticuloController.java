package com.hibernate.ferreteria.controladores;

import com.hibernate.ferreteria.dto.ArticulosDTO;
import com.hibernate.ferreteria.servicios.ArticulosServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    @Autowired
    private ArticulosServices servicio;

    // Endpoint para verificar si las credenciales son validas
    @GetMapping("/auth/verificar")
    public Map<String, Object> verificarAuth(Authentication authentication) {
        return Map.of(
                "autenticado", true,
                "usuario", authentication.getName(),
                "roles",
                authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
    }

    @GetMapping
    public List<ArticulosDTO> listar() {
        return servicio.serv_consulta();
    }

    @GetMapping("/{id}")
    public ArticulosDTO buscaId(@PathVariable Long id) {
        return servicio.serv_buscaId(id);
    }

    @PostMapping
    public ArticulosDTO insertaArticulo(@RequestBody ArticulosDTO dto) {
        return servicio.serv_inserta(dto);
    }

    @PutMapping("/{id}")
    public ArticulosDTO actualizaArticulo(@PathVariable Long id, @RequestBody ArticulosDTO dto) {
        return servicio.serv_actualiza(id, dto);
    }

    @DeleteMapping("/{id}")
    public String borrarArticulos(@PathVariable Long id) {
        return servicio.eliminaArticulos(id);
    }
}
