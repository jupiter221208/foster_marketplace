// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/logo.png" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css?family=Mulish&display=swap" rel="stylesheet" />
        </Head>
        <body style={{ color: 'white' }}>
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-V7ER9MVED6" />
          <Script strategy="beforeInteractive" id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-V7ER9MVED6');
            `}
          </Script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
