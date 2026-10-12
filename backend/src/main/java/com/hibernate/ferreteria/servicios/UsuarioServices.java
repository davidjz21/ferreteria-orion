package com.hibernate.ferreteria.servicios;

import com.hibernate.ferreteria.repositorios.Repo_usuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServices implements UserDetailsService {
    @Autowired
    private Repo_usuarios repoUsuarios;

    @Override
    public UserDetails loadUserByUsername(String nombreUsuario)
                throws UsernameNotFoundException {
            var usuario = repoUsuarios.findByUsuario(nombreUsuario)
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado " + nombreUsuario));
            return new User(
                    usuario.getUsuario(),
                    usuario.getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol())));
    }
}
