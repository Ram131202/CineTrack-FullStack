package com.movieapp.movieserver.service;

import com.movieapp.movieserver.model.User;
import com.movieapp.movieserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private UserRepository userRepository;

    public User toggleWatchlist(Long userId, String imdbId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<String> watchlist = user.getWatchlist();
        if (watchlist.contains(imdbId)) {
            watchlist.remove(imdbId);
        } else {
            watchlist.add(imdbId);
        }
        return userRepository.save(user);
    }

    public User addToWatched(Long userId, String imdbId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getWatchlist().remove(imdbId);

        if (!user.getWatchedList().contains(imdbId)) {
            user.getWatchedList().add(imdbId);
        }
        return userRepository.save(user);
    }
}