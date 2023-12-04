class KinoCheck {
	static async getVideos(tmdbId) {
		const url = `https://api.kinocheck.de/movies?tmdb_id=${tmdbId}&categories=Trailer,-Clip`;
		try {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		} catch (error) {
			// if cors error, try with heroku proxy
			const url = `https://cors-anywhere.herokuapp.com/https://api.kinocheck.de/movies?tmdb_id=${tmdbId}&categories=Trailer,-Clip`;
			try {
				const response = await fetch(url);
				const data = await response.json();
				return data;
			} catch (error) {
				return null;
			}
		}
	}
}

export default KinoCheck;
