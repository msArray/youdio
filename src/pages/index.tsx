import { Inter } from "next/font/google";
import { SpinnerGap } from "@phosphor-icons/react";
import dynamic from 'next/dynamic';
import Head from "next/head";
const Player = dynamic(() => import('@/components/Player').then(module => module.Player), {
  loading: () => <SpinnerGap className="animate-spin h-8 w-8" />,
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Youdio</title>
        <meta name="description" content="YouTube Audio Player" />
        <link rel="icon" href="https://www.google.com/s2/favicons?sz=64&domain=https://youtube.com/" />
      </Head>
      <main className={`${inter.className} h-screen w-full flex items-center justify-center overflow-hidden`}>
        <Player />
      </main>
    </>
  );
}
