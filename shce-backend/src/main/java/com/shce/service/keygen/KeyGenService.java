package com.shce.service.keygen;

import com.shce.dto.request.KeyGenRequest;
import com.shce.dto.response.KeyGenResponse;
import com.shce.enums.Algorithm;
import com.shce.exception.CryptoOperationException;
import com.shce.util.PemUtil;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jcajce.spec.MLDSAParameterSpec;
import org.bouncycastle.jcajce.spec.MLKEMParameterSpec;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;
import java.util.stream.Collectors;

@Slf4j
@Service
public class KeyGenService {

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate a key pair (or symmetric key for AES) based on the requested algorithm.
     */
    public KeyGenResponse generateKey(KeyGenRequest request) {
        Algorithm algorithm = request.getAlgorithm();
        log.info("Generating key for algorithm: {}", algorithm);

        long startTime = System.currentTimeMillis();

        try {
            return switch (algorithm.getFamily()) {
                case "RSA" -> generateRsaKeyPair(algorithm);
                case "EC" -> generateEcKeyPair(algorithm);
                case "AES" -> generateAesKey(algorithm);
                case "ML-KEM" -> generateMlKemKeyPair(algorithm);
                case "ML-DSA" -> generateMlDsaKeyPair(algorithm);
                default -> throw new CryptoOperationException(
                        "Unsupported algorithm family: " + algorithm.getFamily());
            };
        } catch (CryptoOperationException e) {
            throw e;
        } catch (Exception e) {
            throw new CryptoOperationException(
                    "Key generation failed for " + algorithm + ": " + e.getMessage(), e);
        } finally {
            long elapsed = System.currentTimeMillis() - startTime;
            log.info("Key generation for {} completed in {} ms", algorithm, elapsed);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CLASSICAL KEY GENERATION
    // ═══════════════════════════════════════════════════════════════

    private KeyGenResponse generateRsaKeyPair(Algorithm algorithm) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA", "BC");
        kpg.initialize(algorithm.getParameterSize(), secureRandom);
        KeyPair keyPair = kpg.generateKeyPair();

        return buildAsymmetricResponse(algorithm, keyPair);
    }

    private KeyGenResponse generateEcKeyPair(Algorithm algorithm) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
        String curveName = algorithm.getParameterSize() == 256 ? "P-256" : "P-384";
        kpg.initialize(new ECGenParameterSpec(curveName), secureRandom);
        KeyPair keyPair = kpg.generateKeyPair();

        return buildAsymmetricResponse(algorithm, keyPair);
    }

    private KeyGenResponse generateAesKey(Algorithm algorithm) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES", "BC");
        keyGen.init(algorithm.getParameterSize(), secureRandom);
        var secretKey = keyGen.generateKey();

        // For symmetric keys, we encode as Base64 (no PEM wrapper)
        String keyBase64 = Base64.getEncoder().encodeToString(secretKey.getEncoded());

        return KeyGenResponse.builder()
                .algorithm(algorithm)
                .mode(algorithm.getMode())
                .privateKeyPem(keyBase64)  // Symmetric key goes here
                .publicKeyPem(null)        // No public key for symmetric
                .keyFormat("RAW/Base64")
                .keySize(algorithm.getParameterSize())
                .supportedOperations(algorithm.getSupportedOperations().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()))
                .build();
    }

    // ═══════════════════════════════════════════════════════════════
    // POST-QUANTUM KEY GENERATION
    // ═══════════════════════════════════════════════════════════════

    private KeyGenResponse generateMlKemKeyPair(Algorithm algorithm) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("ML-KEM", "BC");

        MLKEMParameterSpec paramSpec = switch (algorithm) {
            case ML_KEM_512 -> MLKEMParameterSpec.ml_kem_512;
            case ML_KEM_768 -> MLKEMParameterSpec.ml_kem_768;
            case ML_KEM_1024 -> MLKEMParameterSpec.ml_kem_1024;
            default -> throw new CryptoOperationException("Invalid ML-KEM variant: " + algorithm);
        };

        kpg.initialize(paramSpec, secureRandom);
        KeyPair keyPair = kpg.generateKeyPair();

        return buildAsymmetricResponse(algorithm, keyPair);
    }

    private KeyGenResponse generateMlDsaKeyPair(Algorithm algorithm) throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("ML-DSA", "BC");

        MLDSAParameterSpec paramSpec = switch (algorithm) {
            case ML_DSA_44 -> MLDSAParameterSpec.ml_dsa_44;
            case ML_DSA_65 -> MLDSAParameterSpec.ml_dsa_65;
            case ML_DSA_87 -> MLDSAParameterSpec.ml_dsa_87;
            default -> throw new CryptoOperationException("Invalid ML-DSA variant: " + algorithm);
        };

        kpg.initialize(paramSpec, secureRandom);
        KeyPair keyPair = kpg.generateKeyPair();

        return buildAsymmetricResponse(algorithm, keyPair);
    }

    // ═══════════════════════════════════════════════════════════════
    // HELPER
    // ═══════════════════════════════════════════════════════════════

    private KeyGenResponse buildAsymmetricResponse(Algorithm algorithm, KeyPair keyPair) {
        return KeyGenResponse.builder()
                .algorithm(algorithm)
                .mode(algorithm.getMode())
                .publicKeyPem(PemUtil.toPem(keyPair.getPublic()))
                .privateKeyPem(PemUtil.toPem(keyPair.getPrivate()))
                .keyFormat("PEM (PKCS#8 / X.509 SPKI)")
                .keySize(algorithm.getParameterSize())
                .supportedOperations(algorithm.getSupportedOperations().stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()))
                .build();
    }
}
