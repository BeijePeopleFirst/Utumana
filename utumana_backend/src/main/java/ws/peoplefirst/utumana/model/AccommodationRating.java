package ws.peoplefirst.utumana.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "accommodation_rating_view")
public class AccommodationRating {
    @Id
    @Column(name = "accommodation_id")
    @JsonProperty(value = "accommodation_id")
    private Long accommodationId;

    @Column
    private Double rating;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "accommodation_id")
    @JsonIgnore
    private Accommodation accommodation;


    public Long getAccommodationId() {
        return accommodationId;
    }

    public void setAccommodationId(Long accommodationId) {
        this.accommodationId = accommodationId;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Accommodation getAccommodation() {
        return accommodation;
    }

    public void setAccommodation(Accommodation accommodation) {
        this.accommodation = accommodation;
    }
}
