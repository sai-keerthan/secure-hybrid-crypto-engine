export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div>
            <h3 className="font-display text-3xl uppercase mb-3">
              SHCE<span className="text-golden">.</span>
            </h3>
            <p className="text-sm text-sage/60 leading-relaxed">
              Classical and post-quantum cryptography, unified in one engine.
            </p>
          </div>
          <div>
            <h4 className="section-label !text-sage/40 mb-4">Classical</h4>
            <ul className="space-y-2 text-sm text-sage/50">
              <li>RSA-2048 / 4096</li>
              <li>ECDSA P-256 / P-384</li>
              <li>AES-128 / 256-GCM</li>
            </ul>
          </div>
          <div>
            <h4 className="section-label !text-sage/40 mb-4">Post-Quantum</h4>
            <ul className="space-y-2 text-sm text-sage/50">
              <li>ML-KEM (FIPS 203)</li>
              <li>ML-DSA (FIPS 204)</li>
              <li>Bouncy Castle 1.80</li>
            </ul>
          </div>
          <div>
            <h4 className="section-label !text-sage/40 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-sage/50">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>GitHub</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-sage/10">
          <span className="text-xs text-sage/30">&copy; 2025 Secure Hybrid Crypto Engine</span>
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
