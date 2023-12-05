import MovieCard from "./MovieCard.js";

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

export default MovieList;
