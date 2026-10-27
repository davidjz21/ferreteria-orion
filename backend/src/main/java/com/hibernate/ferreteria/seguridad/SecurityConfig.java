package com.hibernate.ferreteria.seguridad;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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

    // Encriptador de contraseñas BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     * SecurityFilterChain: define que filtros y reglas de seguridad se ejecutan
     * HttpSecurity http: permite configurar esas reglas
     * throws Exception: indica que el método puede propagar excepciones comprobadas
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Verificacion de credenciales de admin
                        .requestMatchers("/api/articulos/auth/verificar").hasRole("ADMIN")
                        // Consulta publica de articulos en solo lectura
                        .requestMatchers(HttpMethod.GET, "/api/articulos/**").permitAll()
                        // Modificaciones de catalogo requieren rol ADMIN
                        .requestMatchers("/api/articulos/**").hasRole("ADMIN")
                        // Cualquier otra peticion debe estar autenticada
                        .anyRequest().authenticated())
                // Con HTTP Basic React puede enviar las credenciales en la peticion
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    // Configuracion de origenes permitidos para clientes de frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}