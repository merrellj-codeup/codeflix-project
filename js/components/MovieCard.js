class MovieCard {
	constructor(movie, target) {
		this.movie = movie;
		this.imgBase = "https://image.tmdb.org/t/p/w500";
		this.parent = target;
		this.elem = this.render();
	}
	render() {
		const movieElem = document.createElement("div");
		movieElem.classList.add("movie");
		movieElem.style.backgroundImage = `url(${this.imgBase}${this.movie.backdrop_path})`;
		movieElem.innerHTML = `
            <img src="${this.imgBase}${this.movie.images?.logos.find((logo) => logo.iso_639_1 === "en")?.file_path}" alt="${
			this.movie.title
		}" />
        `;
		this.parent.appendChild(movieElem);
	}
}

export default MovieCard;
