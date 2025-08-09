// pages/hakataben.js
import { useState } from 'react';

export default function Hakataben() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emotion, setEmotion] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleConvert = async () => {
    setLoading(true);

    if (!text.trim()) {
      alert("おっと！日本語を入力してね！");
      setLoading(false);
      return;
    }

    const isJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu.test(text);
    if (!isJapanese) {
      alert("日本語だけを入力してくださいね！");
      setLoading(false);
      return;
    }

    if (text.length > 100) {
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, emotion, dialect: 'hakataben' }),
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      setResult(data.hakataben);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(v => v.lang === 'ja-JP');
    synth.speak(utterance);
  };

  const handleSpeakClick = () => {
    speakText(result);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className="container">
      <h1>博多弁変換ツール</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに標準日本語を入力してください"
        onKeyDown={handleKeyDown}
        maxLength="100"
      />
      <div>
        <span>{text.length} / 100</span>
      </div>

      <div className="options">
        <label htmlFor="emotion">感情選択:</label>
        <select 
          id="emotion"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        >
          <option value="">感情を選んでください</option>
          <option value="happy">嬉しい</option>
          <option value="sad">悲しい</option>
          <option value="angry">怒っている</option>
          <option value="excited">興奮している</option>
        </select>
      </div>

      <button onClick={handleConvert} disabled={loading}>
        {loading ? '変換中...' : '博多弁に変換する'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>変換結果:</h2>
          <p>{result}</p>
          <button onClick={handleSpeakClick}>音声で聞く</button>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>おっと！100文字を超えているよ！</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}

      {loading && <div className="loading">変換中...</div>}
    </div>
  );
}
