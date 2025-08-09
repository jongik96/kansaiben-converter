// pages/api/convert.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, dialect } = req.body;

    let prompt = '';
    if (dialect === 'kansaiben') {
      prompt = `Convert the following text to Kansai dialect: ${text}`;
    } else if (dialect === 'hakataben') {
      prompt = `Convert the following text to Hakata dialect: ${text}`;
    } else if (dialect === 'nagoyaben') {
      prompt = `Convert the following text to Nagoya dialect: ${text}`;
    } else if (dialect === 'aomoriben') {
      prompt = `Convert the following text to Aomori dialect: ${text}`;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-5',  // GPT-5 모델
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }, // 변환할 텍스트
          ],
          max_completion_tokens: 1000,  // max_tokens 대신 max_completion_tokens 사용
          temperature: 1,  // temperature 값은 1로 설정
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,  // 환경변수에서 API 키 불러오기
            'Content-Type': 'application/json',
          },
        }
      );

      // 동적으로 결과를 반환
      const result = response.data.choices[0].message.content.trim();
      res.status(200).json({ [dialect]: result });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message); // 에러 메시지 로깅
      res.status(500).json({ error: 'Failed to fetch data from OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });  // POST 이외의 메소드 방지
  }
}
