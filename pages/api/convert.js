import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, dialect } = req.body;

    let prompt = '';
    if (dialect === 'kansaiben') {
      prompt = `次の文章を自然な実際の関西弁に変えてください。
: ${text}`;
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
          model: 'gpt-5-mini',  // GPT-5-mini 모델 사용
          messages: [
            { role: 'system', content: 'You are a helpful assistant. and master of Japanaese.' },
            { role: 'user', content: prompt },  // 변환할 텍스트
          ],
          max_completion_tokens: 500,  // 최대 토큰 수
          temperature: 1,   // 창의성 설정
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
