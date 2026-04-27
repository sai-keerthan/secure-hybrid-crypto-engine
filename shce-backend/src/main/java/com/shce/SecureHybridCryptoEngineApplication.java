package com.shce;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.security.Security;

@SpringBootApplication
public class SecureHybridCryptoEngineApplication {

    static {
        // Register Bouncy Castle as the primary JCE provider.
        // In BC 1.78+, both classical and PQC algorithms (ML-KEM, ML-DSA)
        // are available through the single BouncyCastleProvider.
        Security.addProvider(new BouncyCastleProvider());
    }

    public static void main(String[] args) {
        SpringApplication.run(SecureHybridCryptoEngineApplication.class, args);
    }
}
