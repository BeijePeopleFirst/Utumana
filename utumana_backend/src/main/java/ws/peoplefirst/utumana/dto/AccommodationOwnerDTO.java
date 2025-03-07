package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

public class AccommodationOwnerDTO {
    private Long id;
    private String name;
    private String surname;
    private String bio;

    @JsonProperty(value="profile_picture_url")
    private String profilePictureUrl;

    
    public AccommodationOwnerDTO() {
        
    };

    public AccommodationOwnerDTO(Long id, String name, String surname, String bio, String profilePictureUrl) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.bio = bio;
        this.profilePictureUrl = profilePictureUrl;
    }

    public Long getId() {
        return this.id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return this.surname;
    }
    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getBio() {
        return this.bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }

    @JsonGetter(value="profile_picture_url")
    public String getProfilePictureUrl() {
        return this.profilePictureUrl;
    }

    @JsonSetter(value="profile_picture_url")
    public void setProfilePictureUrl(String url) {
        this.profilePictureUrl = url;
    }
}
