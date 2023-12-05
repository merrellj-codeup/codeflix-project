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

export default MovieCard;
