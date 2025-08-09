// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // `kansaiben` 페이지로 리다이렉트
    router.push('/kansaiben');
  }, [router]);

  return null; // 리다이렉트가 완료되면 아무 것도 렌더링하지 않음
};

export default IndexPage;
