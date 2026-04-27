package com.shce.service;

import com.shce.dto.request.CryptoRequest;
import com.shce.dto.response.CryptoResponse;
import com.shce.enums.CryptoMode;
import com.shce.exception.CryptoOperationException;
import com.shce.service.classical.ClassicalCryptoService;
import com.shce.service.pqc.PQCryptoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlgoRouter {

    private final ClassicalCryptoService classicalCryptoService;
    private final PQCryptoService pqCryptoService;

    /**
     * Routes the crypto request to the appropriate service based on algorithm mode.
     */
    public CryptoResponse route(CryptoRequest request) {
        if (request.getOperation() == null) {
            throw new CryptoOperationException("Operation must not be null");
        }

        CryptoMode mode = request.getAlgorithm().getMode();

        log.info("Routing {} {} via {} path",
                request.getAlgorithm(), request.getOperation(), mode);

        return switch (mode) {
            case CLASSICAL -> classicalCryptoService.execute(request);
            case POST_QUANTUM -> pqCryptoService.execute(request);
        };
    }
}
