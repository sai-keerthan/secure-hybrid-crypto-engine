import { useState } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import ModeSelector from '../components/ModeSelector';
import AlgorithmSelector from '../components/AlgorithmSelector';
import KeyManager from '../components/KeyManager';
import CryptoOperations from '../components/CryptoOperations';

const steps = [
  { id: 1, label: 'MODE' },
  { id: 2, label: 'ALGORITHM' },
  { id: 3, label: 'KEYS' },
  { id: 4, label: 'OPERATIONS' },
];

export default function EnginePage() {
  const [mode, setMode] = useState(null);
  const [algorithm, setAlgorithm] = useState(null);
  const [keyData, setKeyData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleModeSelect = (m) => { setMode(m); setAlgorithm(null); setKeyData(null); setCurrentStep(2); };
  const handleAlgorithmSelect = (a) => { setAlgorithm(a); setKeyData(null); setCurrentStep(3); };
  const handleKeysReady = (d) => { setKeyData(d); setCurrentStep(4); };
  const resetToStep = (s) => {
    if (s > currentStep) return;
    setCurrentStep(s);
    if (s <= 1) { setMode(null); setAlgorithm(null); setKeyData(null); }
    if (s <= 2) { setAlgorithm(null); setKeyData(null); }
    if (s <= 3) { setKeyData(null); }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 grid-bg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-5xl md:text-6xl uppercase leading-display text-charcoal mb-3">
            CRYPTO <span className="highlight-bar">ENGINE</span>
          </h1>
          <p className="text-charcoal/50 max-w-lg">
            Select your paradigm, generate or upload keys, and perform operations.
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5 mb-10 overflow-x-auto pb-2">
          {steps.map((step, i) => {
            const active = currentStep >= step.id;
            const current = currentStep === step.id;
            return (
              <div key={step.id} className="flex items-center gap-1.5">
                <button onClick={() => resetToStep(step.id)} disabled={!active}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-display uppercase
                    tracking-wide whitespace-nowrap transition-all duration-300 ease-smooth
                    ${current ? 'bg-golden text-charcoal' :
                      active ? 'text-charcoal/60 hover:text-charcoal cursor-pointer' :
                      'text-charcoal/20 cursor-default'}`}>
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold
                    ${current ? 'bg-charcoal text-golden' : active ? 'bg-charcoal/10 text-charcoal/50' : 'bg-charcoal/5 text-charcoal/20'}`}>
                    {step.id}
                  </span>
                  {step.label}
                </button>
                {i < steps.length - 1 && <ChevronRight size={12} className="text-charcoal/15 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Step 1 */}
        {currentStep >= 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Cryptographic Mode</span>
              {mode && (
                <span className="text-xs font-display uppercase px-3 py-1 rounded-lg bg-golden/15 text-charcoal">
                  {mode === 'CLASSICAL' ? 'Classical' : 'Post-Quantum'}
                </span>
              )}
            </div>
            <ModeSelector selectedMode={mode} onSelectMode={handleModeSelect} />
          </div>
        )}

        {/* Step 2 */}
        {currentStep >= 2 && mode && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Algorithm</span>
              {algorithm && (
                <span className="text-xs font-mono px-3 py-1 rounded-lg bg-charcoal/5 text-charcoal/60">
                  {algorithm}
                </span>
              )}
            </div>
            <AlgorithmSelector mode={mode} selectedAlgorithm={algorithm} onSelectAlgorithm={handleAlgorithmSelect} />
          </div>
        )}

        {/* Step 3 */}
        {currentStep >= 3 && algorithm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Key Management</span>
              {keyData && (
                <span className="text-xs font-medium px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Keys Ready
                </span>
              )}
            </div>
            <div className="card-light p-6 md:p-8">
              <KeyManager algorithm={algorithm} onKeysReady={handleKeysReady} />
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep >= 4 && keyData ? (
          <div>
            <span className="section-label block mb-4">Cryptographic Operations</span>
            <div className="card-light p-6 md:p-8">
              <CryptoOperations algorithm={algorithm} keyData={keyData} />
            </div>
          </div>
        ) : currentStep >= 3 && algorithm && !keyData && (
          <div className="card-light p-10 text-center">
            <Lock size={28} className="mx-auto mb-3 text-charcoal/20" />
            <p className="text-sm text-charcoal/40">Generate or upload keys to unlock operations</p>
          </div>
        )}
      </div>
    </div>
  );
}
