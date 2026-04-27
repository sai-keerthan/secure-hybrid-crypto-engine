package com.shce.util;

import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * Utility class for converting keys to and from PEM (Base64) format.
 * <p>
 * Supports multiple PEM formats:
 * - PKCS#8:      -----BEGIN PRIVATE KEY-----
 * - Traditional: -----BEGIN RSA PRIVATE KEY----- (PEMKeyPair)
 * - X.509 SPKI:  -----BEGIN PUBLIC KEY-----
 */
public final class PemUtil {

    private PemUtil() {
        // Utility class — no instantiation
    }

    /**
     * Encode any key (public or private) to PEM string.
     */
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
     * Parse a PEM string back into a PublicKey.
     * Handles both SubjectPublicKeyInfo and PEMKeyPair formats.
     */
    public static PublicKey parsePublicKey(String pem) {
        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object parsed = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");

            if (parsed instanceof SubjectPublicKeyInfo spki) {
                return converter.getPublicKey(spki);
            }
            if (parsed instanceof PEMKeyPair keyPair) {
                return converter.getKeyPair(keyPair).getPublic();
            }
            throw new IllegalArgumentException(
                    "PEM does not contain a valid public key. Found: " +
                    (parsed != null ? parsed.getClass().getSimpleName() : "null"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse public key PEM", e);
        }
    }

    /**
     * Parse a PEM string back into a PrivateKey.
     * Handles both PKCS#8 (PrivateKeyInfo) and traditional (PEMKeyPair) formats.
     */
    public static PrivateKey parsePrivateKey(String pem) {
        try (PEMParser parser = new PEMParser(new StringReader(pem))) {
            Object parsed = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");

            if (parsed instanceof PrivateKeyInfo pki) {
                return converter.getPrivateKey(pki);
            }
            if (parsed instanceof PEMKeyPair keyPair) {
                return converter.getKeyPair(keyPair).getPrivate();
            }
            throw new IllegalArgumentException(
                    "PEM does not contain a valid private key. Found: " +
                    (parsed != null ? parsed.getClass().getSimpleName() : "null"));
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse private key PEM", e);
        }
    }
}
