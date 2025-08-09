import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, dialect } = req.body;

    let prompt = '';
    if (dialect === 'kansaiben') {
      prompt = `次の文を関西弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
    } else if (dialect === 'hakataben') {
      prompt = `次の文を博多弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
    } else if (dialect === 'nagoyaben') {
      prompt = `次の文を名古屋弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
    } else if (dialect === 'aomoriben') {
      prompt = `次の文を青森弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-5-mini',  // GPT-5-mini 모델 사용
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },  // 변환할 텍스트
          ],
          max_tokens: 200,  // 응답 길이를 줄임
          temperature: 0.7,  // 자연스러운 응답 생성
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // 응답 구조 확인용 로그
      console.log('API Response:', response.data);

      // 응답에서 변환된 텍스트 가져오기
      const message = response.data.choices[0]?.message;
      const result = message?.content?.trim() || '';  // 변환된 텍스트 가져오기

      if (!result) {
        return res.status(400).json({ error: '변환된 텍스트가 없습니다.' });
      }

      // 변환된 텍스트 반환
      res.status(200).json({ [dialect]: result });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch data from OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
