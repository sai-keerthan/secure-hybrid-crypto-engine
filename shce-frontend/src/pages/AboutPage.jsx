import { Shield, Atom, ArrowRight, KeyRound, Lock, PenLine, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-5xl md:text-6xl uppercase leading-display text-charcoal mb-3">
          DOCU<span className="highlight-bar">MENTATION</span>
        </h1>
        <p className="text-charcoal/50 max-w-xl mb-14 leading-relaxed">
          Architecture, standards, and the reasoning behind the Secure Hybrid Crypto Engine.
        </p>

        {/* ── About the Project ─────────────────────────────── */}
        <Section title="ABOUT THE PROJECT">
          <div className="card-light p-6 md:p-8 space-y-4 text-sm text-charcoal/60 leading-relaxed">
            <p>
              The <Hl>Secure Hybrid Crypto Engine (SHCE)</Hl> is a full-stack web application
              designed to provide a unified interface for performing cryptographic operations
              across both <Hl>classical</Hl> and <Hl>post-quantum</Hl> algorithm families.
            </p>
            <p>
              The primary intention behind building SHCE is to bridge the gap between
              traditional cryptography — which remains essential for today's security
              infrastructure — and the emerging post-quantum algorithms that will protect
              data against future quantum computing threats. Rather than requiring separate
              tools, libraries, or workflows for each algorithm family, SHCE brings
              everything into a single, cohesive platform.
            </p>
            <p>
              SHCE is built for security engineers, developers, and researchers who need to
              explore, test, and compare cryptographic operations across paradigms. It serves
              as both a practical tool for key generation, encryption, decryption, signing,
              and verification — and as an educational reference for understanding how
              classical and post-quantum algorithms differ in practice.
            </p>
            <p>
              The backend is powered by <Hl>Java 21</Hl> and <Hl>Spring Boot 3.x</Hl>, with all
              cryptographic operations executed through <Hl>Bouncy Castle 1.80</Hl> — a
              FIPS-grade cryptographic provider. The frontend is built with <Hl>React 18</Hl>,
              <Hl> Vite 5</Hl>, and <Hl>Tailwind CSS</Hl>. Keys are never stored on the server;
              users generate or upload their own keys, making the system fully stateless and
              privacy-respecting.
            </p>
          </div>
        </Section>

        {/* ── Why Quantum-Safe Cryptography ─────────────────── */}
        <Section title="WHY QUANTUM-SAFE CRYPTOGRAPHY?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-charcoal/10 mb-4">
            {/* Threat */}
            <div className="bg-charcoal p-8 text-white">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center mb-4">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="font-display text-2xl uppercase mb-3">THE QUANTUM THREAT</h3>
              <p className="text-sm text-sage/60 leading-relaxed">
                Quantum computers, once sufficiently powerful, will be able to break the
                mathematical problems that underpin today's most widely used public-key
                cryptography — including RSA and Elliptic Curve algorithms. Shor's algorithm
                can factor large integers and compute discrete logarithms in polynomial time,
                rendering RSA-2048, ECDSA, and Diffie-Hellman fundamentally insecure.
              </p>
            </div>
            {/* Response */}
            <div className="bg-darkgray p-8 text-white border-l-4 border-golden">
              <div className="w-10 h-10 rounded-xl bg-golden/15 flex items-center justify-center mb-4">
                <Shield size={20} className="text-golden" />
              </div>
              <h3 className="font-display text-2xl uppercase mb-3">THE PQC RESPONSE</h3>
              <p className="text-sm text-sage/60 leading-relaxed">
                Post-Quantum Cryptography (PQC) uses mathematical problems that are believed
                to be resistant to both classical and quantum attacks — primarily lattice-based
                constructions. NIST has led a multi-year standardization process, culminating
                in the finalization of <span className="text-golden">FIPS 203 (ML-KEM)</span> and{' '}
                <span className="text-golden">FIPS 204 (ML-DSA)</span> in 2024. These standards
                are designed to be drop-in replacements for current key exchange and signature
                schemes.
              </p>
            </div>
          </div>
          <div className="card-light p-6 md:p-8 space-y-4 text-sm text-charcoal/60 leading-relaxed">
            <p>
              The urgency extends beyond future quantum computers. Today's encrypted data can
              be intercepted and stored by adversaries using a <Hl>"harvest now, decrypt later"</Hl> strategy
              — capturing encrypted communications today with the intent of decrypting them once
              quantum computers become available. This means sensitive data with long
              confidentiality requirements (medical records, state secrets, financial data) is
              already at risk.
            </p>
            <p>
              Organizations including NIST, NSA, and ENISA have recommended beginning the
              migration to quantum-safe algorithms <Hl>now</Hl>, before large-scale quantum computers
              exist. SHCE enables security professionals to experiment with these algorithms
              alongside classical ones, facilitating a smooth and informed transition.
            </p>
          </div>
        </Section>

        {/* ── Standards Compliance ───────────────────────────── */}
        <Section title="FIPS & NIST STANDARDS">
          <div className="card-light p-6 md:p-8 space-y-4 text-sm text-charcoal/60 leading-relaxed">
            <p>
              SHCE is built with strict adherence to <Hl>NIST</Hl> (National Institute of Standards
              and Technology) and <Hl>FIPS</Hl> (Federal Information Processing Standards) guidelines.
              Every algorithm implemented in the engine corresponds to a published standard:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <StandardCard code="FIPS 203" title="ML-KEM" desc="Module-Lattice-Based Key-Encapsulation Mechanism. Standardized August 2024." />
            <StandardCard code="FIPS 204" title="ML-DSA" desc="Module-Lattice-Based Digital Signature Algorithm. Standardized August 2024." />
            <StandardCard code="FIPS 186-5" title="ECDSA" desc="Digital Signature Standard for Elliptic Curve cryptography." />
            <StandardCard code="SP 800-38D" title="AES-GCM" desc="Galois/Counter Mode authenticated encryption recommendation." />
            <StandardCard code="PKCS#1 v2.2" title="RSA" desc="RSA Cryptography Standard with OAEP padding scheme." />
            <StandardCard code="SP 800-56C" title="KDF" desc="Key derivation for post-quantum hybrid encryption schemes." />
          </div>
        </Section>

        {/* ── How It Works — Flow Diagram ───────────────────── */}
        <Section title="HOW CRYPTOGRAPHIC OPERATIONS WORK">
          <p className="text-sm text-charcoal/50 mb-6 leading-relaxed">
            The following diagrams illustrate how encryption/decryption and signing/verification
            flow through the engine for both classical and post-quantum algorithms.
          </p>

          {/* Encryption Flow */}
          <div className="card-dark p-6 md:p-8 mb-4 !rounded-2xl">
            <h3 className="font-display text-xl uppercase text-golden mb-6">ENCRYPTION / DECRYPTION FLOW</h3>

            <div className="space-y-6">
              {/* Classical */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sage/40 block mb-3">Classical (RSA)</span>
                <FlowRow steps={[
                  { label: 'Plaintext', color: 'white' },
                  { label: 'RSA-OAEP Encrypt\nwith Public Key', color: 'golden' },
                  { label: 'Ciphertext\n(Base64)', color: 'sage' },
                  { label: 'RSA-OAEP Decrypt\nwith Private Key', color: 'golden' },
                  { label: 'Plaintext', color: 'white' },
                ]} />
              </div>

              <div className="border-t border-sage/10" />

              {/* AES */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sage/40 block mb-3">Classical (AES-GCM)</span>
                <FlowRow steps={[
                  { label: 'Plaintext', color: 'white' },
                  { label: 'AES-GCM Encrypt\n+ Random IV', color: 'golden' },
                  { label: 'IV + Ciphertext\n+ Auth Tag', color: 'sage' },
                  { label: 'AES-GCM Decrypt\nExtract IV', color: 'golden' },
                  { label: 'Plaintext', color: 'white' },
                ]} />
              </div>

              <div className="border-t border-sage/10" />

              {/* ML-KEM */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sage/40 block mb-3">Post-Quantum (ML-KEM Hybrid)</span>
                <FlowRow steps={[
                  { label: 'Plaintext', color: 'white' },
                  { label: 'KEM Encapsulate\n→ Shared Secret', color: 'golden' },
                  { label: 'AES-256-GCM\nEncrypt', color: 'golden' },
                  { label: 'Encapsulation\n+ IV + Ciphertext', color: 'sage' },
                ]} />
                <div className="mt-2" />
                <FlowRow steps={[
                  { label: 'Combined\nPayload', color: 'sage' },
                  { label: 'KEM Decapsulate\n→ Shared Secret', color: 'golden' },
                  { label: 'AES-256-GCM\nDecrypt', color: 'golden' },
                  { label: 'Plaintext', color: 'white' },
                ]} />
              </div>
            </div>
          </div>

          {/* Signing Flow */}
          <div className="card-dark p-6 md:p-8 !rounded-2xl">
            <h3 className="font-display text-xl uppercase text-golden mb-6">SIGNING / VERIFICATION FLOW</h3>

            <div className="space-y-6">
              {/* Classical Sign */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sage/40 block mb-3">Classical (RSA / ECDSA)</span>
                <FlowRow steps={[
                  { label: 'Message', color: 'white' },
                  { label: 'SHA-256 Hash\n+ Sign with\nPrivate Key', color: 'golden' },
                  { label: 'Signature\n(Base64)', color: 'sage' },
                ]} />
                <div className="mt-2" />
                <FlowRow steps={[
                  { label: 'Message +\nSignature', color: 'sage' },
                  { label: 'SHA-256 Hash\n+ Verify with\nPublic Key', color: 'golden' },
                  { label: 'VALID ✓\nor INVALID ✕', color: 'white' },
                ]} />
              </div>

              <div className="border-t border-sage/10" />

              {/* ML-DSA */}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sage/40 block mb-3">Post-Quantum (ML-DSA)</span>
                <FlowRow steps={[
                  { label: 'Message', color: 'white' },
                  { label: 'ML-DSA Sign\nwith Private Key\n(Lattice-based)', color: 'golden' },
                  { label: 'Signature\n(Base64)', color: 'sage' },
                ]} />
                <div className="mt-2" />
                <FlowRow steps={[
                  { label: 'Message +\nSignature', color: 'sage' },
                  { label: 'ML-DSA Verify\nwith Public Key\n(Lattice-based)', color: 'golden' },
                  { label: 'VALID ✓\nor INVALID ✕', color: 'white' },
                ]} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Architecture ──────────────────────────────────── */}
        <Section title="ARCHITECTURE">
          <div className="card-light p-6 md:p-8 space-y-4 text-sm text-charcoal/60 leading-relaxed">
            <p>
              Requests flow through the <Code>CryptoController</Code> → <Code>AlgoRouter</Code> which
              inspects the algorithm's mode and dispatches to <Code>ClassicalCryptoService</Code> or{' '}
              <Code>PQCryptoService</Code>. Keys are parsed from PEM format using Bouncy Castle's{' '}
              <Code>PEMParser</Code>, supporting both PKCS#8 and traditional PEM formats.
            </p>
            <p>
              The system is <Hl>fully stateless</Hl>. No keys, no sessions, no database. Users generate
              keys on demand or upload their own .pem files. Keys are used for the requested
              operation and immediately discarded from server memory.
            </p>
          </div>
        </Section>

        {/* ── Classical Algorithms ───────────────────────────── */}
        <Section title="CLASSICAL ALGORITHMS">
          <AlgoCard name="RSA-2048 / RSA-4096" standard="PKCS#1 v2.2"
            desc="Asymmetric encryption and digital signatures. Uses OAEP padding with SHA-256 for encryption and SHA256withRSA for signature generation and verification." />
          <AlgoCard name="ECDSA P-256 / P-384" standard="FIPS 186-5"
            desc="Elliptic Curve Digital Signature Algorithm. Provides equivalent security to RSA with significantly smaller key sizes. P-256 uses SHA-256, P-384 uses SHA-384." />
          <AlgoCard name="AES-128-GCM / AES-256-GCM" standard="SP 800-38D"
            desc="Authenticated symmetric encryption using Galois/Counter Mode. 96-bit IV (randomly generated), 128-bit authentication tag. IV is prepended to ciphertext in the output." />
        </Section>

        {/* ── Post-Quantum Algorithms ───────────────────────── */}
        <Section title="POST-QUANTUM ALGORITHMS">
          <AlgoCard name="ML-KEM-512 / 768 / 1024" standard="FIPS 203" accent
            desc="Module-Lattice-Based Key Encapsulation Mechanism (formerly CRYSTALS-Kyber). Used for hybrid encryption: KEM encapsulation produces a shared secret, which is used to derive an AES-256-GCM key for symmetric encryption of the actual data." />
          <AlgoCard name="ML-DSA-44 / 65 / 87" standard="FIPS 204" accent
            desc="Module-Lattice-Based Digital Signature Algorithm (formerly CRYSTALS-Dilithium). Direct signing and verification of arbitrary data. Security levels correspond roughly to AES-128, AES-192, and AES-256." />
        </Section>

        {/* ── Key Formats ───────────────────────────────────── */}
        <Section title="KEY FORMATS">
          <div className="card-dark p-6 md:p-8 space-y-3">
            <FormatRow label="Private" value="PKCS#8 DER encoded, PEM wrapped — BEGIN PRIVATE KEY. Also supports traditional format (BEGIN RSA PRIVATE KEY)." />
            <FormatRow label="Public" value="X.509 SubjectPublicKeyInfo DER encoded, PEM wrapped — BEGIN PUBLIC KEY." />
            <FormatRow label="AES" value="Raw key bytes, Base64-encoded (no PEM wrapper — symmetric keys have no standard PEM format)." />
          </div>
        </Section>

        {/* ── Tech Stack ────────────────────────────────────── */}
        <Section title="TECH STACK">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Java 21', 'Spring Boot 3.3', 'Bouncy Castle 1.80', 'Maven',
              'React 18', 'Vite 5', 'Tailwind CSS 3', 'Axios'].map((t) => (
              <div key={t} className="card-light p-4 text-center text-sm font-mono text-charcoal/60">
                {t}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-2xl md:text-3xl uppercase text-charcoal mb-5">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Hl({ children }) {
  return <span className="text-charcoal font-medium">{children}</span>;
}

function Code({ children }) {
  return (
    <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-golden/15 text-charcoal">
      {children}
    </code>
  );
}

function AlgoCard({ name, standard, desc, accent }) {
  return (
    <div className="card-light p-5">
      <div className="flex items-center justify-between mb-2">
        <span className={`font-mono text-sm font-medium ${accent ? 'text-golden' : 'text-charcoal'}`}>{name}</span>
        <span className="text-xs font-mono text-charcoal/30">{standard}</span>
      </div>
      <p className="text-sm text-charcoal/50 leading-relaxed">{desc}</p>
    </div>
  );
}

function StandardCard({ code, title, desc }) {
  return (
    <div className="card-light p-5 flex gap-4">
      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-golden/10 flex flex-col items-center justify-center">
        <span className="font-display text-xs uppercase text-charcoal/40">{code.split(' ')[0]}</span>
        <span className="font-display text-lg uppercase text-charcoal">{code.split(' ')[1]}</span>
      </div>
      <div>
        <h4 className="font-display text-lg uppercase text-charcoal mb-1">{title}</h4>
        <p className="text-xs text-charcoal/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FormatRow({ label, value }) {
  return (
    <div className="flex gap-4">
      <span className="text-xs font-mono text-sage/40 w-16 flex-shrink-0 uppercase tracking-widest pt-0.5">{label}</span>
      <span className="text-sm text-sage/60">{value}</span>
    </div>
  );
}

function FlowRow({ steps }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const colors = {
          white: 'bg-white/10 text-white border-white/10',
          golden: 'bg-golden/10 text-golden border-golden/20',
          sage: 'bg-sage/5 text-sage/80 border-sage/15',
        };
        return (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className={`px-4 py-3 rounded-xl border text-center min-w-[120px] ${colors[step.color]}`}>
              <span className="text-xs font-mono whitespace-pre-line leading-relaxed">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={14} className="text-sage/30 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
