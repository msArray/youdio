import { Component, createRef, MouseEvent } from "react";
import { Gear, Play, Stop } from "@phosphor-icons/react";
import { Logger } from "./Logger";

type PlayerProps = {
    vid: string;
};

export class Player extends Component<PlayerProps> {
    Duration = createRef<HTMLSpanElement>();
    Video = createRef<HTMLVideoElement>();
    Audio: HTMLAudioElement | null = null;

    state = {
        vid: this.props.vid,
        playing: false,
        openSettings: false,
        enableMovie: false,
        movieUrl: "",
        moviewithSound: "",
        title: ""
    }

    componentDidMount() {
        Logger.success(this.props.vid + "is Playing...");
        console.log(`/api/info/${this.props.vid}`);
        this.Audio = new Audio(`/api/audio/${this.props.vid}`);
        fetch(`/api/info/${this.props.vid}`, {
            method: "GET",
        }).then((res) => res.json()).then((data) => {
            this.setState({ movieUrl: data.video, moviewithSound: data.videoFull, title: data.title });
        });
        this.Audio?.addEventListener("timeupdate", () => {
            if (this.Audio) {
                const { currentTime, duration } = this.Audio;
                this.Duration.current!.style.width = `${(currentTime / duration) * 100}%`;
            }

            //console.log(this.Player.current?.currentTime, this.Video.current?.currentTime)

            if (this.Video.current && this.Audio && Math.abs(this.Video.current.currentTime - this.Audio.currentTime) > 0.03) {
                this.Video.current.currentTime = this.Audio.currentTime;
            }
        });
    }

    componentWillUnmount(): void {
        this.Audio?.pause();
        this.Video.current?.pause();
    }

    downloadMusic = () => {
        const a = document.createElement('a');
        a.href = `/api/audio/${this.props.vid}`;
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

    changeTime = (e: MouseEvent) => {
        if (this.Audio) {
            const { clientX, target } = e;
            const { left, width } = (target as HTMLDivElement).getBoundingClientRect();
            const time = ((clientX - left) / width) * this.Audio.duration;
            this.Audio.currentTime = time;
            if (this.Video.current) this.Video.current.currentTime = time;
        }
    }

    render() {
        return (
            <div className={`h-96 w-64 rounded-lg shadow-lg bg-white duration-200${this.state.openSettings ? (!navigator.userAgent.match(/iPhone|Android.+Mobile/) && " -translate-x-32") : " translate-x-0"}${!navigator.userAgent.match(/iPhone|Android.+Mobile/) && " scale-100"}`}>
                <div className="w-64 h-48 rounded-t-lg bg-black overflow-hidden flex items-center justify-center">
                    {
                        this.state.enableMovie ? (
                            <video src={this.state.moviewithSound} className="w-full" muted autoPlay ref={this.Video} />
                        ) : (
                            <img src={`https://img.youtube.com/vi/${this.props.vid}/0.jpg`} alt="youtube image" className="h-full" />
                        )
                    }
                </div>
                <div className="relative h-48 w-full p-4 flex items-center justify-center flex-col">
                    <div className="h-24 flex items-center justify-center">
                        <p className="font-bold text-xs">
                            {this.state.title}
                        </p>
                    </div>
                    <div className="w-full h-8 shadow-lg rounded-full bg-white p-2 flex items-center gap-5">
                        {
                            this.state.playing ? (
                                <Stop stroke="#000" onClick={() => {
                                    this.Audio?.pause();
                                    this.setState({ playing: false });
                                    this.Video.current?.pause();
                                }} />
                            ) : (
                                <Play stroke="#000" onClick={() => {
                                    this.Audio?.play();
                                    this.setState({ playing: true });
                                    this.Video.current?.play();
                                }} />
                            )
                        }
                        <div className="w-full h-1 bg-gray-200 rounded-full flex justify-left" onClick={(e) => this.changeTime(e)}>
                            <span className="h-1 rounded-full bg-sky-600" ref={this.Duration}></span>
                        </div>
                    </div>
                    <Gear className="absolute z-10 m-auto bottom-2.5 right-2.5" onClick={() => this.setState({ openSettings: !this.state.openSettings })} />
                    {
                        this.state.openSettings && (
                            <div className={`absolute w-64 h-96 bg-white rounded-lg shadow-lg p-4 right-0 bottom-0 flex flex-col gap-3 duration-200${this.state.openSettings && (!navigator.userAgent.match(/iPhone|Android.+Mobile/) && " translate-x-64")}`} onBlur={() => this.setState({ openSettings: false })}>
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
                </div>
            </div>
        );
    }
}