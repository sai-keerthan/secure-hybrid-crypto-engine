import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Atom, KeyRound, Lock, PenLine, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Shield, title: 'CLASSICAL CRYPTO', desc: 'RSA, ECDSA, AES-GCM — decades of deployment history and mathematical rigor.', span: 2, dark: false },
  { icon: Atom, title: 'POST-QUANTUM', desc: 'ML-KEM and ML-DSA per NIST FIPS 203/204. Lattice-based, quantum-safe.', span: 1, dark: true },
  { icon: KeyRound, title: 'KEY GENERATION', desc: 'Generate or upload PEM keys. PKCS#8 private, X.509 SPKI public.', span: 1, dark: true },
  { icon: Lock, title: 'HYBRID ENCRYPTION', desc: 'ML-KEM encapsulation + AES-256-GCM. Quantum-safe key exchange with symmetric speed.', span: 2, dark: false },
  { icon: PenLine, title: 'DIGITAL SIGNATURES', desc: 'Sign with RSA, ECDSA, or ML-DSA. Verify integrity in one step.', span: 1, dark: false },
  { icon: ShieldCheck, title: 'ZERO PERSISTENCE', desc: 'Keys never stored on server. Fully stateless architecture.', span: 1, dark: false },
];

const steps = [
  { num: '01', title: 'SELECT MODE', desc: 'Choose between classical and post-quantum cryptographic paradigms.' },
  { num: '02', title: 'SETUP KEYS', desc: 'Generate a fresh key pair or upload your existing PEM files.' },
  { num: '03', title: 'EXECUTE', desc: 'Encrypt, decrypt, sign, or verify — all from one unified interface.' },
];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="min-h-screen grid-bg flex flex-col items-center justify-center px-6 text-center pt-20">
        {/* Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-charcoal/10 mb-10
          animate-fade-up">
          <div className="w-2 h-2 rounded-full bg-golden" />
          <span className="text-xs font-medium tracking-widest uppercase text-charcoal/50">
            Bouncy Castle 1.84 · Java 21
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-display
          text-charcoal mb-8 animate-fade-up-d1">
          SECURITY,<br />
          <span className="highlight-bar">REDEFINED</span>.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-charcoal/60 max-w-xl leading-relaxed mb-10 animate-fade-up-d2">
          The first hybrid cryptography engine unifying classical and post-quantum
          algorithms. Generate keys, encrypt, sign — all from one interface.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-4 animate-fade-up-d3">
          <Link to="/engine" className="btn-golden group">
            START BUILDING
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link to="/about" className="text-sm font-medium text-charcoal/40 hover:text-charcoal transition-colors">
            Read Documentation →
          </Link>
        </div>
      </section>

      {/* ── Problem / Solution ──────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* Problem */}
        <div className="bg-charcoal p-10 md:p-16">
          <h2 className="font-display text-4xl md:text-5xl uppercase text-white leading-display mb-6">
            THE OLD WAY
          </h2>
          <ul className="space-y-4">
            {['Separate tools for each algorithm', 'No post-quantum readiness', 'Keys scattered across systems', 'Complex API integrations'].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sage/60 text-sm">
                <span className="text-red-400 mt-0.5 text-lg leading-none">✕</span> {t}
              </li>
            ))}
          </ul>
        </div>
        {/* Solution */}
        <div className="bg-darkgray p-10 md:p-16 border-l-4 border-golden">
          <h2 className="font-display text-4xl md:text-5xl uppercase text-white leading-display mb-6">
            THE SHCE WAY
          </h2>
          <ul className="space-y-4">
            {['One engine, 12 algorithms', 'NIST FIPS 203/204 compliant', 'Generate or upload — your keys, your control', 'Clean REST API, zero persistence'].map((t) => (
              <li key={t} className="flex items-start gap-3 text-white text-sm">
                <span className="text-golden mt-0.5 text-lg leading-none">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Bento Features ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display text-5xl md:text-6xl uppercase leading-display text-charcoal mb-4">
          BUILT FOR <span className="highlight-bar">TRUST</span>.
        </h2>
        <p className="text-charcoal/50 max-w-xl mb-14 text-base leading-relaxed">
          Every algorithm backed by Bouncy Castle's FIPS-grade cryptographic primitives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title}
                className={`${f.dark ? 'card-dark' : 'card-light'} p-8 flex flex-col justify-between
                  ${f.span === 2 ? 'md:col-span-2' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${f.dark ? 'bg-golden/15' : 'bg-charcoal/5'}`}>
                  <Icon size={20} className={f.dark ? 'text-golden' : 'text-charcoal'} />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase mb-1">{f.title}</h3>
                  <p className={`text-xs leading-relaxed ${f.dark ? 'text-sage/50' : 'text-charcoal/50'}`}>{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          <div className="md:col-span-1">
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-display text-charcoal sticky top-28">
              HOW IT<br />WORKS<span className="text-golden">.</span>
            </h2>
          </div>
          <div className="md:col-span-2 space-y-12">
            {steps.map((s) => (
              <div key={s.num} className="group cursor-default">
                <div className="flex items-start gap-6">
                  <span className="font-display text-7xl md:text-8xl text-golden/20 leading-none
                    group-hover:text-golden/80 transition-colors duration-500 ease-smooth select-none">
                    {s.num}
                  </span>
                  <div className="pt-3">
                    <h3 className="font-display text-2xl uppercase mb-2 text-charcoal">{s.title}</h3>
                    <p className="text-sm text-charcoal/50 leading-relaxed max-w-md">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="relative bg-golden overflow-hidden">
        {/* Background text decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-display text-[12rem] md:text-[20rem] uppercase text-charcoal/5 leading-none">
            SHCE
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-display text-charcoal mb-6">
            START<br />BUILDING<span className="text-white">.</span>
          </h2>
          <p className="text-xl md:text-2xl text-charcoal/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Classical strength meets quantum resilience. One engine, twelve algorithms, zero persistence.
          </p>
          <Link to="/engine"
            className="inline-flex items-center gap-3 px-10 py-5 bg-charcoal text-white font-display text-xl
              uppercase rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-smooth">
            LAUNCH ENGINE
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
