package com.shce.controller;

import com.shce.dto.request.CryptoRequest;
import com.shce.dto.response.CryptoResponse;
import com.shce.service.AlgoRouter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/crypto")
@RequiredArgsConstructor
public class CryptoController {

    private final AlgoRouter algoRouter;

    /**
     * Encrypt data using the specified algorithm and public key.
     */
    @PostMapping("/encrypt")
    public ResponseEntity<CryptoResponse> encrypt(
            @Valid @RequestBody CryptoRequest request) {
        request.setOperation(com.shce.enums.CryptoOperation.ENCRYPT);
        log.info("Encrypt request: algorithm={}", request.getAlgorithm());
        return ResponseEntity.ok(algoRouter.route(request));
    }

    /**
     * Decrypt data using the specified algorithm and private key.
     */
    @PostMapping("/decrypt")
    public ResponseEntity<CryptoResponse> decrypt(
            @Valid @RequestBody CryptoRequest request) {
        request.setOperation(com.shce.enums.CryptoOperation.DECRYPT);
        log.info("Decrypt request: algorithm={}", request.getAlgorithm());
        return ResponseEntity.ok(algoRouter.route(request));
    }

    /**
     * Sign data using the specified algorithm and private key.
     */
    @PostMapping("/sign")
    public ResponseEntity<CryptoResponse> sign(
            @Valid @RequestBody CryptoRequest request) {
        request.setOperation(com.shce.enums.CryptoOperation.SIGN);
        log.info("Sign request: algorithm={}", request.getAlgorithm());
        return ResponseEntity.ok(algoRouter.route(request));
    }

    /**
     * Verify a signature using the specified algorithm and public key.
     */
    @PostMapping("/verify")
    public ResponseEntity<CryptoResponse> verify(
            @Valid @RequestBody CryptoRequest request) {
        request.setOperation(com.shce.enums.CryptoOperation.VERIFY);
        log.info("Verify request: algorithm={}", request.getAlgorithm());
        return ResponseEntity.ok(algoRouter.route(request));
    }

    /**
     * Generic endpoint — operation is specified in the request body.
     */
    @PostMapping("/execute")
    public ResponseEntity<CryptoResponse> execute(
            @Valid @RequestBody CryptoRequest request) {
        log.info("Execute request: algorithm={}, operation={}",
                request.getAlgorithm(), request.getOperation());
        return ResponseEntity.ok(algoRouter.route(request));
    }
}
