import KinoCheck from "../KinoCheck/index.js";

class TmdbAPI {
	constructor(token) {
		this.token = token;
		this.base = "https://api.themoviedb.org/3";
		this.now_playing = [];
		// create this.movies -- an array-like object that only contains unique movies
		this.movies = new Set(); // will add movies from any method that returns movies
		this.queries = new Map();
		this.genres = new Map();
	}
	async getNowPlaying() {
		if (this.now_playing.length > 0) {
			console.log("getNowPlaying() from saved property => ", this.now_playing);
			return this.now_playing;
		}
		if (localStorage.getItem("now_playing")) {
			const date = JSON.parse(localStorage.getItem("now_playing")).date;
			const now = Date.now();
			const diff = now - date;
			const diffInHours = diff / (1000 * 60 * 60);
			if (diffInHours < 24) {
				console.log(
					"getNowPlaying() from local storage => ",
					JSON.parse(localStorage.getItem("now_playing")).results
				);
				this.now_playing = JSON.parse(localStorage.getItem("now_playing")).results;
				return this.now_playing;
			}
		}
		const url = `${this.base}/movie/now_playing?api_key=${this.token}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		this.genres = await this.getGenres();
		const movies = await Promise.all(
			data.results.map(async (movie) => {
				movie.genres = movie.genre_ids.map((id) => {
					const genre = this.genres.find((genre) => genre.id === id);
					return genre.name;
				});
				const videos = await this.getVideos(movie.id);
				movie.videos = videos.videos;
				movie.trailer = videos.trailer;
				const images = await this.getImages(movie.id);
				movie.images = images;
				this.movies.add(movie);
				return movie;
			})
		);
		console.log("getNowPlaying() from API => ", movies);
		this.now_playing = movies;
		localStorage.setItem(
			"now_playing",
			JSON.stringify({
				date: Date.now(),
				results: this.now_playing,
			})
		);
		return data.results;
	}
	async searchMovieTitle(query) {
		query = encodeURI(query.toLowerCase());
		if (this.queries.has(query)) {
			console.log(`search("${query}") from saved property => `, this.queries.get(query));
			return this.queries.get(query);
		}
		if (localStorage.getItem(query)) {
			const date = JSON.parse(localStorage.getItem("queries"))[query].date;
			const now = Date.now();
			const diff = now - date;
			const diffInHours = diff / (1000 * 60 * 60);
			if (diffInHours < 24) {
				console.log(`search("${query}") from local storage => `, JSON.parse(localStorage.getItem(query)).results);
				const results = JSON.parse(localStorage.getItem(query)).results;
				this.queries.set(query, results);
				return results;
			}
		}
		const url = `${this.base}/search/movie?api_key=${this.token}&query=${query}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(`search("${query}") from API => `, data.results);
		this.queries.set(query, data.results);
		localStorage.setItem(
			"queries",
			JSON.stringify({
				...JSON.parse(localStorage.getItem("queries")),
				[query]: {
					date: Date.now(),
					results: data.results,
				},
			})
		);
		return data.results;
	}
	async discoverGenre(genre) {
		if (this.queries.has(genre)) {
			console.log(`discoverGenre("${genre}") from saved property => `, this.queries.get(genre));
			return this.queries.get(genre);
		}
		if (localStorage.getItem(genre)) {
			const date = JSON.parse(localStorage.getItem(genre)).date;
			const now = Date.now();
			const diff = now - date;
			const diffInHours = diff / (1000 * 60 * 60);
			if (diffInHours < 24) {
				console.log(
					`discoverGenre("${genre}") from local storage => `,
					JSON.parse(localStorage.getItem(genre)).results
				);
				const results = JSON.parse(localStorage.getItem(genre)).results;
				this.queries.set(genre, results);
				return results;
			}
		}
		const url = `${this.base}/discover/movie?api_key=${this.token}&with_genres=${genre}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log(`discoverGenre("${genre}") from API => `, data.results);
		this.queries.set(genre, data.results);
		localStorage.setItem(
			genre,
			JSON.stringify({
				date: Date.now(),
				results: data.results,
			})
		);
		return data.results;
	}
	async getGenres() {
		if (this.genres.size > 0) {
			console.log("getGenres() from saved property => ", this.genres);
			return this.genres;
		}
		if (localStorage.getItem("genres")) {
			const date = JSON.parse(localStorage.getItem("genres")).date;
			const now = Date.now();
			const diff = now - date;
			const diffInHours = diff / (1000 * 60 * 60);
			if (diffInHours < 24) {
				console.log("getGenres() from local storage => ", JSON.parse(localStorage.getItem("genres")).results);
				this.genres = JSON.parse(localStorage.getItem("genres")).results;
				return this.genres;
			}
		}
		const url = `${this.base}/genre/movie/list?api_key=${this.token}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		console.log("getGenres() from API => ", data.genres);
		this.genres = data.genres;
		localStorage.setItem(
			"genres",
			JSON.stringify({
				date: Date.now(),
				results: this.genres,
			})
		);
		return data.genres;
	}
	async getVideos(tmdbId) {
		try {
			const kinocheckResponse = await KinoCheck.getVideos(tmdbId);
			if (kinocheckResponse) {
				return {
					videos: kinocheckResponse.videos,
					trailer: kinocheckResponse.trailer,
				};
			}
		} catch (error) {
			const url = `${this.base}/movie/${tmdbId}/videos?api_key=${this.token}`;
			const options = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			};
			try {
				const response = await fetch(url, options);
				const data = await response.json();
				return {
					videos: data.results,
					trailer: data.results.find((video) => video.type === "Trailer") || null,
				};
			} catch (error) {
				return {
					videos: [],
					trailer: null,
				};
			}
		}
	}
	async getImages(tmdbId) {
		const url = `${this.base}/movie/${tmdbId}/images?api_key=${this.token}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			const response = await fetch(url, options);
			const data = await response.json();
			return data;
		} catch (error) {
			return null;
		}
	}
}

export default TmdbAPI;
