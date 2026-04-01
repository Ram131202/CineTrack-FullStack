import { useEffect, useState } from 'react';
import api from '../api/axios';

const Watchlist = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlistData = async () => {
            try {
                // 1. Get the list of IDs from your MySQL database
                const response = await api.get('/movies/watchlist');
                const idList = response.data; // e.g., ["tt0137523", "tt0068646"]

                // 2. Fetch full details for each ID in parallel
                const movieRequests = idList.map(id => api.get(`/movies/details/${id}`));
                const results = await Promise.all(movieRequests);
                
                // Extract the data from each axios response
                setMovies(results.map(res => res.data));
            } catch (error) {
                console.error("Error loading watchlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlistData();
    }, []);

    const handleRemove = async (imdbId) => {
        try {
            await api.delete(`/movies/watchlist/${imdbId}`);
            // Immediately update the UI by filtering out the removed movie
            setMovies(movies.filter(movie => movie.imdbID !== imdbId));
        } catch (error) {
            console.error("Error removing movie:", error);
        }
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading your movies...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>Your Saved Movies</h2>
            {movies.length === 0 ? (
                <p>Your watchlist is empty. Go to the search page to add some!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {movies.map((movie) => (
                        <div key={movie.imdbID} style={{ 
                            border: '1px solid #ddd', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                            <div style={{ padding: '10px' }}>
                                <h4 style={{ margin: '5px 0' }}>{movie.Title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>{movie.Year} • {movie.Genre}</p>
                            </div>
                            <button 
                                onClick={() => handleRemove(movie.imdbID)} 
                                style={{ 
                                    marginTop: '10px', 
                                    backgroundColor: '#ff4d4d', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                Remove
                            </button>
                            {/* inside your movie.map() block */}
                            <div style={{ marginTop: '10px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Available on:</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {movie.ottProviders && movie.ottProviders.length > 0 ? (
                                        movie.ottProviders.map((provider) => (
                                            <a 
                                                key={provider.name} 
                                                href={provider.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', color: '#007bff', fontSize: '0.8rem' }}
                                            >
                                                {/* If you have icons, use <img> here, otherwise text */}
                                                {provider.name}
                                            </a>
                                        ))
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>Not found</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;