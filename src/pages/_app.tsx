import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/NavBar";
import { ChakraProvider } from "@chakra-ui/react";
import Footer from "@/components/Footer";
import { Web3Modal } from "@/context/wagmiConfig";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute='class'>
      <Web3Modal>
        <NavBar />
        <div className='min-h-[calc(100vh-68px)] pt-16 px-2 sm:px-4'>
          <ChakraProvider>
            <Component {...pageProps} />
          </ChakraProvider>
        </div>
        <Footer />
      </Web3Modal>
    </ThemeProvider>
  );
}
