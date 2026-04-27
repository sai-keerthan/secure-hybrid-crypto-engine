package com.shce.enums;

import lombok.Getter;

import java.util.Set;

@Getter
public enum Algorithm {

    // ── Classical Algorithms ──────────────────────────────────────
    RSA_2048(CryptoMode.CLASSICAL, "RSA", 2048,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT,
                   CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    RSA_4096(CryptoMode.CLASSICAL, "RSA", 4096,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT,
                   CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    EC_P256(CryptoMode.CLASSICAL, "EC", 256,
            Set.of(CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    EC_P384(CryptoMode.CLASSICAL, "EC", 384,
            Set.of(CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    AES_128_GCM(CryptoMode.CLASSICAL, "AES", 128,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT)),

    AES_256_GCM(CryptoMode.CLASSICAL, "AES", 256,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT)),

    // ── Post-Quantum Algorithms ───────────────────────────────────
    ML_KEM_512(CryptoMode.POST_QUANTUM, "ML-KEM", 512,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT)),

    ML_KEM_768(CryptoMode.POST_QUANTUM, "ML-KEM", 768,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT)),

    ML_KEM_1024(CryptoMode.POST_QUANTUM, "ML-KEM", 1024,
            Set.of(CryptoOperation.ENCRYPT, CryptoOperation.DECRYPT)),

    ML_DSA_44(CryptoMode.POST_QUANTUM, "ML-DSA", 44,
            Set.of(CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    ML_DSA_65(CryptoMode.POST_QUANTUM, "ML-DSA", 65,
            Set.of(CryptoOperation.SIGN, CryptoOperation.VERIFY)),

    ML_DSA_87(CryptoMode.POST_QUANTUM, "ML-DSA", 87,
            Set.of(CryptoOperation.SIGN, CryptoOperation.VERIFY));

    private final CryptoMode mode;
    private final String family;
    private final int parameterSize;
    private final Set<CryptoOperation> supportedOperations;

    Algorithm(CryptoMode mode, String family, int parameterSize,
              Set<CryptoOperation> supportedOperations) {
        this.mode = mode;
        this.family = family;
        this.parameterSize = parameterSize;
        this.supportedOperations = supportedOperations;
    }

    /**
     * Check if this algorithm supports a given operation.
     */
    public boolean supports(CryptoOperation operation) {
        return supportedOperations.contains(operation);
    }

    /**
     * Returns true if this is a symmetric algorithm (no key pair, just a secret key).
     */
    public boolean isSymmetric() {
        return "AES".equals(this.family);
    }
}
