import keys from "./keys.js";
import TmdbAPI from "./api/TmdbAPI/index.js";
const tmdb = new TmdbAPI(keys.tmdb);

// MAIN
(async () => {
	const nowPlaying = await tmdb.getNowPlaying();
	const nowPlayingElem = document.querySelector("#nowPlaying");
	const playerElem = document.querySelector("#ytplayer");
	const player = new YT.Player("ytplayer", {
		videoId: nowPlaying[3].trailer.youtube_video_id,
		height: playerElem.offsetHeight,
		width: playerElem.offsetWidth,
		playerVars: {
			autoplay: "1",
			color: "white",
			controls: "0",
			enablejsapi: "1",
			fs: "0",
			loop: "1",
			mute: "1",
			start: "15",
		},
	});
	const heroTextElem = document.querySelector("#hero-text");
	heroTextElem.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${
			nowPlaying[3].images?.logos.find((logo) => logo.iso_639_1 === "en")?.file_path
		}" alt="${nowPlaying[3].title}" />
    `;
	for (let movie of nowPlaying) {
		const movieElem = document.createElement("div");
		movieElem.classList.add("movie");
		movieElem.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
		movieElem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${
				movie.images?.logos.find((logo) => logo.iso_639_1 === "en")?.file_path
			}" alt="${movie.title}" />
        `;
		nowPlayingElem.appendChild(movieElem);
	}
})();
