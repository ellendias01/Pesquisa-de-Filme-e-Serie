const { createApp } = Vue;

createApp({
    data() {
        return {
            movies: [],
            loading: false,
            searchText: '',
            searchType: 'name',
            nextPage: 1,
            no: false
        }
    },
    methods: {
        async fetchMovies() {
            try {
                this.loading = true;
                this.movies = [];
                this.nextPage = 1;
                this.no = false;

                const response = await fetch(`http://www.omdbapi.com/?apikey=c56f9d8f&s=${this.searchText}&page=${this.nextPage}`);
                const data = await response.json();

                if (data.Search) {
                    let movieDetailsPromises = data.Search.map(async movie => this.fetchMovieData(movie.imdbID));
                    let movieDetails = await Promise.all(movieDetailsPromises);

                    if (this.searchType === 'genre') {
                        movieDetails = movieDetails.filter(movie => movie.Genre.toLowerCase().includes(this.searchText.toLowerCase()));
                    }if (movieDetails.length === 0) {
                        this.no = true;
                    }

                    this.movies = [...this.movies, ...movieDetails];
                    this.nextPage++;
                    console.log(this.movies);
                } else {
                    this.no = true;
                    console.error("No results found.");
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async fetchMovieData(imdbID) {
            try {
                const response = await fetch(`http://www.omdbapi.com/?apikey=c56f9d8f&i=${imdbID}`);
                const data = await response.json();
                return {
                    imdbID: data.imdbID,
                    Title: data.Title,
                    Genre: data.Genre,
                    Year: data.Year,
                    Poster: data.Poster,
                    Released: data.Released,
                    Director: data.Director,
                    Language: data.Language,
                    BoxOffice: data.BoxOffice,
                    Actors: data.Actors,
                    Plot: data.Plot,
                    showDetails: false
                };
            } catch (err) {
                console.error(err);
            }
        },
        getGenreClass(genre) {
            const genreClassMap = {
                'animation': 'animation',
                'action': 'action',
                'comedy': 'comedy',
                'drama': 'drama',
                'horror': 'horror',
                'romance': 'romance',
                'sci-fi': 'scifi',
                'adventure': 'adventure',
                'fantasy': 'fantasy',
            };

            genre = genre.toLowerCase();
            for (let key in genreClassMap) {
                if (genre.includes(key)) {
                    return genreClassMap[key];
                }
            }
            return '';
        }
    }
}).mount("#app");