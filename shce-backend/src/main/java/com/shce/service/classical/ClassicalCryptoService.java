package com.shce.service.classical;

import com.shce.dto.request.CryptoRequest;
import com.shce.dto.response.CryptoResponse;
import com.shce.enums.Algorithm;
import com.shce.enums.CryptoOperation;
import com.shce.exception.CryptoOperationException;
import com.shce.util.PemUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

@Slf4j
@Service
public class ClassicalCryptoService {

    private static final String RSA_CIPHER_TRANSFORM = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
    private static final String AES_GCM_TRANSFORM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;   // 96 bits — NIST recommended
    private static final int GCM_TAG_LENGTH = 128;  // 128-bit auth tag

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Route the request to the correct classical crypto operation.
     */
    public CryptoResponse execute(CryptoRequest request) {
        Algorithm algorithm = request.getAlgorithm();
        CryptoOperation operation = request.getOperation();

        if (!algorithm.supports(operation)) {
            throw new CryptoOperationException(
                    algorithm + " does not support " + operation);
        }

        long start = System.currentTimeMillis();

        try {
            CryptoResponse response = switch (algorithm.getFamily()) {
                case "RSA" -> handleRsa(request);
                case "EC" -> handleEc(request);
                case "AES" -> handleAes(request);
                default -> throw new CryptoOperationException(
                        "Unsupported classical family: " + algorithm.getFamily());
            };

            response.setProcessingTimeMs(System.currentTimeMillis() - start);
            return response;

        } catch (CryptoOperationException e) {
            throw e;
        } catch (Exception e) {
            throw new CryptoOperationException(
                    operation + " failed for " + algorithm + ": " + e.getMessage(), e);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RSA — Encrypt / Decrypt / Sign / Verify
    // ═══════════════════════════════════════════════════════════════

    private CryptoResponse handleRsa(CryptoRequest request) throws Exception {
        return switch (request.getOperation()) {
            case ENCRYPT -> rsaEncrypt(request);
            case DECRYPT -> rsaDecrypt(request);
            case SIGN -> rsaSign(request);
            case VERIFY -> rsaVerify(request);
        };
    }

    private CryptoResponse rsaEncrypt(CryptoRequest request) throws Exception {
        PublicKey publicKey = PemUtil.parsePublicKey(request.getKeyPem());
        Cipher cipher = Cipher.getInstance(RSA_CIPHER_TRANSFORM, "BC");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey, secureRandom);

        byte[] plaintext = request.getInputData().getBytes(StandardCharsets.UTF_8);
        byte[] ciphertext = cipher.doFinal(plaintext);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.ENCRYPT)
                .outputData(Base64.getEncoder().encodeToString(ciphertext))
                .success(true)
                .message("RSA encryption successful")
                .build();
    }

    private CryptoResponse rsaDecrypt(CryptoRequest request) throws Exception {
        PrivateKey privateKey = PemUtil.parsePrivateKey(request.getKeyPem());
        Cipher cipher = Cipher.getInstance(RSA_CIPHER_TRANSFORM, "BC");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);

