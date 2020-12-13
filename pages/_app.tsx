import Head from 'next/head';
import makeServer from '../mock';
import '../styles/globals.less';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Online Education</title>
        <meta key="description" name="description" content="Online Education System" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
