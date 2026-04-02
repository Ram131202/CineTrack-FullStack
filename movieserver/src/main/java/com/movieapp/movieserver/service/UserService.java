package com.movieapp.movieserver.service;

import com.movieapp.movieserver.model.User;
import com.movieapp.movieserver.repository.UserRepository;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Encode the password so login works later
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Initialize empty lists to prevent NullPointerExceptions
        user.setWatchlist(new ArrayList<>());
        user.setWatchedList(new ArrayList<>());

        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

}