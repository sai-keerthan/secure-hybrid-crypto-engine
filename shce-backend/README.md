# Secure Hybrid Crypto Engine — Backend

A Spring Boot REST API that provides cryptographic operations using both **classical** and **post-quantum** algorithms, powered by Bouncy Castle 1.78+.

## Tech Stack
- **Java 21** + **Spring Boot 3.3.5**
- **Bouncy Castle 1.78.1** (bcprov + bcpkix + bcutil)
- **Maven** build system

## Supported Algorithms

### Classical
| Algorithm | Operations |
|-----------|-----------|
| RSA-2048 / RSA-4096 | Encrypt, Decrypt, Sign, Verify |
| ECDSA P-256 / P-384 | Sign, Verify |
| AES-128-GCM / AES-256-GCM | Encrypt, Decrypt |

### Post-Quantum (NIST FIPS 203/204)
| Algorithm | Operations |
|-----------|-----------|
| ML-KEM-512 / 768 / 1024 | Encrypt (KEM+AES-GCM), Decrypt |
| ML-DSA-44 / 65 / 87 | Sign, Verify |

## API Endpoints

```
GET  /api/v1/health                    → Health check
GET  /api/v1/keys/algorithms           → List available algorithms
GET  /api/v1/keys/algorithms?mode=POST_QUANTUM  → Filter by mode

POST /api/v1/keys/generate             → Generate key pair
POST /api/v1/crypto/encrypt            → Encrypt data
POST /api/v1/crypto/decrypt            → Decrypt data
POST /api/v1/crypto/sign               → Sign data
POST /api/v1/crypto/verify             → Verify signature
POST /api/v1/crypto/execute            → Generic operation
```

## Quick Start

```bash
# Prerequisites: Java 21+, Maven 3.9+
mvn clean install
mvn spring-boot:run
# Server starts on http://localhost:8080
```

## Key Format
- **Private keys**: PKCS#8 PEM (`-----BEGIN PRIVATE KEY-----`)
- **Public keys**: X.509/SPKI PEM (`-----BEGIN PUBLIC KEY-----`)
- **AES keys**: Raw Base64 encoded

## Architecture
```
CryptoController → AlgoRouter → ClassicalCryptoService (RSA/EC/AES)
                              → PQCryptoService (ML-KEM/ML-DSA)

KeyGenController → KeyGenService → Bouncy Castle Providers
```
