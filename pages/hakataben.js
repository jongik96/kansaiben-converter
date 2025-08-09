import { useState } from 'react';
import satoridic from '../public/satoridic.json';  // JSON 파일 경로

export default function Hakataben() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const cachedResults = {}; // 캐시 객체

  // JSON 파일에서 변환 규칙을 가져오는 함수
  const getDialectFromJson = (text, dialect) => {
    const dialectData = satoridic[dialect];
    return dialectData[text] || null; // 변환 가능하면 바로 반환, 없으면 null
  };

  // 텍스트를 음성으로 읽어주는 함수
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(v => v.lang === 'ja-JP'); // 일본어 기본 음성
    synth.speak(utterance); // 음성 합성
  };

  // 음성 듣기 버튼 클릭 시 음성을 출력하는 함수
  const handleSpeakClick = () => {
    speakText(result); // 변환된 텍스트를 음성으로 읽어줌
  };

  // 변환 버튼 클릭 시 API 호출
  const handleConvert = async () => {
    // JSON에서 변환 가능한 텍스트를 바로 처리
    const dialect = 'hakataben'; // 현재 하카타벤
    const convertedText = getDialectFromJson(text, dialect);

    if (convertedText) {
      setResult(convertedText); // 변환된 텍스트 바로 출력
      cachedResults[text] = convertedText; // 캐시
      setLoading(false);
      return;
    }

    // JSON에 없으면 OpenAI API 호출
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, dialect }),
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      cachedResults[text] = data.hakataben; // 변환된 텍스트 캐시
      setResult(data.hakataben);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
