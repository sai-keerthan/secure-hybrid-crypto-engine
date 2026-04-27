package com.shce.service.pqc;

import com.shce.dto.request.CryptoRequest;
import com.shce.dto.response.CryptoResponse;
import com.shce.enums.Algorithm;
import com.shce.enums.CryptoOperation;
import com.shce.exception.CryptoOperationException;
import com.shce.util.PemUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

import org.bouncycastle.jcajce.SecretKeyWithEncapsulation;
import org.bouncycastle.jcajce.spec.KEMExtractSpec;
import org.bouncycastle.jcajce.spec.KEMGenerateSpec;

@Slf4j
@Service
public class PQCryptoService {

    private static final String AES_GCM_TRANSFORM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;
    private static final int AES_KEY_LENGTH = 256;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Route the request to the correct PQC operation.
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
                case "ML-KEM" -> handleMlKem(request);
                case "ML-DSA" -> handleMlDsa(request);
                default -> throw new CryptoOperationException(
                        "Unsupported PQC family: " + algorithm.getFamily());
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
    // ML-KEM (FIPS 203) — KEM-based Hybrid Encrypt / Decrypt
    //
    // Encrypt flow:
    //   1. Use recipient's public key to encapsulate → (shared secret, encapsulation)
    //   2. Derive AES-256 key from shared secret
    //   3. AES-GCM encrypt the plaintext
    //   4. Return: [encapsulation | IV | ciphertext+tag] as Base64
    //
    // Decrypt flow:
    //   1. Extract encapsulation from the combined payload
    //   2. Use private key to decapsulate → shared secret
    //   3. Derive AES-256 key from shared secret
    //   4. AES-GCM decrypt the ciphertext
    // ═══════════════════════════════════════════════════════════════

    private CryptoResponse handleMlKem(CryptoRequest request) throws Exception {
        return switch (request.getOperation()) {
            case ENCRYPT -> mlKemEncrypt(request);
            case DECRYPT -> mlKemDecrypt(request);
            default -> throw new CryptoOperationException(
                    "ML-KEM supports ENCRYPT/DECRYPT only");
        };
    }

    private CryptoResponse mlKemEncrypt(CryptoRequest request) throws Exception {
        PublicKey publicKey = PemUtil.parsePublicKey(request.getKeyPem());

        // Step 1: KEM Encapsulation — generates shared secret + encapsulation
        KeyGenerator kemGen = KeyGenerator.getInstance("ML-KEM", "BC");
        kemGen.init(new KEMGenerateSpec(publicKey, "AES"), secureRandom);
        SecretKeyWithEncapsulation secretKeyWithEncap =
                (SecretKeyWithEncapsulation) kemGen.generateKey();

        byte[] encapsulation = secretKeyWithEncap.getEncapsulation();
        byte[] sharedSecret = secretKeyWithEncap.getEncoded();

        // Step 2: Derive AES-256 key from shared secret (use first 32 bytes)
        byte[] aesKeyBytes = new byte[32];
        System.arraycopy(sharedSecret, 0, aesKeyBytes, 0,
                Math.min(sharedSecret.length, 32));
        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, "AES");

