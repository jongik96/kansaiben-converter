import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // `kansaiben` 페이지로 리다이렉트
    router.push('/kansaiben');
  }, [router]);

  return (
    <>
      <Head>
        {/* SNS에서 공유될 때 썸네일 설정 */}
        <meta property="og:image" content="/images/ben.png" />
        <meta property="og:title" content="サトリ変換" />
        <meta property="og:description" content="日本語を関西弁、博多弁、名古屋弁に変換します" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/ben.png" />
        <meta name="twitter:title" content="サトリ変換" />
        <meta name="twitter:description" content="日本語を関西弁、博多弁、名古屋弁に変換します" />
      </Head>
    </>
  );
};

export default IndexPage;
s