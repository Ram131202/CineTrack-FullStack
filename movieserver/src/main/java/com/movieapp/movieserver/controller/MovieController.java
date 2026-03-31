package com.movieapp.movieserver.controller;

import com.movieapp.movieserver.model.MovieSearchResult;
import com.movieapp.movieserver.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // GET: http://localhost:8080/api/movies/search?query=Batman
    @GetMapping("/search")
    public MovieSearchResult search(@RequestParam String query) {
        return movieService.searchMovies(query);
    }

    // GET: http://localhost:8080/api/movies/details/tt0372784
    @GetMapping("/details/{imdbId}")
    public Map<String, Object> getDetails(@PathVariable String imdbId) {
        Map<String, Object> details = movieService.getMovieDetails(imdbId);

        // Fetch real-time OTT providers for India
        List<Map<String, Object>> providers = movieService.getStreamingProviders(imdbId);
        details.put("ottProviders", providers);

        return details;
    }

    // For Non-Registered Users: Show "Featured" movies (we pick some popular IDs)
    @GetMapping("/featured")
    public List<Map<String, Object>> getFeaturedMovies() {
        List<String> featuredIds = Arrays.asList("tt1375666", "tt0133093", "tt0068646"); // Inception, Matrix, Godfather
        return movieService.getFullWatchlist(featuredIds);
    }
}