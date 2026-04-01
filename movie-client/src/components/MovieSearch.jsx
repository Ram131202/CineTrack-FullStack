import { useState } from 'react';
import api from '../api/axios';

// Sub-component for individual movie cards to manage their own "loading" state
const MovieCard = ({ movie, onAdd, isLogged }) => {
    const [providers, setProviders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleCheckAvailability = async (e) => {
        e.stopPropagation();
        if (providers) return; 

        setLoading(true);
        setError(false);
        try {
            // Calls MovieController's @GetMapping("/details/{imdbId}")
            const response = await api.get(`/movies/details/${movie.imdbID}`);
            setProviders(response.data.ottProviders || []);
        } catch (err) {
            console.error("Failed to fetch OTT data:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px' }} />
            <div style={{ textAlign: 'left' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{movie.Title}</h4>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0' }}>{movie.Year}</p>
                
                {/* OTT Provider Section */}
                <div style={{ marginTop: '15px', minHeight: '45px' }}>
                    {providers ? (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {providers.length > 0 ? (
                                providers.map((p, index) => (
                                    <span key={index} style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', border: '1px solid #b3e5fc' }}>
                                        {p.name || p.provider_name}
                                    </span>
                                ))
                            ) : (
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Not found on OTT</span>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={handleCheckAvailability}
                            disabled={loading}
                            style={{ fontSize: '0.8rem', cursor: 'pointer', backgroundColor: 'white', border: '1px solid #007bff', color: '#007bff', padding: '5px 10px', borderRadius: '4px' }}
                        >
                            {loading ? "Checking..." : "Where to Watch?"}
                        </button>
                    )}
                    {error && <p style={{ color: 'red', fontSize: '0.7rem', margin: '5px 0 0 0' }}>Error loading providers</p>}
                </div>

                <button 
                    onClick={() => onAdd(movie)}
                    style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Add to Watchlist
                </button>
            </div>
        </div>
    );
};

const MovieSearch = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const isHeaderLoggedIn = !!localStorage.getItem('token');

    const handleSearch = async (e) => {
        if (e) e.preventDefault(); // Prevents page refresh
        if (!query) return;

        try {
            // Calls MovieController's @GetMapping("/search") which expects 'title'
            const res = await api.get(`/movies/search?title=${query}`);
            
            // OMDb returns an object with a "Search" array
            const results = res.data.Search || []; 
            setMovies(results);
        } catch (error) {
            console.error("Search failed:", error);
            setMovies([]);
        }
    };

    const addToWatchlist = async (movie) => {
        if (!isHeaderLoggedIn) {
            alert("Please login to add to your watchlist!");
            return;
        }

        try {
            // Calls MovieController's @PostMapping("/watchlist")
            await api.post('/movies/watchlist', { imdbId: movie.imdbID });
            alert(`${movie.Title} added to your watchlist!`);
        } catch (error) {
            console.error("Failed to add movie", error);
            alert("Could not add movie to watchlist.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <form onSubmit={handleSearch} style={{ marginBottom: '30px', textAlign: 'center' }}>
                <input 
                    type="text" 
                    placeholder="Search for a movie (e.g. Batman)..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ padding: '10px', width: '60%', borderRadius: '4px 0 0 4px', border: '1px solid #ccc', outline: 'none' }}
                />
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '0 4px 4px 0', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
                    Search
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <MovieCard 
                            key={movie.imdbID} 
                            movie={movie} 
                            onAdd={addToWatchlist} 
                            isLogged={isHeaderLoggedIn}
                        />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#888' }}>
                        {query ? "No movies found." : "Enter a movie title to start searching."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default MovieSearch;