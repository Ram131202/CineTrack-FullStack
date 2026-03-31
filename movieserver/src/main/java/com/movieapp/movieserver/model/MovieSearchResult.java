package com.movieapp.movieserver.model;

import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class MovieSearchResult {
    @JsonProperty("Search")
    private List<OMDbMovie> search;
    
    @JsonProperty("totalResults")
    private String totalResults;

    @Data
    public static class OMDbMovie {
        @JsonProperty("Title")
        private String title;
        @JsonProperty("Year")
        private String year;
        @JsonProperty("imdbID")
        private String imdbID;
        @JsonProperty("Type")
        private String type;
        @JsonProperty("Poster")
        private String poster;
    }
}