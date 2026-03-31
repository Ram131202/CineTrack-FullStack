package com.movieapp.movieserver.model;

import lombok.Data;
//import java.util.List;

@Data
public class MovieDto {
    private Integer id;
    private String title;
    private String overview;
    private String release_date;
    private Double vote_average;
    private String poster_path;
}