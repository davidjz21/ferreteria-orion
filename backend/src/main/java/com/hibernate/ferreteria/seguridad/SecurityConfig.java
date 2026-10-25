package com.hibernate.ferreteria.seguridad;

import com.hibernate.ferreteria.servicios.UsuarioServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final UsuarioServices userServices;

    public SecurityConfig(UsuarioServices userServices) {
        this.userServices = userServices;
    }

    // Encriptador de contraseñas BCrypt
    @Bean
    public PasswordEncoder codificaPass() {
        return new BCryptPasswordEncoder();
    }

    // Administrador de autenticacion de Spring
    @Bean
    public AuthenticationManager autenticacion(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // Cadena de filtros de seguridad HTTP
    @Bean
    public SecurityFilterChain securityChain(HttpSecurity http) throws Exception {
        http
                // Habilita CORS para permitir peticiones desde React (puerto 5173)
                .cors(Customizer.withDefaults())

                // Desactiva CSRF (no necesario en APIs REST stateless)
                .csrf(csrf -> csrf.disable())

                // Reglas de autorización por endpoint y metodo HTTP
                .authorizeHttpRequests(auth -> auth
                        // Cualquiera (incluso sin login) puede consultar los articulos
                        .requestMatchers(HttpMethod.GET, "/api/articulos/**").permitAll()

                        // Solo usuarios con rol ADMIN pueden CREAR, EDITAR o ELIMINAR articulos
                        .requestMatchers(HttpMethod.POST, "/api/articulos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/articulos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/articulos/**").hasRole("ADMIN")

                        // Cualquier otra peticion debe estar autenticada
                        .anyRequest().authenticated())

                // Habilita autenticacion HTTP Basic
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // Configuracion CORS para que el navegador no bloquee a React
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // URL de Vite
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}