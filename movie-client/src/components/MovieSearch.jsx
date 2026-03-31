import { useState } from 'react';
import api from '../api/axios';

const MovieSearch = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const isHeaderLoggedIn = !!localStorage.getItem('token');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // This calls your @GetMapping("/api/movies/search")
            const response = await api.get(`/movies/search?title=${query}`);
            setMovies(response.data.Search || []);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    const addToWatchlist = async (movie) => {
        if (!isHeaderLoggedIn) {
            alert("Please login to add to your watchlist!");
            return;
        }

        try {
            // We send the imdbID to our backend
            // Our axios interceptor automatically adds the 'Bearer token' header
            await api.post('/movies/watchlist', { imdbId: movie.imdbID });
            alert(`${movie.Title} added to your watchlist!`);
        } catch (error) {
            console.error("Failed to add movie", error);
            alert("Could not add movie. Make sure your server is running!");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search for a movie..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: '8px', width: '250px' }}
                />
                <button type="submit">Search</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                {movies.map((movie) => (
                    <div key={movie.imdbID} style={{ border: '1px solid #ddd', padding: '10px' }}>
                        <img src={movie.Poster} alt={movie.Title} style={{ width: '100%' }} />
                        <h3>{movie.Title}</h3>
                        <p>{movie.Year}</p>
                        <button onClick={() => addToWatchlist(movie)}>+ Watchlist</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieSearch;