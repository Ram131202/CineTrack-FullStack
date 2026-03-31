package com.movieapp.movieserver.service;

import com.movieapp.movieserver.model.MovieSearchResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
// import org.springframework.core.ParameterizedTypeReference;
// import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class MovieService {

    @Value("${omdb.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BASE_URL = "http://www.omdbapi.com/";

    // Search for movies by title
    public MovieSearchResult searchMovies(String query) {
        String url = BASE_URL + "?s=" + query + "&apikey=" + apiKey;
        return restTemplate.getForObject(url, MovieSearchResult.class);
    }

    // Get deep details (Casting, Ratings, Plot) by IMDb ID
    public Map<String, Object> getMovieDetails(String imdbId) {
        String url = "http://www.omdbapi.com/?i=" + imdbId + "&plot=full&apikey=" + apiKey;
        Map<String, Object> details = restTemplate.getForObject(url, Map.class);

        if (details != null && "True".equals(details.get("Response"))) {
            String title = (String) details.get("Title");

            // Strategy: Provide a direct "Google Search" link for OTT availability in India
            // This is a reliable fallback since specific OTT APIs can be expensive or
            // limited
            String searchLink = "https://www.google.com/search?q=where+to+watch+" + title.replace(" ", "+")
                    + "+in+India";
            details.put("ottSearchLink", searchLink);

            // Placeholder for a real OTT API integration (e.g., Watchmode or JustWatch)
            details.put("streamingStatus", "Check availability via link");
        }

        return details;
    }

    public List<Map<String, Object>> getFullWatchlist(List<String> imdbIds) {
        List<Map<String, Object>> fullDetails = new ArrayList<>();

        for (String id : imdbIds) {
            // Reusing our existing getMovieDetails method
            Map<String, Object> details = getMovieDetails(id);
            if (details != null) {
                fullDetails.add(details);
            }
        }
        return fullDetails;
    }

    @Value("${watchmode.api.key}")
    private String watchmodeKey;

    public List<Map<String, Object>> getStreamingProviders(String imdbId) {
        // Watchmode allows searching directly by IMDb ID
        String url = "https://api.watchmode.com/v1/title/" + imdbId + "/sources/?apiKey=" + watchmodeKey
                + "&regions=IN";

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    org.springframework.http.HttpMethod.GET,
                    null,
                    new org.springframework.core.ParameterizedTypeReference<List<Map<String, Object>>>() {
                    });
            return response.getBody();
        } catch (Exception e) {
            return new ArrayList<>(); // Return empty list if API fails
        }
    }
}