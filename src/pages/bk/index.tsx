import { Inter } from "next/font/google";
import { SpinnerGap, House, User, Book, Plus, X } from "@phosphor-icons/react";
import dynamic from 'next/dynamic';
import Head from "next/head";
import { Swiper as SWP, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { Component, createRef } from "react";
import Swiper from "swiper";
import { isYoutubeId } from "@/utils/isYTid";
const Player = dynamic(() => import('@/components/Player').then(module => module.Player), {
    loading: () => <SpinnerGap className="animate-spin h-8 w-8" />,
    ssr: false,
});

interface BookMarkType {
    id: number;
    v: string;
}

const inter = Inter({ subsets: ["latin"] });

export default class BK extends Component {
    state: {
        bookmarks: BookMarkType[];
        addBookMarkMode: boolean;
        swiper: Swiper | null;
        activeSlide: number;
    } = {
            bookmarks: [],
            addBookMarkMode: false,
            swiper: null,
            activeSlide: 0,
        }
    VIDInput = createRef<HTMLInputElement>();

    slideTo = (index: number) => {
        if (!this.state.swiper) return;
        (this.state.swiper as Swiper).slideTo(index);
    }

    componentDidMount() {
        const data = localStorage.getItem("bookmarks");
        if (data) {
            this.setState({ bookmarks: JSON.parse(data) });
        }
    }

    componentDidUpdate() {
        localStorage.setItem("bookmarks", JSON.stringify(this.state.bookmarks));
    }

    handleAddBookMark = () => {
        if (!this.VIDInput.current) return;
        if (this.VIDInput.current.value === "") {
            this.setState({ addBookMarkMode: false });
            return;
        }

        if (this.VIDInput.current.value.includes("youtube.com") && this.VIDInput.current.value.includes("v=") && isYoutubeId(new URL(this.VIDInput.current.value).searchParams.get("v") || "")) {
            const url = new URL(this.VIDInput.current.value);
            this.setState({ bookmarks: [...this.state.bookmarks, { id: this.state.bookmarks.length + 1, v: url.searchParams.get("v") || "" }] });
        } else if (isYoutubeId(this.VIDInput.current.value)) {
            this.setState({ bookmarks: [...this.state.bookmarks, { id: this.state.bookmarks.length + 1, v: this.VIDInput.current.value }] });
        }else{
            this.VIDInput.current.value = "";
            this.VIDInput.current.placeholder = "This is Not a YouTube Video ID!"
            return;
        }
        this.VIDInput.current.value = "";
        this.setState({ addBookMarkMode: false });
    }

    getActiveIndex = () => {
        if (!this.state.swiper) return;
        this.setState({ activeSlide: (this.state.swiper as Swiper).activeIndex });
    }

    handleDeleteBookMark = () => {
        this.setState({ bookmarks: this.state.bookmarks.filter((v, index) => index !== this.state.activeSlide) });
        console.log(this.state.bookmarks);
    }

    loadedPlayer = () => {
        console.log(this.state.bookmarks);
        localStorage.setItem("bookmarks", JSON.stringify(this.state.bookmarks));
        this.slideTo(this.state.bookmarks.length);
    }


    render() {
        return (
            <>
                <Head>
                    <title>Youdio | BookMark</title>
                    <meta name="description" content="YouTube Audio Player" />
                    <link rel="icon" href="https://www.google.com/s2/favicons?sz=64&domain=https://youtube.com/" />
                </Head>
                <main className={`${inter.className} relative h-screen w-full flex items-center justify-center overflow-hidden`}>
                    <nav className="absolute z-10 top-0 left-0 bg-transparent w-32 h-12 flex items-center justify-center gap-2">
                        <House className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/"} />
                        <User className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/dashboard"} />
                        <Book className="bg-gray-600/10 p-2 rounded-md" fill="#000" size={32} onClick={() => window.location.href = "/bookmark"} />
                    </nav>
                    <SWP
                        effect={'coverflow'}
                        centeredSlides={true}
                        slidesPerView={3}
                        modules={[EffectCoverflow, Pagination]}
                        className="h-screen w-full flex"
                        loop={this.state.bookmarks.length > 3 ? true : false}
                        onSwiper={(swiper) => this.setState({ swiper: swiper })}
                        onSlideChangeTransitionEnd={this.getActiveIndex}
                    >
                        {
                            this.state.bookmarks.map((v, i) => (
                                <SwiperSlide className="!flex items-center justify-center" key={i} onLoad={this.loadedPlayer}>
                                    {
                                        <Player vid={v.v} />
                                    }
                                </SwiperSlide>
                            ))
                        }
                    </SWP>
                    {
                        this.state.addBookMarkMode ? (
                            <div className="flex absolute z-10 bottom-24">
                                <input type="text" className="w-96 h-8 bg-gray-200 rounded-l-full py-2 pl-4 outline-none border border-gray-400" placeholder="YouTube Video ID" ref={this.VIDInput} />
                                <button className="bg-red-600 h-8 py-2 px-4 rounded-r-full text-white flex items-center justiry-center" onClick={this.handleAddBookMark}>
                                    Add
                                </button>
                            </div>
                        ) : (
                            <div className="flex absolute z-10 bottom-24 gap-5">
                                <Plus className="bg-gray-400 p-2 rounded-md fill-white" size={32} onClick={() => { this.setState({ addBookMarkMode: true }) }} />
                                <X className="bg-gray-400 p-2 rounded-md fill-white" size={32} onClick={this.handleDeleteBookMark} />
                            </div>
                        )
                    }
                </main>
            </>
        )
    }
}