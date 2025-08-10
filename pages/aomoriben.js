import { useState } from 'react';

export default function Aomoriben() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const speakText = (t) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(t);
    utter.voice = synth.getVoices().find(v => v.lang === 'ja-JP');
    synth.speak(utter);
  };

  const addPunctuation = (t) => (t && !/[.!?。]$/.test(t) ? t + '。' : t);

  const handleConvert = async () => {
    if (!text.trim()) { alert('おっと！日本語を入力してね！'); return; }
    setLoading(true); setResult(''); setError('');
    try {
      const formattedText = addPunctuation(text);
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formattedText, dialect: 'aomoriben' }),
      });
      if (!res.ok) throw new Error('変換エラー');
      const data = await res.json();
      const out = data.aomoriben?.trim();
      if (!out) { setError('変換されたテキストがありません'); return; }
      setResult(out);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>青森弁変換ツール</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="ここに標準日本語を入力してください" />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? '変換中...' : '青森弁に変換する'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>変換結果:</h2>
          <p>{result}</p>
          <button onClick={() => speakText(result)}>音声で読む</button>
        </div>
      )}
    </div>
  );
}
