import Head from 'next/head';
import { MessageProvider } from '../components/provider';
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
        {/* Implementation by amap*/}
        {/* <script
          src={`//webapi.amap.com/maps?v=1.4.15&key=${key}&plugin=Map3D,AMap.DistrictLayer `}
        ></script> */}
      </Head>
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    </>
  );
}

export default MyApp;
