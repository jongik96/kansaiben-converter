import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);  // 로딩 상태 관리
  const [error, setError] = useState('');
  const [emotion, setEmotion] = useState('');
  const [showModal, setShowModal] = useState(false);  // 경고 모달 상태 추가

  const handleConvert = async () => {
    setLoading(true); // 로딩 시작

    if (!text.trim()) {
      alert("おっと！日本語を入力してね！");
      setLoading(false); // 로딩 끝
      return;
    }

    const isJapanese = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu.test(text);
    if (!isJapanese) {
      alert("日本語だけを入力してくださいね！");
      setLoading(false); // 로딩 끝
      return;
    }

    if (text.length > 100) {
      setShowModal(true);
      setLoading(false); // 로딩 끝
      return;
    }

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, emotion, dialect: 'kansaiben' }), // 사투리 지정
      });

      if (!response.ok) {
        throw new Error('変換エラー');
      }

      const data = await response.json();
      setResult(data.kansaiben || data.hakataben || data.nagoyaben || data.aomoriben); // 동적으로 결과 저장
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  // 텍스트를 음성으로 읽어주는 함수
  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices().find(v => v.lang === 'ja-JP'); // 일본어 기본 음성
    synth.speak(utterance);
  };

  // 음성 듣기 버튼 클릭 시 음성을 출력하는 함수
  const handleSpeakClick = () => {
    speakText(result);  // 변환된 텍스트를 음성으로 읽어줌
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
          {/* 음성 듣기 버튼 추가 */}
          <button onClick={handleSpeakClick}>音声で聞く</button>
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

      {/* 로딩 인디케이터 추가 */}
      {loading && <div className="loading">変換中...</div>} {/* 로딩 인디케이터 */}
    </div>
  );
}
