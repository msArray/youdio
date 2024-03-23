import { Component, createRef } from "react";
import { Gear, Play, Stop } from "@phosphor-icons/react";

export class Player extends Component {
    Player = createRef<HTMLVideoElement>();
    Duration = createRef<HTMLSpanElement>();
    Video = createRef<HTMLVideoElement>();
    props: any;

    state = {
        vid: "",
        playing: false,
        openSettings: false,
        enableMovie: false,
        movieUrl: "",
        moviewithSound: "",
    }

    getParam(name: string, url?: string) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    componentDidMount() {
        fetch(`/api/info/${this.getParam("v")}`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            this.setState({ movieUrl: data.video, moviewithSound: data.videoFull });
        });
        this.Player.current?.addEventListener("timeupdate", () => {
            if (this.Player.current) {
                const { currentTime, duration } = this.Player.current;
                this.Duration.current!.style.width = `${(currentTime / duration) * 100}%`;
            }

            console.log(this.Player.current?.currentTime, this.Video.current?.currentTime)

            if (this.Video.current && this.Player.current && Math.abs(this.Video.current.currentTime - this.Player.current.currentTime) > 0.03) {
                this.Video.current.currentTime = this.Player.current.currentTime;
            }
        });
    }

    downloadMusic = () => {
        const a = document.createElement('a');
        a.href = `/api/audio/${this.getParam("v")}`;
        a.download = 'music.mp3';
        a.click();
    }

    downloadMovie = () => {
        const a = document.createElement('a');
        a.href = this.state.movieUrl;
        a.download = 'movie.mp4';
        a.click();
    }

    changeMovieMode = () => {
        this.setState({ enableMovie: !this.state.enableMovie });
    }

    render() {
        return (
            <div className={`h-96 w-64 rounded-lg shadow-lg bg-white duration-200${this.state.openSettings && (!navigator.userAgent.match(/iPhone|Android.+Mobile/) ? " -translate-x-32" : " -translate-y-48")}${!navigator.userAgent.match(/iPhone|Android.+Mobile/) && " scale-150"}`}>
                <div className="w-64 h-48 rounded-t-lg bg-black overflow-hidden flex items-center justify-center">
                    {
                        this.state.enableMovie ? (
                            <video src={this.state.moviewithSound} className="w-full" muted autoPlay ref={this.Video} />
                        ) : (
                            <img src={`https://img.youtube.com/vi/${this.getParam("v")}/0.jpg`} alt="youtube image" className="h-full" />
                        )
                    }
                </div>
                <div className="relative h-48 w-full p-4 flex items-center justify-center">
                    <div className="w-full h-8 shadow-lg rounded-full bg-white p-2 flex items-center gap-5">
                        {
                            this.state.playing ? (
                                <Stop stroke="#000" onClick={() => {
                                    this.Player.current?.pause();
                                    this.setState({ playing: false });
                                    this.Video.current?.pause();
                                }} />
                            ) : (
                                <Play stroke="#000" onClick={() => {
                                    this.Player.current?.play();
                                    this.setState({ playing: true });
                                    this.Video.current?.play();
                                }} />
                            )
                        }
                        <div className="w-full h-1 bg-gray-200 rounded-full flex justify-left">
                            <span className="h-1 rounded-full bg-sky-600" ref={this.Duration}></span>
                        </div>
                    </div>
                    <Gear className="absolute m-auto bottom-2.5 right-2.5" onClick={() => this.setState({ openSettings: !this.state.openSettings })} />
                    {
                        this.state.openSettings && (
                            <div className={`absolute w-64 h-96 bg-white rounded-lg shadow-lg p-4 right-0 bottom-0 flex flex-col gap-3 duration-200${this.state.openSettings && (!navigator.userAgent.match(/iPhone|Android.+Mobile/) ? " translate-x-64" : " translate-y-96") }`} onBlur={() => this.setState({ openSettings: false })}>
                                <button className="w-full h-8 text-black underline flex" onClick={this.downloadMusic}>Download</button>
                                <button className="w-full h-8 text-black underline flex">Raw Information</button>
                                <button className="w-full h-8 text-black underline flex" onClick={this.changeMovieMode}>
                                    {
                                        this.state.enableMovie ? (<>Disable Movie</>) : (<>Enable Movie</>)
                                    }
                                </button>
                                {
                                    this.state.enableMovie && (
                                        <button className="w-full h-8 text-black underline flex" >Download Movie</button>
                                    )
                                }
                            </div>
                        )
                    }
                    <video src={`/api/audio/${this.getParam("v") }`} preload="none" className="hidden" ref={this.Player}></video>
                </div>
            </div>
        );
    }
}