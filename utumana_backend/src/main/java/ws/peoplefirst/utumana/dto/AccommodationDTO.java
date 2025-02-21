package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Schema(description = "DTO representing an accommodation")
public class AccommodationDTO {

    @Schema(description = "Unique identifier of the accommodation", example = "1001")
    private Long id;

    @Schema(description = "Title or name of the accommodation", example = "Luxury Beach Resort")
    private String title;

    @Schema(description = "City where the accommodation is located", example = "Barcelona")
    private String city;

    @Schema(description = "Province where the accommodation is located", example = "Catalonia")
    private String province;

    @Schema(description = "Country where the accommodation is located", example = "Spain")
    private String country;

    @JsonProperty(value = "main_photo_url")
    @Schema(description = "URL of the main photo of the accommodation", example = "https://example.com/images/hotel1.jpg")
    private String mainPhotoUrl;

    @JsonProperty(value = "min_price")
    @Schema(description = "Minimum price per night", example = "50.0")
    private Double minPrice;

    @JsonProperty(value = "max_price")
    @Schema(description = "Maximum price per night", example = "300.0")
    private Double maxPrice;

    @JsonProperty(value = "is_favourite")
    @Schema(description = "Indicates if the accommodation is marked as favorite", example = "true")
    private Boolean isFavourite;

    @Schema(description = "Average rating of the accommodation", example = "4.5")
    private Double rating;
	
	
	public AccommodationDTO() {}
	
	public AccommodationDTO(Long id, String title, String city, String province, String country, String mainPhotoUrl, Double rating) {
		this.id = id;
		this.title = title;
		this.city = city;
		this.province = province;
		this.country = country;
		this.mainPhotoUrl = mainPhotoUrl;
		this.rating = rating;
	}
	
	public AccommodationDTO(Long id, String title, String city, String mainPhotoUrl, String country) {
		this.id = id;
		this.title = title;
		this.city = city;
		this.mainPhotoUrl = mainPhotoUrl;
		this.country = country;
	}
	
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}
	
	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getMainPhotoUrl() {
		return mainPhotoUrl;
	}

	public void setMainPhotoUrl(String mainPhotoUrl) {
		this.mainPhotoUrl = mainPhotoUrl;
	}

	public Double getMinPrice() {
		return minPrice;
	}
	public void setMinPrice(Double p) {
		this.minPrice = p;
	}

	public Double getMaxPrice() {
		return maxPrice;
	}
	public void setMaxPrice(Double p) {
		this.maxPrice = p;
	}

	public Boolean getIsFavourite() {
		return isFavourite;
	}

	public void setIsFavourite(Boolean isFavourite) {
		this.isFavourite = isFavourite;
	}
	
	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	@Override
	public String toString() {
		return "Accommodation [id=" + id + ", title=" + title +", country=" + country
				+ ", mainPhotoUrl=" + mainPhotoUrl+ ", minPrice=" + minPrice+ ", maxPrice=" + maxPrice+"]";
	}

}
