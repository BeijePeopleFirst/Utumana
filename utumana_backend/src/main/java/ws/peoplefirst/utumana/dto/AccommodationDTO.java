package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class AccommodationDTO {
	
	private Long id;

	private String title;
	
	private String city;
	
	private String province;
	
	private String country;
	
	@JsonProperty(value = "main_photo_url")
	private String mainPhotoUrl;	
	
	@JsonProperty(value = "min_price")
	private Double minPrice;
	
	@JsonProperty(value = "max_price")
	private Double maxPrice;
	
	@JsonProperty(value = "is_favourite")
	private Boolean isFavourite;
	
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
