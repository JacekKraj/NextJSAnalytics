import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head title={"learnig next js"} />
      <body>
        <Main />
        <NextScript />
      </body>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-MH5XDMB"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
    </Html>
  );
}
