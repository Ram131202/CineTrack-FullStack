package com.movieapp.movieserver.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data // This Lombok annotation generates getters, setters, and toString automatically
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    @ElementCollection
    @CollectionTable(name = "user_watchlist", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "imdb_id") // Renamed for clarity
    private List<String> watchlist = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_watched", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "imdb_id")
    private List<String> watchedList = new ArrayList<>();

}