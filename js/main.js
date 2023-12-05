import keys from "./keys.js";
import TmdbAPI from "./api/TmdbAPI/index.js";
import HeroMovieCard from "./components/HeroMovieCard.js";
const tmdb = new TmdbAPI(keys.tmdb);

class MovieCard {
	constructor(movie, target) {
		this.movie = movie;
		this.parent = target;
		this.elem = this.render();
	}
	render() {
		const movieElem = document.createElement("div");
		movieElem.classList.add("movie");
		movieElem.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${this.movie.backdrop_path})`;
		movieElem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${
				this.movie.images?.logos.find((logo) => logo.iso_639_1 === "en")?.file_path
			}" alt="${this.movie.title}" />
        `;
		this.parent.appendChild(movieElem);
	}
}

class MovieList {
	constructor(movies, title, pull = false) {
		this.movies = movies;
		this.title = title;
		this.parent = document.querySelector("#movie-lists");
		this.elem = this.render();
	}
	render() {
		const movieListElem = document.createElement("div");
		movieListElem.classList.add("container-fluid", "p-0", "position-relative", "mb-3");
		movieListElem.innerHTML = `
            <div class="d-flex px-5">
                <h3 class="category-title">${this.title}</h2>
            </div>
        `;
		const movieListRow = document.createElement("div");
		movieListRow.classList.add("d-flex", "movies", "px-5");
		movieListRow.innerHTML = `
            <div class="d-flex gap-2"></div>
        `;
		const target = movieListRow.querySelector(".d-flex");
		for (let movie of this.movies) {
			const movieCard = new MovieCard(movie, target);
		}
		movieListElem.appendChild(movieListRow);
		this.parent.appendChild(movieListElem);
	}
}

// MAIN
(async () => {
	const nowPlaying = await tmdb.getNowPlaying();
	const heroMovieCard = new HeroMovieCard(nowPlaying[2]);
	const nowPlayingList = new MovieList(nowPlaying, "Now Playing in Theaters");

	const popular = await tmdb.getPopular();
	const popularList = new MovieList(popular, "Popular Movies");

	const scifi = await tmdb.discoverGenre(878);
	const scifiList = new MovieList(scifi, "Sci-Fi Movies");

	const action = await tmdb.discoverGenre(28);
	const actionList = new MovieList(action, "Action Movies");

	const comedy = await tmdb.discoverGenre(35);
	const comedyList = new MovieList(comedy, "Comedy Movies");

	const drama = await tmdb.discoverGenre(18);
	const dramaList = new MovieList(drama, "Drama Movies");
})();
