package com.shce.controller;

import com.shce.dto.request.KeyGenRequest;
import com.shce.dto.response.KeyGenResponse;
import com.shce.enums.Algorithm;
import com.shce.enums.CryptoMode;
import com.shce.service.keygen.KeyGenService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/keys")
@RequiredArgsConstructor
public class KeyGenController {

    private final KeyGenService keyGenService;

    /**
     * Generate a key pair for the specified algorithm.
     */
    @RateLimiter(name = "keyGenRateLimit")
    @PostMapping("/generate")
    public ResponseEntity<KeyGenResponse> generateKey(
            @Valid @RequestBody KeyGenRequest request, HttpServletRequest httpReq) {
        log.info("AUDIT requestId={} action=KEY_GEN algo={} ip={} principal={} success=true",
                UUID.randomUUID().toString().substring(0, 8),
                request.getAlgorithm(),
                httpReq.getRemoteAddr(),
                httpReq.getUserPrincipal() != null ? httpReq.getUserPrincipal().getName() : "anonymous");        KeyGenResponse response = keyGenService.generateKey(request);
        return ResponseEntity.ok(response);
    }

    /**
     * List all available algorithms, optionally filtered by mode.
     */
    @GetMapping("/algorithms")
    public ResponseEntity<Map<String, List<AlgorithmInfo>>> listAlgorithms(
            @RequestParam(required = false) CryptoMode mode) {

        var algorithms = Arrays.stream(Algorithm.values())
                .filter(a -> mode == null || a.getMode() == mode)
                .map(a -> new AlgorithmInfo(
                        a.name(),
                        a.getFamily(),
                        a.getMode(),
                        a.getParameterSize(),
                        a.isSymmetric(),
                        a.getSupportedOperations().stream()
                                .map(Enum::name)
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.groupingBy(a -> a.mode().name()));

        return ResponseEntity.ok(algorithms);
    }

    /**
     * Simple record for algorithm metadata in the listing endpoint.
     */
    record AlgorithmInfo(
            String name,
            String family,
            CryptoMode mode,
            int parameterSize,
            boolean symmetric,
            java.util.Set<String> supportedOperations
    ) {}
}
