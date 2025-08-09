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
          model: 'gpt-3.5-turbo',  // 예시로 GPT-3.5 모델 사용
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1000,
          temperature: 1,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data.choices[0].message.content.trim();
      res.status(200).json({ [dialect]: result });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch data from OpenAI API' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
