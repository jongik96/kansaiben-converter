import { useState } from 'react';

export async function getServerSideProps() {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  
  return { props: { data } };  // 서버사이드에서 데이터를 가져온 후, props로 전달
}

export default function Kansaiben({ data }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 텍스트를 음성으로 읽어주는 함수
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
        body: JSON.stringify({ text, dialect: 'kansaiben' }),
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      const result = data.kansaiben?.trim();  // 변환된 텍스트 가져오기

      if (!result) {
        setError('変換結果がありません');
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
