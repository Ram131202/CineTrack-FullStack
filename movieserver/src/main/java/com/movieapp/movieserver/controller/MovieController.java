package com.movieapp.movieserver.controller;

import com.movieapp.movieserver.model.MovieSearchResult;
import com.movieapp.movieserver.model.User;
import com.movieapp.movieserver.repository.UserRepository;
import com.movieapp.movieserver.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private UserRepository userRepository;

    // Ensure this matches the React call: api.get(`/movies/search?title=${query}`)
    @GetMapping("/search")
    public ResponseEntity<?> searchMovies(@RequestParam String title) {
        return ResponseEntity.ok(movieService.searchMovies(title));
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

    @PostMapping("/watchlist")
    public ResponseEntity<?> addToWatchlist(@RequestBody Map<String, String> request, Principal principal) {
        // 'Principal' is automatically filled by Spring Security based on the JWT token
        String username = principal.getName();
        String imdbId = request.get("imdbId");

        // We will call a service method to save this to the database
        movieService.saveToWatchlist(username, imdbId);

        return ResponseEntity.ok("Movie saved to watchlist");
    }

    @GetMapping("/watchlist")
    public ResponseEntity<List<String>> getWatchlist(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.getWatchlist());
    }

}