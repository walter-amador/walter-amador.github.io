import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/*
            "Ask My Resume" chat widget. Self-executing script that injects its
            own launcher button and an iframe — deliberately not a React
            component, so it cannot re-render, collide with app state, or break
            the page if the assistant is down.

            Absolute URL on purpose: it is served from its own CloudFront
            distribution, so basePath/assetPrefix must not apply to it.
          */}
          <script src='https://assistant.walter-amador.com/loader.js' defer />
        </body>
      </Html>
    );
  }
}
