class MoviesAppAPI {
	constructor() {
		this.base = "http://localhost:3000";
	}
	async getMovies() {
		const url = `${this.base}/movies`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	}
	async getMovie(id) {
		const url = `${this.base}/movies/${id}`;
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	}
	async postMovie(movie) {
		const url = `${this.base}/movies`;
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(movie),
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	}
	async deleteMovie(id) {
		const url = `${this.base}/movies/${id}`;
		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	}
	async updateMovie(id, movie) {
		const url = `${this.base}/movies/${id}`;
		const options = {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(movie),
		};
		const response = await fetch(url, options);
		const data = await response.json();
		return data;
	}
}

export default MoviesAppAPI;
