<img width="1153" height="776" alt="image" src="https://github.com/user-attachments/assets/31821b0f-0c26-48c4-a11f-cf4d81b09f93" />

<div align="center">

# 🔐 Secure Hybrid Crypto Engine

### Classical + Post-Quantum Cryptography, Unified.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-green.svg)](https://spring.io/projects/spring-boot)
[![Bouncy Castle](https://img.shields.io/badge/Bouncy%20Castle-1.84-purple.svg)](https://www.bouncycastle.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen.svg)](https://github.com/sai-keerthan/secure-hybrid-crypto-engine/releases/tag/v2.0.0)
[![Security](https://img.shields.io/badge/Security-Hardened-red.svg)](#security)

</div>

---

## What is SHCE?

The **Secure Hybrid Crypto Engine (SHCE)** is a full-stack web application that unifies classical and post-quantum cryptographic operations into a single platform. Built for security engineers, developers, and researchers who need to explore, test, and compare cryptographic algorithms across paradigms — without switching tools.

> **v2.0.0 is a security hardening release.** All 29 STRIDE threat model findings and 35 CVEs from v1.0.0 have been resolved. See the [Security](#security) section for details.

---

## Why Quantum-Safe Cryptography — Now?

Quantum computers running Shor's algorithm will eventually break RSA, ECDSA, and other widely-deployed public-key systems. But the threat is not future — adversaries are already using **"harvest now, decrypt later"** strategies, capturing encrypted traffic today to decrypt it once quantum hardware matures.

NIST finalized the first post-quantum standards in 2024:
- **FIPS 203** — ML-KEM (Key Encapsulation)
- **FIPS 204** — ML-DSA (Digital Signatures)

SHCE implements both alongside classical algorithms so you can explore, compare, and prepare your systems for the post-quantum transition today.

---

## Supported Algorithms

### Classical
| Algorithm | Operations | Standard |
|-----------|-----------|----------|
| RSA-2048 / 4096 | Encrypt, Decrypt, Sign, Verify | PKCS#1 v2.2 |
| ECDSA P-256 / P-384 | Sign, Verify | NIST FIPS 186-5 |
| AES-128-GCM / AES-256-GCM | Encrypt, Decrypt | NIST SP 800-38D |

### Post-Quantum (NIST Standardized)
| Algorithm | Operations | Standard |
|-----------|-----------|----------|
| ML-KEM-512 / 768 / 1024 | Encrypt (KEM + AES-256-GCM), Decrypt | NIST FIPS 203 |
| ML-DSA-44 / 65 / 87 | Sign, Verify | NIST FIPS 204 |

**ML-KEM uses a hybrid construction:** KEM encapsulation → HKDF-SHA256 → AES-256-GCM. This means every ML-KEM encryption is quantum-safe key exchange combined with authenticated symmetric encryption.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  Frontend — React 18 + Vite 5 + Tailwind CSS 3                  │
│  Mode → Algorithm → Key Gen/Upload → Operations                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTPS / JSON  (X-API-Key header)
┌────────────────────────────▼─────────────────────────────────────┐
│  Spring Security Filter Chain                                     │
│  ApiKeyAuthFilter → Rate Limiter → Controllers                   │
├──────────────────────────────────────────────────────────────────┤
│  Backend — Spring Boot 4.0.6 + Java 21                           │
│                                                                   │
│  CryptoController → AlgoRouter ─┬→ ClassicalCryptoService        │
│                                 └→ PQCryptoService (HKDF + KEM)  │
│  KeyGenController → KeyGenService                                 │
│  GlobalExceptionHandler (sanitized errors)                        │
├──────────────────────────────────────────────────────────────────┤
│  Crypto Provider: Bouncy Castle 1.84                              │
│  RSA · ECDSA · AES-GCM · ML-KEM (FIPS 203) · ML-DSA (FIPS 204) │
└──────────────────────────────────────────────────────────────────┘
```

**Design principles:**
- **Zero persistence** — Keys never stored on the server. Generate, use, discard.
- **Stateless** — No sessions, no database, no key storage.
- **HTTPS only** — TLS enforced with HTTP → HTTPS redirect.
- **Authenticated** — Every endpoint (except `/health`) requires an API key.
- **FIPS compliant** — All algorithms follow NIST/FIPS standards.

---

## Quick Start

### Prerequisites
| Tool | Version | Download |
|------|---------|----------|
| Java | 21+ | [adoptium.net](https://adoptium.net/) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |

### 1 — Generate your API key

SHCE requires an API key for all cryptographic operations. Generate a secure random key:

```bash
# Linux / macOS
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))

# Or use any UUID generator — example:
# f47ac10b-58cc-4372-a567-0e02b2c3d479
```

Keep this value — you will need it in Steps 3 and 4.

---

### 2 — Clone the repository

```bash
git clone https://github.com/sai-keerthan/secure-hybrid-crypto-engine.git
cd secure-hybrid-crypto-engine
```

---

### 3 — Configure the backend

**Create your dev properties file:**

```bash
cp shce-backend/src/main/resources/application-dev.properties.template \
   shce-backend/src/main/resources/application-dev.properties
```

**Open `application-dev.properties` and set your API key:**

```properties
shce.api.key=YOUR_GENERATED_API_KEY_HERE
```

**Generate a TLS keystore for local HTTPS:**

```bash
cd shce-backend/src/main/resources

keytool -genkeypair -alias shce-dev -keyalg RSA -keysize 2048 \
  -storetype PKCS12 -keystore sslkeystore.p12 \
  -storepass YOUR_KEYSTORE_PASSWORD -validity 365 \
  -dname "CN=localhost, OU=SHCE, O=Dev, L=Dev, ST=Dev, C=US"
```

Update `application.properties` with your keystore password:

```properties
server.ssl.key-store-password=YOUR_KEYSTORE_PASSWORD
```

**Start the backend:**

```bash
cd shce-backend
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Backend starts at **https://localhost:8443**

Verify it's running:
```bash
curl -k https://localhost:8443/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "application": "Secure Hybrid Crypto Engine",
  "version": "2.0.0"
}
```

---

### 4 — Configure and start the frontend

**Open `shce-frontend/vite.config.js` and set your API key** (must match Step 3):

```js
const SHCE_DEV_API_KEY = 'YOUR_GENERATED_API_KEY_HERE'
```

**Install dependencies and start:**

```bash
cd shce-frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:5173**

> The Vite proxy automatically injects the `X-API-Key` header on every API call — no manual configuration needed in the browser.

---

### 5 — Start using SHCE

Open **http://localhost:5173** in your browser and follow the 4-step workflow:

1. **Select Mode** — Classical or Post-Quantum
2. **Choose Algorithm** — e.g., ML-KEM-768 for encryption, ML-DSA-65 for signing
3. **Setup Keys** — Generate a fresh key pair and download both `.pem` files, or upload existing keys
4. **Perform Operations** — Encrypt, Decrypt, Sign, or Verify

---

## Using the API Directly

All endpoints require the `X-API-Key` header. Health check is public.

### Health check (no key required)
```bash
curl -k https://localhost:8443/api/v1/health
```

### Generate a key pair
```bash
curl -k -X POST https://localhost:8443/api/v1/keys/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"algorithm": "ML_KEM_768"}'
```

### Encrypt data
```bash
curl -k -X POST https://localhost:8443/api/v1/crypto/encrypt \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "algorithm": "ML_KEM_768",
    "inputData": "Hello, post-quantum world!",
    "keyPem": "-----BEGIN PUBLIC KEY-----\n..."
  }'
```

### Sign data
```bash
curl -k -X POST https://localhost:8443/api/v1/crypto/sign \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "algorithm": "ML_DSA_65",
    "inputData": "Document to sign",
    "keyPem": "-----BEGIN PRIVATE KEY-----\n..."
  }'
```

### Full API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/health` | ❌ Public | Health check + provider info |
| `GET` | `/api/v1/keys/algorithms` | ✅ Required | List all 12 algorithms |
| `GET` | `/api/v1/keys/algorithms?mode=POST_QUANTUM` | ✅ Required | Filter by mode |
| `POST` | `/api/v1/keys/generate` | ✅ Required | Generate key pair |
| `POST` | `/api/v1/crypto/encrypt` | ✅ Required | Encrypt data |
| `POST` | `/api/v1/crypto/decrypt` | ✅ Required | Decrypt data |
| `POST` | `/api/v1/crypto/sign` | ✅ Required | Sign data |
| `POST` | `/api/v1/crypto/verify` | ✅ Required | Verify signature |

**Rate limits:** 5 requests/minute for key generation, 60 requests/minute for crypto operations.

---

## Key Formats

| Type | Format | PEM Header |
|------|--------|-----------|
| Private Key | PKCS#8 | `-----BEGIN PRIVATE KEY-----` |
| Public Key | X.509 SPKI | `-----BEGIN PUBLIC KEY-----` |
| AES Key | Raw Base64 | N/A — no PEM wrapper for symmetric keys |

---

## Security

### v2.0.0 Security Status

| Category | Finding Count | Status |
|----------|--------------|--------|
| CRITICAL findings | 6 | ✅ All closed |
| HIGH findings | 9 | ✅ All closed |
| MEDIUM findings | 11 | ✅ 9 closed · 2 accepted (documented) |
| LOW findings | 3 | ✅ All closed |
| Crypto warnings | 2 | ✅ All closed |
| CVEs (v1.0.0) | 35 | ✅ All critical/high resolved |

### Key security controls in v2.0.0

- **TLS enforced** — HTTPS on port 8443, HTTP 8080 redirects to HTTPS
- **API key authentication** — Spring Security filter chain, 401 on all protected endpoints
- **Rate limiting** — Resilience4j per-endpoint throttling
- **Input validation** — Size limits on all request fields (1MB data, 32KB PEM)
- **Error sanitization** — Generic client messages, full detail to server logs only
- **Audit logging** — requestId + IP + principal + outcome on every operation
- **HKDF key derivation** — ML-KEM shared secret derived via HKDF-SHA256 (NIST SP 800-227)
- **Explicit ML-DSA variants** — ML-DSA-44/65/87 algorithm strings enforced
- **PEM size validation** — 32KB max before Bouncy Castle parser instantiation
- **Debug mode gated** — processingTimeMs only returned to localhost when debug flag enabled

### Security methodology
- Threat model: STRIDE framework — full analysis performed on v1.0.0
- Dependency scanning: OWASP Dependency-Check + npm audit
- Static analysis: Manual code review against all STRIDE findings
- Verification: Post-sprint static verification scan — all fixes confirmed in code

Full details: [`SHCE_Security_Verification_Report_v1.0.1.docx`](docs/SHCE_Security_Verification_Report_v1.0.1.docx)

### Reporting a vulnerability

Please do not open public issues for security vulnerabilities. Open a [GitHub Security Advisory](https://github.com/sai-keerthan/secure-hybrid-crypto-engine/security/advisories/new) instead.

---

## Project Structure

```
secure-hybrid-crypto-engine/
├── shce-backend/
│   └── src/main/java/com/shce/
│       ├── config/              TLS, CORS, Security filter chain, API key auth
│       ├── controller/          CryptoController, KeyGenController, HealthController
│       ├── service/
│       │   ├── classical/       RSA, ECDSA, AES-GCM
│       │   ├── pqc/             ML-KEM (HKDF hybrid), ML-DSA
│       │   └── keygen/          Key pair generation (all 12 algorithms)
│       ├── dto/                 Validated request/response objects
│       ├── enums/               Algorithm, CryptoMode, CryptoOperation
│       ├── util/                PemUtil (PKCS#8 + PEMKeyPair support)
│       └── exception/           Sanitized error handling
│
├── shce-frontend/
│   └── src/
│       ├── components/          ModeSelector, AlgorithmSelector,
│       │                        KeyManager (generate/upload), CryptoOperations
│       ├── pages/               Home, Engine, About/Docs
│       └── services/            Axios API client
│
├── docs/                        Security reports
├── LICENSE                      MIT
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 4.0.6, Maven |
| Security | Spring Security, Resilience4j, TLS/HTTPS |
| Crypto | Bouncy Castle 1.84 (bcprov + bcpkix + bcutil) |
| Frontend | React 18, Vite 5.4.21, Tailwind CSS 3 |
| HTTP Client | Axios |

---

## Standards & Compliance

| Standard | Description |
|----------|-------------|
| NIST FIPS 203 | ML-KEM — Module-Lattice Key Encapsulation Mechanism |
| NIST FIPS 204 | ML-DSA — Module-Lattice Digital Signature Algorithm |
| NIST FIPS 186-5 | ECDSA — Elliptic Curve Digital Signature Standard |
| NIST SP 800-38D | AES-GCM Authenticated Encryption |
| NIST SP 800-227 | Key Encapsulation Mechanisms (HKDF usage) |
| PKCS#1 v2.2 | RSA Cryptography Standard (OAEP padding) |

---

## Changelog

### v2.0.0 — Security Hardening Release
- ✅ All 29 STRIDE threat model findings resolved
- ✅ 35 CVEs resolved (including CVE-2025-24813 CISA KEV — Tomcat RCE)
- ✅ Spring Boot upgraded 3.3.5 → 4.0.6
- ✅ Bouncy Castle upgraded 1.80 → 1.84
- ✅ TLS/HTTPS enforced with HTTP redirect
- ✅ API key authentication via Spring Security
- ✅ Rate limiting, input validation, audit logging
- ✅ HKDF-SHA256 for ML-KEM key derivation
- ✅ Explicit ML-DSA variant algorithm strings

### v1.0.0 — Initial Release
- 12 algorithms (Classical + Post-Quantum)
- React frontend with 4-step workflow
- Key generation and PEM upload

---

## Roadmap

- [ ] SLH-DSA (SPHINCS+) — NIST FIPS 205
- [ ] HQC — NIST Round 4 KEM candidate
- [ ] Docker containerization
- [ ] CI/CD with GitHub Actions
- [ ] Cloud deployment (Vercel + Railway)
- [ ] Multi-user support with per-user API keys
- [ ] Performance benchmarking across algorithms
- [ ] Operation timeout wrapper (Sprint 5)

---

## Contributing

Contributions are welcome. Please open an issue first to discuss the change you'd like to make. For security-related contributions please use [GitHub Security Advisories](https://github.com/sai-keerthan/secure-hybrid-crypto-engine/security/advisories/new).

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with 🔐 by security engineers, for security engineers.**

*Classical strength meets quantum resilience.*

</div>
