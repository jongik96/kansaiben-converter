import { useState, useEffect } from 'react';

export default function Hakataben() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 페이지 로드 후에만 실행될 fetch 요청
    const fetchData = async () => {
      if (!text.trim()) return;

      setLoading(true);
      setResult('');
      setError('');

      try {
        const response = await fetch('/api/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, dialect: 'hakataben' }),
        });

        if (!response.ok) {
          throw new Error('変換エラー');
        }

        const data = await response.json();

        const result = data.hakataben?.trim();  // 변환된 텍스트 가져오기

        if (!result) {
          setError('変換されたテキストがありません');
          return;
        }

        setResult(result);  // 변환된 텍스트 화면에 출력
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchData(); // useEffect 내에서만 실행되는 fetch 요청

  }, [text]); // text가 변경될 때마다 실행

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    
    // 이전 음성 중지
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(v => v.lang === 'ja-JP'); // 일본어 음성
    synth.speak(utterance);
  };

  return (
    <div className="container">
      <h1>博多弁変換ツール</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに標準日本語を入力してください"
      />
      <button onClick={() => setText(text)} disabled={loading}>
        {loading ? '変換中...' : '博多弁に変換する'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>変換結果:</h2>
          <p>{result}</p>
          <button onClick={() => speakText(result)}>音声で読む</button> {/* 음성으로 읽어주기 버튼 */}
        </div>
      )}
    </div>
  );
}