        byte[] ciphertext = Base64.getDecoder().decode(request.getInputData());
        byte[] plaintext = cipher.doFinal(ciphertext);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.DECRYPT)
                .outputData(new String(plaintext, StandardCharsets.UTF_8))
                .success(true)
                .message("RSA decryption successful")
                .build();
    }

    private CryptoResponse rsaSign(CryptoRequest request) throws Exception {
        PrivateKey privateKey = PemUtil.parsePrivateKey(request.getKeyPem());
        Signature signature = Signature.getInstance("SHA256withRSA", "BC");
        signature.initSign(privateKey, secureRandom);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sig = signature.sign();

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.SIGN)
                .outputData(Base64.getEncoder().encodeToString(sig))
                .success(true)
                .message("RSA signature generated")
                .build();
    }

    private CryptoResponse rsaVerify(CryptoRequest request) throws Exception {
        PublicKey publicKey = PemUtil.parsePublicKey(request.getKeyPem());
        Signature signature = Signature.getInstance("SHA256withRSA", "BC");
        signature.initVerify(publicKey);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sigBytes = Base64.getDecoder().decode(request.getSignatureBase64());
        boolean valid = signature.verify(sigBytes);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.VERIFY)
                .outputData(String.valueOf(valid))
                .success(valid)
                .message(valid ? "Signature is VALID" : "Signature is INVALID")
                .build();
    }

    // ═══════════════════════════════════════════════════════════════
    // ECDSA — Sign / Verify (EC keys don't do encryption directly)
    // ═══════════════════════════════════════════════════════════════

    private CryptoResponse handleEc(CryptoRequest request) throws Exception {
        return switch (request.getOperation()) {
            case SIGN -> ecSign(request);
            case VERIFY -> ecVerify(request);
            default -> throw new CryptoOperationException(
                    "EC keys support SIGN/VERIFY only, not " + request.getOperation());
        };
    }

    private CryptoResponse ecSign(CryptoRequest request) throws Exception {
        PrivateKey privateKey = PemUtil.parsePrivateKey(request.getKeyPem());

        String sigAlgo = request.getAlgorithm() == Algorithm.EC_P384
                ? "SHA384withECDSA" : "SHA256withECDSA";

        Signature signature = Signature.getInstance(sigAlgo, "BC");
        signature.initSign(privateKey, secureRandom);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sig = signature.sign();

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.SIGN)
                .outputData(Base64.getEncoder().encodeToString(sig))
                .success(true)
                .message("ECDSA signature generated")
                .build();
    }

    private CryptoResponse ecVerify(CryptoRequest request) throws Exception {
        PublicKey publicKey = PemUtil.parsePublicKey(request.getKeyPem());

        String sigAlgo = request.getAlgorithm() == Algorithm.EC_P384
                ? "SHA384withECDSA" : "SHA256withECDSA";

        Signature signature = Signature.getInstance(sigAlgo, "BC");
        signature.initVerify(publicKey);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sigBytes = Base64.getDecoder().decode(request.getSignatureBase64());
        boolean valid = signature.verify(sigBytes);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.VERIFY)
                .outputData(String.valueOf(valid))
                .success(valid)
                .message(valid ? "ECDSA signature is VALID" : "ECDSA signature is INVALID")
                .build();
    }

    // ═══════════════════════════════════════════════════════════════
    // AES-GCM — Encrypt / Decrypt (Symmetric)
    // ═══════════════════════════════════════════════════════════════

    private CryptoResponse handleAes(CryptoRequest request) throws Exception {
        return switch (request.getOperation()) {
            case ENCRYPT -> aesEncrypt(request);
            case DECRYPT -> aesDecrypt(request);
            default -> throw new CryptoOperationException(
                    "AES supports ENCRYPT/DECRYPT only, not " + request.getOperation());
        };
    }

    private CryptoResponse aesEncrypt(CryptoRequest request) throws Exception {
        SecretKey secretKey = decodeAesKey(request.getKeyPem());

        // Generate random IV
        byte[] iv = new byte[GCM_IV_LENGTH];
        secureRandom.nextBytes(iv);

        Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORM, "BC");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

        byte[] plaintext = request.getInputData().getBytes(StandardCharsets.UTF_8);
        byte[] ciphertext = cipher.doFinal(plaintext);

        // Prepend IV to ciphertext: [IV (12 bytes) | ciphertext+tag]
        ByteBuffer output = ByteBuffer.allocate(iv.length + ciphertext.length);
        output.put(iv);
        output.put(ciphertext);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.ENCRYPT)
                .outputData(Base64.getEncoder().encodeToString(output.array()))
                .success(true)
                .message("AES-GCM encryption successful (IV prepended)")
                .build();
    }

    private CryptoResponse aesDecrypt(CryptoRequest request) throws Exception {
        SecretKey secretKey = decodeAesKey(request.getKeyPem());

        byte[] combined = Base64.getDecoder().decode(request.getInputData());

        // Extract IV from the first 12 bytes
        ByteBuffer buffer = ByteBuffer.wrap(combined);
        byte[] iv = new byte[GCM_IV_LENGTH];
        buffer.get(iv);
        byte[] ciphertext = new byte[buffer.remaining()];
        buffer.get(ciphertext);

        Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORM, "BC");
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

        byte[] plaintext = cipher.doFinal(ciphertext);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.DECRYPT)
                .outputData(new String(plaintext, StandardCharsets.UTF_8))
                .success(true)
                .message("AES-GCM decryption successful")
                .build();
    }

    /**
     * Decode the Base64 raw AES key (not PEM — symmetric keys have no PEM wrapper).
     */
    private SecretKey decodeAesKey(String keyBase64) {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        return new SecretKeySpec(keyBytes, "AES");
    }
}
