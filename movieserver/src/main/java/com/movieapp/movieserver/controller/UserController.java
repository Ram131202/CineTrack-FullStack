package com.movieapp.movieserver.controller;

import com.movieapp.movieserver.config.JwtUtil;
import com.movieapp.movieserver.model.User;
import com.movieapp.movieserver.service.MovieService;
import com.movieapp.movieserver.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint to register a new user
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // Endpoint to get a user by username (for testing)
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @Autowired
    private MovieService movieService;

    // GET: http://localhost:8080/api/users/profile/cinephile_99
    @GetMapping("/profile/{username}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null)
            return ResponseEntity.notFound().build();

        // Fetch full details for both lists
        List<Map<String, Object>> watchlistDetails = movieService.getFullWatchlist(user.getWatchlist());
        List<Map<String, Object>> watchedDetails = movieService.getFullWatchlist(user.getWatchedList());

        // Bundle them together
        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("watchlist", watchlistDetails);
        response.put("watched", watchedDetails);

        return ResponseEntity.ok(response);
    }

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userService.findByUsername(loginRequest.getUsername());

        if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of("token", token, "username", user.getUsername()));
        }

        return ResponseEntity.status(401).body("Invalid username or password");
    }
}