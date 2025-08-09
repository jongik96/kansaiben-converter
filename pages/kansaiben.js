import { useState } from 'react';

export default function Kansaiben() {
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
        body: JSON.stringify({ text, dialect: 'kansaiben' }), // 다이얼렉트 전달
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();

      // 응답 데이터 확인용 로그 추가
      console.log('API Response:', data);

      // 변환된 텍스트가 비어있지 않으면 출력
      const result = data.kansaiben?.trim();  // 변환된 텍스트 가져오기

      if (!result) {
        setError('Please Input Text');
        return;
      }

      setResult(result);  // 텍스트가 비어있지 않으면 화면에 출력
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div className="container">
      <h1>関西弁変換ツール</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに標準日本語を入力してください"
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? '変換中...' : '関西弁に変換する'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <div><h2>変換結果:</h2><p>{result}</p></div>}
    </div>
  );
}
