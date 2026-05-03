package com.shce.controller;

import com.shce.dto.request.CryptoRequest;
import com.shce.dto.response.CryptoResponse;
import com.shce.service.AlgoRouter;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/crypto")
@RequiredArgsConstructor
public class CryptoController {

    private final AlgoRouter algoRouter;

    // I6/R3: processingTimeMs only included when debug mode is enabled
    // AND the request comes from a trusted IP (localhost only)
    @Value("${shce.debug.enabled:false}")
    private boolean debugEnabled;

    @Value("${shce.debug.allowed-ips:127.0.0.1,0:0:0:0:0:0:0:1}")
    private String debugAllowedIps;

    private boolean isDebugAllowedForRequest(HttpServletRequest httpReq) {
        if (!debugEnabled) return false;
        String remoteIp = httpReq.getRemoteAddr();
        return List.of(debugAllowedIps.split(",")).contains(remoteIp);
    }

    @RateLimiter(name = "cryptoRateLimit")
    @PostMapping("/encrypt")
    public ResponseEntity<CryptoResponse> encrypt(
            @Valid @RequestBody CryptoRequest request, HttpServletRequest httpReq) {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        request.setOperation(com.shce.enums.CryptoOperation.ENCRYPT);
        CryptoResponse response = algoRouter.route(request);

        // Strip processingTimeMs unless debug is enabled for this IP
        if (!isDebugAllowedForRequest(httpReq)) {
            response.setProcessingTimeMs(null);
        }

        log.info("AUDIT requestId={} action=ENCRYPT algo={} ip={} principal={} success={}",
                requestId,
                request.getAlgorithm(),
                httpReq.getRemoteAddr(),
                httpReq.getUserPrincipal() != null ? httpReq.getUserPrincipal().getName() : "anonymous",
                response.isSuccess());

        return ResponseEntity.ok(response);
    }

    @RateLimiter(name = "cryptoRateLimit")
    @PostMapping("/decrypt")
    public ResponseEntity<CryptoResponse> decrypt(
            @Valid @RequestBody CryptoRequest request, HttpServletRequest httpReq) {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        request.setOperation(com.shce.enums.CryptoOperation.DECRYPT);
        CryptoResponse response = algoRouter.route(request);

        if (!isDebugAllowedForRequest(httpReq)) {
            response.setProcessingTimeMs(null);
        }

        log.info("AUDIT requestId={} action=DECRYPT algo={} ip={} principal={} success={}",
                requestId,
                request.getAlgorithm(),
                httpReq.getRemoteAddr(),
                httpReq.getUserPrincipal() != null ? httpReq.getUserPrincipal().getName() : "anonymous",
                response.isSuccess());

        return ResponseEntity.ok(response);
    }

    @RateLimiter(name = "cryptoRateLimit")
    @PostMapping("/sign")
    public ResponseEntity<CryptoResponse> sign(
            @Valid @RequestBody CryptoRequest request, HttpServletRequest httpReq) {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        request.setOperation(com.shce.enums.CryptoOperation.SIGN);
        CryptoResponse response = algoRouter.route(request);

        if (!isDebugAllowedForRequest(httpReq)) {
            response.setProcessingTimeMs(null);
        }

        log.info("AUDIT requestId={} action=SIGN algo={} ip={} principal={} success={}",
                requestId,
                request.getAlgorithm(),
                httpReq.getRemoteAddr(),
                httpReq.getUserPrincipal() != null ? httpReq.getUserPrincipal().getName() : "anonymous",
                response.isSuccess());

        return ResponseEntity.ok(response);
    }

    @RateLimiter(name = "cryptoRateLimit")
    @PostMapping("/verify")
    public ResponseEntity<CryptoResponse> verify(
            @Valid @RequestBody CryptoRequest request, HttpServletRequest httpReq) {
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        request.setOperation(com.shce.enums.CryptoOperation.VERIFY);
        CryptoResponse response = algoRouter.route(request);

        if (!isDebugAllowedForRequest(httpReq)) {
            response.setProcessingTimeMs(null);
        }
        log.info("AUDIT requestId={} action=VERIFY algo={} ip={} principal={} success={}",
                requestId,
                request.getAlgorithm(),
                httpReq.getRemoteAddr(),
                httpReq.getUserPrincipal() != null ? httpReq.getUserPrincipal().getName() : "anonymous",
                response.isSuccess());

        return ResponseEntity.ok(response);
    }
}