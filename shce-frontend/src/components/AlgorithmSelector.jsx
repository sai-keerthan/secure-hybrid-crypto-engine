const algorithmData = {
  CLASSICAL: [
    { id: 'RSA_2048', label: 'RSA-2048', ops: 'Encrypt · Decrypt · Sign · Verify', family: 'RSA' },
    { id: 'RSA_4096', label: 'RSA-4096', ops: 'Encrypt · Decrypt · Sign · Verify', family: 'RSA' },
    { id: 'EC_P256', label: 'ECDSA P-256', ops: 'Sign · Verify', family: 'EC' },
    { id: 'EC_P384', label: 'ECDSA P-384', ops: 'Sign · Verify', family: 'EC' },
    { id: 'AES_128_GCM', label: 'AES-128-GCM', ops: 'Encrypt · Decrypt', family: 'AES' },
    { id: 'AES_256_GCM', label: 'AES-256-GCM', ops: 'Encrypt · Decrypt', family: 'AES' },
  ],
  POST_QUANTUM: [
    { id: 'ML_KEM_512', label: 'ML-KEM-512', ops: 'Encrypt · Decrypt', family: 'ML-KEM' },
    { id: 'ML_KEM_768', label: 'ML-KEM-768', ops: 'Encrypt · Decrypt', family: 'ML-KEM' },
    { id: 'ML_KEM_1024', label: 'ML-KEM-1024', ops: 'Encrypt · Decrypt', family: 'ML-KEM' },
    { id: 'ML_DSA_44', label: 'ML-DSA-44', ops: 'Sign · Verify', family: 'ML-DSA' },
    { id: 'ML_DSA_65', label: 'ML-DSA-65', ops: 'Sign · Verify', family: 'ML-DSA' },
    { id: 'ML_DSA_87', label: 'ML-DSA-87', ops: 'Sign · Verify', family: 'ML-DSA' },
  ],
};

export default function AlgorithmSelector({ mode, selectedAlgorithm, onSelectAlgorithm }) {
  const algorithms = algorithmData[mode] || [];
  const families = {};
  algorithms.forEach((a) => { if (!families[a.family]) families[a.family] = []; families[a.family].push(a); });

  return (
    <div className="space-y-5">
      {Object.entries(families).map(([family, algos]) => (
        <div key={family}>
          <span className="section-label block mb-3">{family}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {algos.map((algo) => {
              const selected = selectedAlgorithm === algo.id;
              return (
                <button key={algo.id} onClick={() => onSelectAlgorithm(algo.id)}
                  className={`text-left p-5 rounded-xl border transition-all duration-300 ease-smooth
                    ${selected
                      ? 'bg-golden/10 border-golden shadow-sm'
                      : 'bg-cream border-charcoal/5 hover:border-charcoal/15 hover:-translate-y-1'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-mono text-sm font-medium ${selected ? 'text-charcoal' : 'text-charcoal/80'}`}>
                      {algo.label}
                    </span>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-golden" />}
                  </div>
                  <span className="text-xs text-charcoal/40">{algo.ops}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
