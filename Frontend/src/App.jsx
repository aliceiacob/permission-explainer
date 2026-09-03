import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const [domain, setDomain] = useState('');
  const [domainResult, setDomainResult] = useState(null);
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainError, setDomainError] = useState(null);

  const handleDomainCheck = async (e) => {
    e.preventDefault();
    setDomainLoading(true);
    setDomainError(null);
    setDomainResult(null);

    try {
      const res = await fetch('http://localhost:3000/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();

      if (!res.ok) {
        setDomainError(data.error);
      } else {
        setDomainResult(data);
      }
    } catch (err) {
      setDomainError(err.message);
    } finally {
      setDomainLoading(false);
    }
  };

  const matchPermissions = async (text) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch('http://localhost:3000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    matchPermissions(inputText);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOcrLoading(true);
    setError(null);

    try {
      const { data } = await Tesseract.recognize(file, 'eng');
      const extractedText = data.text;
      setInputText(extractedText);
      await matchPermissions(extractedText);
    } catch (err) {
      setError('Could not read text from that image.');
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Permission Explainer</h1>
      <p>Paste permission text, or upload a screenshot, to see what an app's permissions actually mean.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          placeholder="e.g. This app requires access to your Camera, Contacts, and Location"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Explain these permissions'}
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Or upload a screenshot:{' '}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {ocrLoading && <p>Reading text from image...</p>}
      </div>

      {error && <p>Error: {error}</p>}

      {searched && !loading && !ocrLoading && results.length === 0 && !error && (
        <p>No known permissions were found in that text.</p>
      )}

      <div className="permission-list">
        {results.map((perm) => (
          <div key={perm.name} className={`permission-card risk-${perm.riskLevel}`}>
            <h2>{perm.name}</h2>
            <span className="risk-badge">{perm.riskLevel.toUpperCase()} RISK</span>
            <p>{perm.explanation}</p>
            <p className="misuse"><strong>Could be misused to:</strong> {perm.misuseExample}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Check where this app came from</h2>
        <form onSubmit={handleDomainCheck}>
          <input
            type="text"
            placeholder="e.g. example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button type="submit" disabled={domainLoading}>
            {domainLoading ? 'Checking...' : 'Check domain'}
          </button>
        </form>

        {domainError && <p>Error: {domainError}</p>}

        {domainResult && (
          <div className={domainResult.malicious > 0 ? 'domain-flagged' : 'domain-clean'}>
            <p><strong>{domainResult.domain}</strong></p>
            <p>{domainResult.malicious} out of {domainResult.totalVendors} security vendors flagged this domain as malicious.</p>
            {domainResult.suspicious > 0 && <p>{domainResult.suspicious} flagged it as suspicious.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;