import axios from 'axios';

// 일본어 입력 길이에 따라 안전하게 completion 토큰 상한 계산
function calcMaxCompletionTokens(input) {
  const len = Array.from(input ?? '').length;
  if (len <= 15) return 500;
  if (len <= 50) return 1000;
  if (len <= 100) return 1500;
  return 3000;
}

// length로 잘리면 1회만 재시도 (토큰 여유를 늘려 재요청)
async function callOpenAI({ prompt, maxTokens }) {
  const resp = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_completion_tokens: maxTokens,
      // temperature는 기본값(1) 그대로 — 명시 설정하지 않음
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return resp.data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, dialect } = req.body;

  if (!text || !dialect) {
    return res.status(400).json({ error: 'Text and dialect are required.' });
  }

  let prompt = '';
  if (dialect === 'kansaiben') {
    prompt = `次の文を関西弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
  } else if (dialect === 'hakataben') {
    prompt = `次の文を博多弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
  } else if (dialect === 'nagoyaben') {
    prompt = `次の文を名古屋弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
  } else if (dialect === 'aomoriben') {
    prompt = `次の文を青森弁に変換して下さい。他の説明は付け加えないでください: ${text}`;
  } else {
    return res.status(400).json({ error: 'Unsupported dialect.' });
  }

  const initialMax = calcMaxCompletionTokens(text);

  try {
    // 1차 호출
    const data1 = await callOpenAI({ prompt, maxTokens: initialMax });
    const choice1 = data1?.choices?.[0];
    const content1 = choice1?.message?.content?.trim();

    if (content1 && choice1?.finish_reason !== 'length') {
      return res.status(200).json({ [dialect]: content1 });
    }

    // 길이 제한으로 잘린 경우 1회 재시도 (여유 토큰 +120, 상한 400)
    const boostedMax = Math.min(initialMax + 120, 400);
    const data2 = await callOpenAI({ prompt, maxTokens: boostedMax });
    const choice2 = data2?.choices?.[0];
    const content2 = choice2?.message?.content?.trim();

    if (content2) {
      return res.status(200).json({ [dialect]: content2 });
    }

    return res.status(400).json({ error: '変換されたテキストがありません' });
  } catch (error) {
    console.error('OpenAI Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to fetch data from OpenAI API' });
  }
}
