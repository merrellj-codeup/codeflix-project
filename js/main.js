import keys from "./keys.js";
import TmdbAPI from "./api/TmdbAPI/index.js";
import HeroMovieCard from "./components/HeroMovieCard.js";
import MovieList from "./components/MovieList.js";
const tmdb = new TmdbAPI(keys.tmdb);

// MAIN
(async () => {
	const nowPlaying = await tmdb.getNowPlayingMovies();
	const heroMovieCard = new HeroMovieCard(nowPlaying[2]);
	const nowPlayingList = new MovieList(nowPlaying, "Now Playing in Theaters");

	const popular = await tmdb.getPopularMovies();
	const popularList = new MovieList(popular, "Popular Movies");

	const scifi = await tmdb.getMoviesByGenre(878);
	const scifiList = new MovieList(scifi, "Sci-Fi Movies");

	const action = await tmdb.getMoviesByGenre(28);
	const actionList = new MovieList(action, "Action Movies");

	const comedy = await tmdb.getMoviesByGenre(35);
	const comedyList = new MovieList(comedy, "Comedy Movies");

	const drama = await tmdb.getMoviesByGenre(18);
	const dramaList = new MovieList(drama, "Drama Movies");
})();
