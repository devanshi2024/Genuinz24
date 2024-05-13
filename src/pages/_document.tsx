import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-[url('/bg.jpg')] bg-no-repeat bg-cover bg-center bg-fixed dark:bg-[url('/darkBg.png')]">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
