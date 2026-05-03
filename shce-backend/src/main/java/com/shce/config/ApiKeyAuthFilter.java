package com.shce.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Sprint 4 — S1, E1
 * Validates the X-API-Key header on every protected request.
 * Public paths (health, CORS preflight) are excluded via shouldNotFilter().
 */
@Slf4j
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-Key";

    private final String validApiKey;

    public ApiKeyAuthFilter(String validApiKey) {
        this.validApiKey = validApiKey;
    }

    /**
     * Paths listed here are completely skipped by this filter.
     * No API key check — no authentication required.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Health check — always public
        if ("/api/v1/health".equals(path)) return true;

        // CORS preflight — must never require auth
        if (HttpMethod.OPTIONS.matches(method)) return true;

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestKey = request.getHeader(API_KEY_HEADER);

        if (validApiKey.equals(requestKey)) {
            var auth = new UsernamePasswordAuthenticationToken(
                    "api-client",
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_API_USER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            log.debug("AUTH ok ip={} path={}",
                    request.getRemoteAddr(), request.getRequestURI());
            filterChain.doFilter(request, response);

        } else {
            log.warn("AUTH failed ip={} path={} keyPresent={}",
                    request.getRemoteAddr(),
                    request.getRequestURI(),
                    requestKey != null);

            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("""
                    {
                      "status": 401,
                      "error": "Unauthorized",
                      "message": "Missing or invalid API key. Include X-API-Key header."
                    }
                    """);
        }
    }
}