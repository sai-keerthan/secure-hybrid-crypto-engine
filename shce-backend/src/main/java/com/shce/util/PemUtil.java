package com.shce.util;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import com.shce.exception.CryptoOperationException;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * Utility class for converting keys to and from PEM (Base64) format.
 *
 * Supports:
 * - PKCS#8:      -----BEGIN PRIVATE KEY-----
 * - Traditional: -----BEGIN RSA PRIVATE KEY----- (PEMKeyPair)
 * - X.509 SPKI:  -----BEGIN PUBLIC KEY-----
 */
@Slf4j
public final class PemUtil {

    // D4: Maximum PEM size before parsing — prevents heap pressure from malformed input
    private static final int MAX_PEM_BYTES = 32_768; // 32KB — well above largest PQC key

    private PemUtil() {}

    public static String toPem(Key key) {
        try (StringWriter sw = new StringWriter();
             JcaPEMWriter pemWriter = new JcaPEMWriter(sw)) {
            pemWriter.writeObject(key);
            pemWriter.flush();
            return sw.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to encode key to PEM", e);
        }
    }

    /**
     * Parse a PEM string into a PublicKey.
     * D4: Validates size before parsing.
     * E2: Logs a warning if a private key (PEMKeyPair) is submitted — extracts public component.
     */
    public static PublicKey parsePublicKey(String pem) {
        validatePemSize(pem);

        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object parsed = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");

            if (parsed instanceof SubjectPublicKeyInfo spki) {
                return converter.getPublicKey(spki);
            }
            if (parsed instanceof PEMKeyPair keyPair) {
                // E2: Private key submitted where public key expected — warn, extract public component
                log.warn("[SECURITY] parsePublicKey received a PEMKeyPair (private key format). " +
                        "Extracting public component. Ensure the correct key is being submitted.");
                return converter.getKeyPair(keyPair).getPublic();
            }
            throw new CryptoOperationException("Invalid key format. Expected a public key (BEGIN PUBLIC KEY).");
        } catch (IOException e) {
            throw new CryptoOperationException("Failed to parse public key. Verify PEM format and encoding.");
        }
    }

    /**
     * Parse a PEM string into a PrivateKey.
     * D4: Validates size before parsing.
     */
    public static PrivateKey parsePrivateKey(String pem) {
        validatePemSize(pem);

        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object parsed = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");

            if (parsed instanceof PrivateKeyInfo pki) {
                return converter.getPrivateKey(pki);
            }
            if (parsed instanceof PEMKeyPair keyPair) {
                return converter.getKeyPair(keyPair).getPrivate();
            }
            throw new CryptoOperationException("Invalid key format. Expected a private key (BEGIN PRIVATE KEY).");
        } catch (IOException e) {
            throw new CryptoOperationException("Failed to parse private key. Verify PEM format and encoding.");
        }
    }

    /**
     * D4: Guard against malformed oversized PEM strings causing BC parser heap pressure.
     */
    private static void validatePemSize(String pem) {
        if (pem == null || pem.isBlank()) {
            throw new CryptoOperationException("Key PEM must not be null or blank.");
        }
        if (pem.getBytes().length > MAX_PEM_BYTES) {
            throw new CryptoOperationException(
                    "Key PEM exceeds maximum allowed size of " + MAX_PEM_BYTES + " bytes.");
        }
    }
}