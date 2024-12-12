package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AccommodationDTO {
	
	private Long id;

	private String title;
	
	private String city;
	
	@JsonProperty(value = "main_photo_url")
	private String mainPhotoUrl;
	
	private String country;
	
	@JsonProperty(value = "min_price")
	private Double minPrice;
	
	@JsonProperty(value = "max_price")
	private Double maxPrice;
	
	@JsonProperty(value = "is_favourite")
	private Boolean isFavourite;
	
	public AccommodationDTO() {}
	
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

	public String getTitle() {
		return title;
	}

	public String getCity() {
		return city;
	}

	public String getMainPhotoUrl() {
		return mainPhotoUrl;
	}

	public String getCountry() {
		return country;
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
	
	@Override
	public String toString() {
		return "Accommodation [id=" + id + ", title=" + title +", country=" + country
				+ ", mainPhotoUrl=" + mainPhotoUrl+ ", minPrice=" + minPrice+ ", maxPrice=" + maxPrice+"]";
	}

}
