// pages/_app.js
import Link from 'next/link';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      {/* 상단 메뉴 */}
      {/* <header className="header">
        <nav>
          <ul>
            <li><Link href="/kansaiben">関西弁</Link></li>
            <li><Link href="/hakataben">博多弁</Link></li>
            <li><Link href="/nagoyaben">名古屋弁</Link></li>
            <li><Link href="/aomoriben">青森弁</Link></li>
          </ul>
        </nav>
      </header> */}
      
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
