import { Shield, Atom, XCircle, CheckCircle } from 'lucide-react';

const modes = [
  {
    id: 'CLASSICAL',
    title: 'CLASSICAL',
    subtitle: 'RSA · ECDSA · AES-GCM',
    description: 'Time-tested algorithms built on mathematical hardness. Battle-tested over decades.',
    icon: Shield,
    dark: false,
  },
  {
    id: 'POST_QUANTUM',
    title: 'POST-QUANTUM',
    subtitle: 'ML-KEM · ML-DSA',
    description: 'NIST FIPS 203/204 lattice-based algorithms. Quantum-safe by design.',
    icon: Atom,
    dark: true,
  },
];

export default function ModeSelector({ selectedMode, onSelectMode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-charcoal/10">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const selected = selectedMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`text-left p-8 md:p-10 relative transition-all duration-300 ease-smooth
              ${mode.dark ? 'bg-charcoal text-white' : 'bg-white text-charcoal'}
              ${selected ? 'ring-2 ring-golden ring-inset' : ''}`}
          >
            {selected && (
              <div className="absolute top-6 right-6">
                <CheckCircle size={20} className="text-golden" />
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5
              ${mode.dark ? 'bg-white/5' : 'bg-charcoal/5'}`}>
              <Icon size={22} className={mode.dark ? 'text-golden' : 'text-charcoal'} />
            </div>

            <h3 className="font-display text-3xl uppercase leading-display mb-2">
              {mode.title}
            </h3>
            <p className={`text-xs font-mono uppercase tracking-widest mb-3
              ${mode.dark ? 'text-sage/50' : 'text-charcoal/40'}`}>
              {mode.subtitle}
            </p>
            <p className={`text-sm leading-relaxed
              ${mode.dark ? 'text-sage/60' : 'text-charcoal/60'}`}>
              {mode.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
