import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [level, setLevel] = useState(1);
  const [emotion, setEmotion] = useState('');
  const [showModal, setShowModal] = useState(false);  // 경고 모달 상태 추가

  const handleConvert = async () => {
    if (!text.trim()) {
      // 텍스트가 비어있으면 팝업 띄우기
      alert("おっと！日本語を入力してね！");
      return;
    }

    // 일본어 이외의 문자가 포함되었을 때 경고
    const isJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu.test(text);
    if (!isJapanese) {
      alert("日本語だけを入力してくださいね！");
      return;
    }

    if (text.length > 100) {
      setShowModal(true);  // 글자 수 초과 시 모달 띄우기
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
        body: JSON.stringify({ text, level, emotion }),
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      setResult(data.kansaiben);
      speakText(data.kansaiben);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 텍스트를 음성으로 읽어주는 함수
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(v => v.lang === 'ja-JP'); // 일본어 기본 음성
    synth.speak(utterance);
  };

  // 엔터키 눌렀을 때 변환 버튼 눌러지게
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className="container">
      <h1>関西弁変換ツール</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここに標準日本語を入力してください"
        onKeyDown={handleKeyDown}
        maxLength="100"  // 최대 입력 글자수 100으로 제한
      />
      <div>
        <span>{text.length} / 100</span>  {/* 글자 수 표시 */}
      </div>
      
      <div className="options">
        <label htmlFor="level">レベル選択:</label>
        <select 
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="1">レベル 1 (軽い)</option>
          <option value="2">レベル 2</option>
          <option value="3">レベル 3</option>
          <option value="4">レベル 4</option>
          <option value="5">レベル 5 (強い)</option>
        </select>

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
        {loading ? '変換中...' : '関西弁に変換する'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>変換結果:</h2>
          <p>{result}</p>
        </div>
      )}

      {/* 경고 팝업 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>おっと！100文字を超えているよ！</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
