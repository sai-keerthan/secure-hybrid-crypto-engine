import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, PenLine, ShieldCheck, Loader2, Copy, CheckCircle } from 'lucide-react';
import { encrypt, decrypt, sign, verify } from '../services/api';

const operations = [
  { id: 'ENCRYPT', label: 'Encrypt', icon: Lock },
  { id: 'DECRYPT', label: 'Decrypt', icon: Unlock },
  { id: 'SIGN', label: 'Sign', icon: PenLine },
  { id: 'VERIFY', label: 'Verify', icon: ShieldCheck },
];

const familyOps = { RSA: ['ENCRYPT','DECRYPT','SIGN','VERIFY'], EC: ['SIGN','VERIFY'], AES: ['ENCRYPT','DECRYPT'], 'ML-KEM': ['ENCRYPT','DECRYPT'], 'ML-DSA': ['SIGN','VERIFY'] };

function getFamily(a) {
  if (a.startsWith('RSA')) return 'RSA'; if (a.startsWith('EC')) return 'EC';
  if (a.startsWith('AES')) return 'AES'; if (a.startsWith('ML_KEM')) return 'ML-KEM';
  if (a.startsWith('ML_DSA')) return 'ML-DSA'; return '';
}

export default function CryptoOperations({ algorithm, keyData }) {
  const [selectedOp, setSelectedOp] = useState(null);
  const [inputData, setInputData] = useState('');
  const [keyPem, setKeyPem] = useState('');
  const [signatureBase64, setSignatureBase64] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const family = getFamily(algorithm);
  const supportedOps = familyOps[family] || [];
  const needsPublicKey = selectedOp === 'ENCRYPT' || selectedOp === 'VERIFY';
  const isSymmetric = family === 'AES';

  const prevOpRef = useRef(null);

  // Only auto-fills the correct key when operation is confirmed and set
  useEffect(() => {
    if (!selectedOp || !keyData) return;
    if (isSymmetric) {
      setKeyPem(keyData.privateKeyPem || '');
    } else if (needsPublicKey) {
      setKeyPem(keyData.publicKeyPem || '');
    } else {
      setKeyPem(keyData.privateKeyPem || '');
    }
  }, [selectedOp]);

  // Handle operation button click — shows alert BEFORE any state change
  const handleOpSelect = (opId) => {
    if (!opId) return;

    // Only prompt if switching FROM a completed operation WITH output
    if (prevOpRef.current && prevOpRef.current !== opId && result?.outputData) {
      const outputLabel =
        prevOpRef.current === 'ENCRYPT' ? 'ciphertext' :
        prevOpRef.current === 'SIGN'    ? 'signature'  :
        prevOpRef.current === 'DECRYPT' ? 'decrypted text' : 'output';

      const confirmed = window.confirm(
        `Switching operations will clear all fields.\n\n` +
        `Make sure you have copied your ${outputLabel} before continuing.\n\nProceed?`
      );

      // User clicked Cancel — do nothing, preserve all fields exactly as they are
      if (!confirmed) return;
    }

    // User confirmed (or no prompt needed) — now clear and switch
    prevOpRef.current = opId;
    setSelectedOp(opId);
    setInputData('');
    setSignatureBase64('');
    setResult(null);
  };

  const handleExecute = async () => {
    setLoading(true); setResult(null);
    try {
      let res;
      switch (selectedOp) {
        case 'ENCRYPT': res = await encrypt(algorithm, inputData, keyPem); break;
        case 'DECRYPT': res = await decrypt(algorithm, inputData, keyPem); break;
        case 'SIGN': res = await sign(algorithm, inputData, keyPem); break;
        case 'VERIFY': res = await verify(algorithm, inputData, keyPem, signatureBase64); break;
      }
      setResult(res.data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Operation failed', outputData: null });
    } finally { setLoading(false); }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(result?.outputData || '');
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const blockInput = (e) => { e.preventDefault(); };

  return (
    <div className="space-y-5">
      <div>
        <span className="section-label block mb-3">Operation</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {operations.map((op) => {
            const Icon = op.icon;
            const supported = supportedOps.includes(op.id);
            const selected = selectedOp === op.id;
            return (
              <button key={op.id} onClick={() => supported && handleOpSelect(op.id)} disabled={!supported}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-smooth
                  ${!supported ? 'opacity-20 cursor-not-allowed bg-cream border border-charcoal/5' :
                    selected ? 'bg-golden text-charcoal border border-golden shadow-sm' :
                    'bg-cream border border-charcoal/5 text-charcoal/60 hover:border-charcoal/15 hover:text-charcoal'}`}>
                <Icon size={16} />
                {op.label}
              </button>
            );
          })}
        </div>
      </div>

      {selectedOp && (
        <div className="space-y-4">
          <div>
            <span className="section-label block mb-2">
              {selectedOp === 'DECRYPT' ? 'Ciphertext (Base64)' : 'Input Data'}
            </span>
            <textarea className="textarea-field h-28"
              placeholder={selectedOp === 'DECRYPT' ? 'Paste Base64-encoded ciphertext...' : 'Enter your plaintext message...'}
              value={inputData} onChange={(e) => setInputData(e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="section-label">
                {isSymmetric ? 'Secret Key' : needsPublicKey ? 'Public Key (PEM)' : 'Private Key (PEM)'}
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle size={12} />
                Auto-loaded from keys
              </span>
            </div>
            <textarea className="textarea-field h-28 bg-cream/80 cursor-not-allowed"
                      value={keyPem}
                      readOnly
                      onPaste={blockInput}
                      onCopy={blockInput}
                      onCut={blockInput}
                      tabIndex={-1}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      style={{ userSelect: 'none' }}
            />
          </div>

          {selectedOp === 'VERIFY' && (
            <div>
              <span className="section-label block mb-2">Signature (Base64)</span>
              <textarea className="textarea-field h-20"
                placeholder="Paste Base64-encoded signature..."
                value={signatureBase64} onChange={(e) => setSignatureBase64(e.target.value)} />
            </div>
          )}

          <button onClick={handleExecute} disabled={loading || !inputData || !keyPem}
            className="btn-golden w-full justify-center disabled:opacity-30 disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Execute ${selectedOp}`}
          </button>

          {result && (
            <div className={`p-5 rounded-xl border ${result.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${result.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {result.message}
                </span>
                {result.outputData && (
                  <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-charcoal/40 hover:text-charcoal">
                    {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              {result.outputData && (
                <pre className="text-xs font-mono text-charcoal/60 bg-white p-3 rounded-lg overflow-x-auto max-h-40 overflow-y-auto break-all whitespace-pre-wrap">
                  {result.outputData}
                </pre>
              )}
              {result.processingTimeMs != null && (
                  <p className="text-xs font-mono text-charcoal/30 mt-2">Processed in {result.processingTimeMs}ms</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
