<img width="1153" height="776" alt="image" src="https://github.com/user-attachments/assets/31821b0f-0c26-48c4-a11f-cf4d81b09f93" />

# 🔐 Secure Hybrid Crypto Engine (SHCE)

A full-stack web application that unifies **classical** and **post-quantum** cryptographic operations into a single, cohesive platform. Built for security engineers, developers, and researchers who need to explore, test, and compare cryptographic algorithms across paradigms.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Bouncy Castle](https://img.shields.io/badge/Bouncy%20Castle-1.80-purple.svg)](https://www.bouncycastle.org/)

---

## Why SHCE?

Quantum computers will eventually break RSA, ECDSA, and other widely-deployed public-key algorithms. The **"harvest now, decrypt later"** threat means sensitive data encrypted today is already at risk. NIST has finalized the first post-quantum standards (FIPS 203, FIPS 204) — but most tools still treat classical and post-quantum crypto as separate worlds.

**SHCE bridges that gap.** One engine, one interface, both paradigms.

## Supported Algorithms

### Classical
| Algorithm | Operations | Standard |
|-----------|-----------|----------|
| RSA-2048 / 4096 | Encrypt, Decrypt, Sign, Verify | PKCS#1 v2.2 |
| ECDSA P-256 / P-384 | Sign, Verify | NIST FIPS 186-5 |
| AES-128-GCM / AES-256-GCM | Encrypt, Decrypt | NIST SP 800-38D |

### Post-Quantum
| Algorithm | Operations | Standard |
|-----------|-----------|----------|
| ML-KEM-512 / 768 / 1024 | Encrypt (KEM+AES-GCM), Decrypt | NIST FIPS 203 |
| ML-DSA-44 / 65 / 87 | Sign, Verify | NIST FIPS 204 |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend — React 18 + Vite 5 + Tailwind CSS 3             │
│  Mode Selector → Algorithm → Key Gen/Upload → Operations   │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / JSON
┌──────────────────────────▼──────────────────────────────────┐
│  Backend — Spring Boot 3.3 + Java 21 + Maven                │
│                                                              │
│  CryptoController → AlgoRouter ─┬→ ClassicalCryptoService   │
│                                 └→ PQCryptoService           │
│  KeyGenController → KeyGenService                            │
│                                                              │
│  Crypto Provider: Bouncy Castle 1.80                         │
└──────────────────────────────────────────────────────────────┘
```

**Key design principles:**
- **Zero persistence** — Keys are never stored on the server
- **Stateless** — No sessions, no database, no key storage
- **FIPS compliant** — All algorithms follow NIST/FIPS standards
- **Unified interface** — Same workflow for classical and post-quantum

## User Workflow

1. **Select Mode** — Classical or Post-Quantum
2. **Choose Algorithm** — Specific algorithm variant (e.g., ML-KEM-768)
3. **Setup Keys** — Generate a fresh key pair or upload existing `.pem` files
4. **Perform Operations** — Encrypt / Decrypt / Sign / Verify

## Quick Start

### Prerequisites
- **Java 21+** ([Download][(https://adoptium.net/)](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html))
- **Maven 3.9+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 18+** ([Download](https://nodejs.org/))

### Backend
```bash
cd shce-backend
mvn clean install
mvn spring-boot:run
# → http://localhost:8080
```

Verify: `curl http://localhost:8080/api/v1/health`

### Frontend
```bash
cd shce-frontend
npm install
npm run dev
# → http://localhost:5173
```

> **Note:** Start the backend first. The frontend proxies API calls to `localhost:8080`.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | Health check + provider info |
| `GET` | `/api/v1/keys/algorithms` | List all algorithms |
| `GET` | `/api/v1/keys/algorithms?mode=POST_QUANTUM` | Filter by mode |
| `POST` | `/api/v1/keys/generate` | Generate key pair |
| `POST` | `/api/v1/crypto/encrypt` | Encrypt data |
| `POST` | `/api/v1/crypto/decrypt` | Decrypt data |
| `POST` | `/api/v1/crypto/sign` | Sign data |
| `POST` | `/api/v1/crypto/verify` | Verify signature |

## Key Formats

| Type | Format | Header |
|------|--------|--------|
| Private Key | PKCS#8 PEM | `-----BEGIN PRIVATE KEY-----` |
| Public Key | X.509 SPKI PEM | `-----BEGIN PUBLIC KEY-----` |
| AES Key | Raw Base64 | N/A (no PEM wrapper) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3, Maven |
| Crypto | Bouncy Castle 1.80 (bcprov + bcpkix + bcutil) |
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| HTTP Client | Axios |
| Fonts | Anton (display), Satoshi (body) |

## Project Structure

```
secure-hybrid-crypto-engine/
├── shce-backend/
│   ├── pom.xml
│   └── src/main/java/com/shce/
│       ├── controller/          REST endpoints
│       ├── service/             AlgoRouter + crypto services
│       │   ├── classical/       RSA, EC, AES-GCM
│       │   ├── pqc/             ML-KEM, ML-DSA
│       │   └── keygen/          Key generation
│       ├── dto/                 Request/Response objects
│       ├── enums/               Algorithm, CryptoMode, CryptoOperation
│       ├── util/                PEM encoding/decoding
│       └── exception/           Error handling
│
├── shce-frontend/
│   ├── package.json
│   └── src/
│       ├── components/          Reusable UI components
│       ├── pages/               Home, Engine, About/Docs
│       └── services/            API client
│
├── LICENSE                      MIT
└── README.md
```

## Standards & Compliance

| Standard | Description |
|----------|-------------|
| NIST FIPS 203 | ML-KEM (Module-Lattice Key Encapsulation) |
| NIST FIPS 204 | ML-DSA (Module-Lattice Digital Signatures) |
| NIST FIPS 186-5 | Digital Signature Standard (ECDSA) |
| NIST SP 800-38D | AES-GCM Authenticated Encryption |
| PKCS#1 v2.2 | RSA Cryptography Standard |

## Roadmap

- [ ] SLH-DSA (SPHINCS+) support — NIST FIPS 205
- [ ] HQC — NIST Round 4 KEM candidate
- [ ] Hybrid mode — Classical + PQC combined operations
- [ ] Docker containerization
- [ ] CI/CD with GitHub Actions
- [ ] Deployment to cloud (Vercel + Railway)
- [ ] Security audit & penetration testing
- [ ] Performance benchmarking across algorithms

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Built with 🔐 by security engineers, for security engineers.**