        // Step 3: AES-GCM encrypt
        byte[] iv = new byte[GCM_IV_LENGTH];
        secureRandom.nextBytes(iv);

        Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORM, "BC");
        cipher.init(Cipher.ENCRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

        byte[] plaintext = request.getInputData().getBytes(StandardCharsets.UTF_8);
        byte[] ciphertext = cipher.doFinal(plaintext);

        // Step 4: Combine [encapLen(4) | encapsulation | IV(12) | ciphertext+tag]
        ByteBuffer output = ByteBuffer.allocate(
                4 + encapsulation.length + iv.length + ciphertext.length);
        output.putInt(encapsulation.length);
        output.put(encapsulation);
        output.put(iv);
        output.put(ciphertext);

        log.info("ML-KEM encrypt: encapsulation={} bytes, ciphertext={} bytes",
                encapsulation.length, ciphertext.length);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.ENCRYPT)
                .outputData(Base64.getEncoder().encodeToString(output.array()))
                .success(true)
                .message("ML-KEM hybrid encryption successful (KEM + AES-GCM)")
                .build();
    }

    private CryptoResponse mlKemDecrypt(CryptoRequest request) throws Exception {
        PrivateKey privateKey = PemUtil.parsePrivateKey(request.getKeyPem());

        byte[] combined = Base64.getDecoder().decode(request.getInputData());
        ByteBuffer buffer = ByteBuffer.wrap(combined);

        // Step 1: Extract encapsulation
        int encapLen = buffer.getInt();
        byte[] encapsulation = new byte[encapLen];
        buffer.get(encapsulation);

        // Step 2: KEM Decapsulation — recover shared secret
        KeyGenerator kemGen = KeyGenerator.getInstance("ML-KEM", "BC");
        kemGen.init(new KEMExtractSpec(privateKey, encapsulation, "AES"), secureRandom);
        SecretKeyWithEncapsulation secretKeyWithEncap =
                (SecretKeyWithEncapsulation) kemGen.generateKey();

        byte[] sharedSecret = secretKeyWithEncap.getEncoded();

        // Step 3: Derive AES-256 key
        byte[] aesKeyBytes = new byte[32];
        System.arraycopy(sharedSecret, 0, aesKeyBytes, 0,
                Math.min(sharedSecret.length, 32));
        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, "AES");

        // Step 4: Extract IV and ciphertext
        byte[] iv = new byte[GCM_IV_LENGTH];
        buffer.get(iv);
        byte[] ciphertext = new byte[buffer.remaining()];
        buffer.get(ciphertext);

        // Step 5: AES-GCM decrypt
        Cipher cipher = Cipher.getInstance(AES_GCM_TRANSFORM, "BC");
        cipher.init(Cipher.DECRYPT_MODE, aesKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

        byte[] plaintext = cipher.doFinal(ciphertext);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.DECRYPT)
                .outputData(new String(plaintext, StandardCharsets.UTF_8))
                .success(true)
                .message("ML-KEM hybrid decryption successful")
                .build();
    }

    // ═══════════════════════════════════════════════════════════════
    // ML-DSA (FIPS 204) — Digital Signature Sign / Verify
    // ═══════════════════════════════════════════════════════════════

    private CryptoResponse handleMlDsa(CryptoRequest request) throws Exception {
        return switch (request.getOperation()) {
            case SIGN -> mlDsaSign(request);
            case VERIFY -> mlDsaVerify(request);
            default -> throw new CryptoOperationException(
                    "ML-DSA supports SIGN/VERIFY only");
        };
    }

    private CryptoResponse mlDsaSign(CryptoRequest request) throws Exception {
        PrivateKey privateKey = PemUtil.parsePrivateKey(request.getKeyPem());

        Signature signature = Signature.getInstance("ML-DSA", "BC");
        signature.initSign(privateKey, secureRandom);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sig = signature.sign();

        log.info("ML-DSA sign: signature={} bytes", sig.length);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.SIGN)
                .outputData(Base64.getEncoder().encodeToString(sig))
                .success(true)
                .message("ML-DSA signature generated")
                .build();
    }

    private CryptoResponse mlDsaVerify(CryptoRequest request) throws Exception {
        PublicKey publicKey = PemUtil.parsePublicKey(request.getKeyPem());

        Signature signature = Signature.getInstance("ML-DSA", "BC");
        signature.initVerify(publicKey);
        signature.update(request.getInputData().getBytes(StandardCharsets.UTF_8));

        byte[] sigBytes = Base64.getDecoder().decode(request.getSignatureBase64());
        boolean valid = signature.verify(sigBytes);

        return CryptoResponse.builder()
                .algorithm(request.getAlgorithm())
                .operation(CryptoOperation.VERIFY)
                .outputData(String.valueOf(valid))
                .success(valid)
                .message(valid ? "ML-DSA signature is VALID" : "ML-DSA signature is INVALID")
                .build();
    }
}
