package com.shce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Profile-aware origin control
        if ("dev".equals(activeProfile)) {
            config.setAllowedOrigins(List.of(
                    "https://localhost:5173",
                    "http://localhost:5173"
            ));
        } else {
            // Production: only allow explicitly configured origins via env var
            String allowedOrigins = System.getenv("SHCE_ALLOWED_ORIGINS");
            if (allowedOrigins != null && !allowedOrigins.isBlank()) {
                config.setAllowedOrigins(List.of(allowedOrigins.split(",")));
            }
        }

        config.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));

        // S4 fix: explicit headers only — never wildcard
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-API-Key"));

        // S4 fix: credentials false — no session cookies needed for stateless API
        config.setAllowCredentials(false);

        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}