package com.movieapp.movieserver.controller;

import com.movieapp.movieserver.model.User;
import com.movieapp.movieserver.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    // POST: http://localhost:8080/api/watchlist/toggle/1?imdbId=tt1375666
    @PostMapping("/toggle/{userId}")
    public ResponseEntity<User> toggleWatchlist(@PathVariable Long userId, @RequestParam String imdbId) {
        return ResponseEntity.ok(watchlistService.toggleWatchlist(userId, imdbId));
    }

    // POST: http://localhost:8080/api/watchlist/watched/1?imdbId=tt1375666
    @PostMapping("/watched/{userId}")
    public ResponseEntity<User> markAsWatched(@PathVariable Long userId, @RequestParam String imdbId) {
        return ResponseEntity.ok(watchlistService.addToWatched(userId, imdbId));
    }
}