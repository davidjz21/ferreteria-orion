package com.hibernate.ferreteria.repositorios;
import com.hibernate.ferreteria.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface Repo_usuarios extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);
}
