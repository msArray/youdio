import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { getParam } from "@/utils/getParam";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const router = useRouter();

  const youdioGo = () => {
    const url = (document.querySelector('input[type="text"]') as HTMLInputElement).value;
    if (getParam('v', url)) {
      router.push({
        pathname: '/app/[v]',
        query: { v: getParam('v', url) },
      })
    } else {
      router.push({
        pathname: '/app/[v]',
        query: { v: url },
      })
    }
  }

  return (
    <>
      <Head>
        <title>Youdio</title>
        <meta name="description" content="YouTube Audio Player" />
        <link rel="icon" href="https://www.google.com/s2/favicons?sz=64&domain=https://youtube.com/" />
      </Head>
      <main className={`${inter.className} h-screen w-full flex items-center justify-center overflow-hidden flex-col gap-20`}>
        <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-4">Youdio <img src="https://www.google.com/s2/favicons?sz=64&domain=https://youtube.com/" alt="youtube icon" /></h1>
        <div className="w-full flex items-center justify-center flex-col gap-8 max-w-screen-lg">
          <input type="text" placeholder="URL or Video ID Here!" className="w-full bg-white p-4 rounded-full outline-none border-2 border-red-600" />
          <button className="p-4 bg-red-600 text-white rounded-full" onClick={youdioGo}>
            Play
          </button>
        </div>
      </main>
    </>
  );
}
