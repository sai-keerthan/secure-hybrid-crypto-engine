package com.shce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Provider;
import java.security.Security;
import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", "UP");
        status.put("application", "Secure Hybrid Crypto Engine");
        status.put("version", "2.0.0");
        status.put("timestamp", Instant.now().toString());
        status.put("javaVersion", System.getProperty("java.version"));

        // Verify Bouncy Castle providers are loaded
        List<String> bcProviders = Arrays.stream(Security.getProviders())
                .map(Provider::getName)
                .filter(name -> name.startsWith("BC"))
                .toList();
        status.put("cryptoProviders", bcProviders);

        return ResponseEntity.ok(status);
    }
}
