package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PriceDTO {
	
	@JsonProperty(value = "accommodation_id")
	private Long accommodationId;
	
	@JsonProperty(value = "min_price")
	private Double minPrice;
	
	@JsonProperty(value = "max_price")
	private Double maxPrice;
	
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
	
	public Long getAccommodationId() {
		return accommodationId;
	}
	public void setAccommodationId(Long accommodationId) {
		this.accommodationId = accommodationId;
	}

}
