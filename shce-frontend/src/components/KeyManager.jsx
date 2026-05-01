import { useState, useRef, useEffect } from 'react';
import { KeyRound, Upload, Download, Loader2, CheckCircle, FileKey, X } from 'lucide-react';
import { generateKeys } from '../services/api';

export default function KeyManager({ algorithm, onKeysReady }) {
  const [keySource, setKeySource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedKeys, setGeneratedKeys] = useState(null);
  const [publicDownloaded, setPublicDownloaded] = useState(false);
  const [privateDownloaded, setPrivateDownloaded] = useState(false);
  const [publicKeyPem, setPublicKeyPem] = useState(null);
  const [privateKeyPem, setPrivateKeyPem] = useState(null);
  const [publicFileName, setPublicFileName] = useState(null);
  const [privateFileName, setPrivateFileName] = useState(null);
  const publicFileRef = useRef(null);
  const privateFileRef = useRef(null);

  const isSymmetric = algorithm?.startsWith('AES');

  const handleGenerate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await generateKeys(algorithm);
      setGeneratedKeys(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Key generation failed. Is the backend running?');
    } finally { setLoading(false); }
  };

  const downloadKey = (content, filename, type) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    if (type === 'public') setPublicDownloaded(true);
    if (type === 'private') setPrivateDownloaded(true);
  };

  const genReady = generatedKeys && (isSymmetric ? privateDownloaded : publicDownloaded && privateDownloaded);

  // Fire onKeysReady exactly once when both keys are downloaded — never during render
  useEffect(() => {
    if (genReady && generatedKeys) {
      onKeysReady({
        publicKeyPem: generatedKeys.publicKeyPem,
        privateKeyPem: generatedKeys.privateKeyPem,
        algorithm: generatedKeys.algorithm,
      });
    }
  }, [genReady]);

  const handleFileUpload = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'public') { setPublicKeyPem(e.target.result); setPublicFileName(file.name); }
      else { setPrivateKeyPem(e.target.result); setPrivateFileName(file.name); }
    };
    reader.readAsText(file);
  };

  const clearFile = (type) => {
    if (type === 'public') { setPublicKeyPem(null); setPublicFileName(null); }
    else { setPrivateKeyPem(null); setPrivateFileName(null); }
  };

  const uploadReady = isSymmetric ? !!privateKeyPem : (!!publicKeyPem && !!privateKeyPem);
  const handleProceedUpload = () => {
    onKeysReady({ publicKeyPem, privateKeyPem, algorithm });
  };

  // Choose source
  if (!keySource) {
    return (
      <div>
        <p className="text-sm text-charcoal/50 mb-5">
          Do you already have keys, or would you like to generate a new pair?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => setKeySource('generate')}
            className="card-light p-6 text-left group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-golden/15 flex items-center justify-center mb-4
              group-hover:scale-110 transition-transform duration-300 ease-smooth">
              <KeyRound size={20} className="text-charcoal" />
            </div>
            <h4 className="font-display text-xl uppercase mb-1">Generate Keys</h4>
            <p className="text-xs text-charcoal/45">Create a fresh key pair and download the PEM files.</p>
          </button>
          <button onClick={() => setKeySource('upload')}
            className="card-light p-6 text-left group cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-charcoal/5 flex items-center justify-center mb-4
              group-hover:scale-110 transition-transform duration-300 ease-smooth">
              <Upload size={20} className="text-charcoal" />
            </div>
            <h4 className="font-display text-xl uppercase mb-1">Upload Keys</h4>
            <p className="text-xs text-charcoal/45">Browse and upload your existing .pem key files.</p>
          </button>
        </div>
      </div>
    );
  }

  // Generate flow
  if (keySource === 'generate') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="section-label">Generate Key Pair</span>
          <button onClick={() => { setKeySource(null); setGeneratedKeys(null); setPublicDownloaded(false); setPrivateDownloaded(false); }}
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors">← Change method</button>
        </div>

        {!generatedKeys && (
          <button onClick={handleGenerate} disabled={loading} className="btn-golden w-full justify-center">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><KeyRound size={16} /> Generate Key Pair</>}
          </button>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {generatedKeys && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {[generatedKeys.algorithm, generatedKeys.keyFormat, `Size: ${generatedKeys.keySize}`].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg text-xs font-mono bg-cream border border-charcoal/5 text-charcoal/60">{t}</span>
              ))}
            </div>

            {generatedKeys.publicKeyPem && (
              <div className="card-dark p-5 !rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="section-label !text-sage/40">Public Key (X.509 SPKI)</span>
                  <button onClick={() => downloadKey(generatedKeys.publicKeyPem, `${algorithm.toLowerCase()}_public.pem`, 'public')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                      ${publicDownloaded ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-sage/60 border border-sage/10 hover:text-white'}`}>
                    {publicDownloaded ? <CheckCircle size={12} /> : <Download size={12} />}
                    {publicDownloaded ? 'Downloaded' : 'Download .pem'}
                  </button>
                </div>
                <pre className="text-xs font-mono text-sage/40 overflow-x-auto max-h-20 overflow-y-auto p-3 rounded-lg bg-black/30 leading-relaxed">
                  {generatedKeys.publicKeyPem}
                </pre>
              </div>
            )}

            <div className="card-dark p-5 !rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="section-label !text-sage/40">{isSymmetric ? 'Secret Key (Base64)' : 'Private Key (PKCS#8)'}</span>
                <button onClick={() => downloadKey(generatedKeys.privateKeyPem, `${algorithm.toLowerCase()}_private.pem`, 'private')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                    ${privateDownloaded ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-sage/60 border border-sage/10 hover:text-white'}`}>
                  {privateDownloaded ? <CheckCircle size={12} /> : <Download size={12} />}
                  {privateDownloaded ? 'Downloaded' : 'Download .pem'}
                </button>
              </div>
              <pre className="text-xs font-mono text-sage/40 overflow-x-auto max-h-20 overflow-y-auto p-3 rounded-lg bg-black/30 leading-relaxed">
                {generatedKeys.privateKeyPem}
              </pre>
            </div>

            {!genReady && (
              <p className="text-xs text-center text-amber-600 font-medium">
                Download {isSymmetric ? 'the secret key' : 'both keys'} to unlock operations
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Upload flow
  if (keySource === 'upload') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="section-label">Upload Key Files</span>
          <button onClick={() => { setKeySource(null); setPublicKeyPem(null); setPrivateKeyPem(null); setPublicFileName(null); setPrivateFileName(null); }}
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors">← Change method</button>
        </div>

        <div className={`grid grid-cols-1 ${isSymmetric ? '' : 'sm:grid-cols-2'} gap-4`}>
          {!isSymmetric && (
            <div>
              <span className="section-label block mb-2">Public Key (.pem)</span>
              {publicFileName ? (
                <div className="upload-zone active flex items-center justify-between !text-left !p-5">
                  <div className="flex items-center gap-3">
                    <FileKey size={20} className="text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-charcoal">{publicFileName}</p>
                      <p className="text-xs text-charcoal/40">Public key loaded</p>
                    </div>
                  </div>
                  <button onClick={() => clearFile('public')} className="p-1.5 rounded-lg hover:bg-charcoal/5">
                    <X size={14} className="text-charcoal/40" />
                  </button>
                </div>
              ) : (
                <div className="upload-zone" onClick={() => publicFileRef.current?.click()}>
                  <Upload size={24} className="mx-auto mb-2 text-charcoal/25" />
                  <p className="text-sm text-charcoal/50">Browse public key</p>
                  <p className="text-xs text-charcoal/25 mt-1">.pem file</p>
                  <input ref={publicFileRef} type="file" accept=".pem,.key,.pub,.txt" className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'public')} />
                </div>
              )}
            </div>
          )}
          <div>
            <span className="section-label block mb-2">{isSymmetric ? 'Secret Key (.pem)' : 'Private Key (.pem)'}</span>
            {privateFileName ? (
              <div className="upload-zone active flex items-center justify-between !text-left !p-5">
                <div className="flex items-center gap-3">
                  <FileKey size={20} className="text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{privateFileName}</p>
                    <p className="text-xs text-charcoal/40">{isSymmetric ? 'Secret' : 'Private'} key loaded</p>
                  </div>
                </div>
                <button onClick={() => clearFile('private')} className="p-1.5 rounded-lg hover:bg-charcoal/5">
                  <X size={14} className="text-charcoal/40" />
                </button>
              </div>
            ) : (
              <div className="upload-zone" onClick={() => privateFileRef.current?.click()}>
                <Upload size={24} className="mx-auto mb-2 text-charcoal/25" />
                <p className="text-sm text-charcoal/50">Browse {isSymmetric ? 'secret' : 'private'} key</p>
                <p className="text-xs text-charcoal/25 mt-1">.pem file</p>
                <input ref={privateFileRef} type="file" accept=".pem,.key,.txt" className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'private')} />
              </div>
            )}
          </div>
        </div>

        {uploadReady && (
          <button onClick={handleProceedUpload} className="btn-golden w-full justify-center">
            <CheckCircle size={16} /> Proceed to Operations
          </button>
        )}
      </div>
    );
  }
  return null;
}
