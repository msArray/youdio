import { Inter } from "next/font/google";
import { SpinnerGap, House, User, Book } from "@phosphor-icons/react";
import dynamic from 'next/dynamic';
import Head from "next/head";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { useRouter } from "next/router";
const Player = dynamic(() => import('@/components/Player').then(module => module.Player), {
  loading: () => <SpinnerGap className="animate-spin h-8 w-8" />,
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const Router = useRouter();
  const { v } = Router.query;

  return (
    <>
      <Head>
        <title>Youdio</title>
        <meta name="description" content="YouTube Audio Player" />
        <link rel="icon" href="https://www.google.com/s2/favicons?sz=64&domain=https://youtube.com/" />
      </Head>
      <main className={`${inter.className} relative h-screen w-full flex items-center justify-center overflow-hidden`}>
        <nav className="absolute z-10 top-0 left-0 bg-transparent w-32 h-12 flex items-center justify-center gap-2">
          <House className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/"} />
          <User className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/dashboard"} />
          <Book className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/bookmark"} />
        </nav>
        <Swiper
          effect={'coverflow'}
          centeredSlides={true}
          slidesPerView={3}
          modules={[EffectCoverflow, Pagination]}
          className="h-screen w-full flex"
          loop={true}
        >
          <SwiperSlide className="!flex items-center justify-center">
            {
              Router.isReady ? <Player vid={v as string} /> : <SpinnerGap className="animate-spin h-8 w-8" />
            }
          </SwiperSlide>
        </Swiper>
      </main>
    </>
  );
}
