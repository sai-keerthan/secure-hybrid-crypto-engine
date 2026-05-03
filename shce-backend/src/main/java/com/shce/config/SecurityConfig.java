package com.shce.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Sprint 4 — S1, E1
 * Defines the Spring Security filter chain.
 *
 * Public endpoints (no API key required):
 *   GET  /api/v1/health    — monitoring tools
 *   OPTIONS /**            — CORS preflight
 *
 * All other endpoints require a valid X-API-Key header.
 */
@Slf4j
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${shce.api.key}")
    private String apiKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Stateless API — no sessions, no cookies
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Disable CSRF — stateless APIs don't need CSRF protection
                // (no browser session = no CSRF attack vector)
                .csrf(AbstractHttpConfigurer::disable)

                // Disable default form login and HTTP Basic — we use API key only
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // Authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Health check — public, no key required
                        .requestMatchers("/api/v1/health").permitAll()
                        // CORS preflight — must be unauthenticated
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // Register our API key filter before Spring's UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        new ApiKeyAuthFilter(apiKey),
                        UsernamePasswordAuthenticationFilter.class
                );

        log.info("Security filter chain initialized — API key authentication active");
        return http.build();
    }
}