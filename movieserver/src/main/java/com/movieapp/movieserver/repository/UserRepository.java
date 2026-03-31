package com.movieapp.movieserver.repository;

import com.movieapp.movieserver.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Custom method to find a user by their username for login
    Optional<User> findByUsername(String username);
}