import { useState } from 'react';

export default function Nagoyaben() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!text.trim()) {
      alert("おっと！日本語を入力してね！");
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, dialect: 'nagoyaben' }), // 나고야벤 변환
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      setResult(data.nagoyaben); // 변환된 텍스트 출력
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>名古屋弁変換ツール</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに標準日本語を入力してください"
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? '変換中...' : '名古屋弁に変換する'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <div><h2>変換結果:</h2><p>{result}</p></div>}
    </div>
  );
}
