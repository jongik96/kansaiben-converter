// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          {/* Open Graph (OG) Meta Tags */}
          <meta property="og:title" content="方言変換 (Dialects Converter)" />
          <meta property="og:description" content="日本語の方言を簡単に変換するツールです。" />
          <meta property="og:image" content="/images/ben.png" />
          <meta property="og:url" content="https://kansaiben-converter.vercel.app" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="/images/ben.png" />
          <meta name="twitter:title" content="方言変換 (Dialects Converter)" />
          <meta name="twitter:description" content="日本語の方言を簡単に変換するツールです。" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
