package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Schema(description = "DTO representing the price range for an accommodation")
public class PriceDTO {
	
	@JsonProperty(value = "accommodation_id")
	@Schema(description = "Unique identifier of the accommodation", example = "123")
    private Long accommodationId;
	
	@JsonProperty(value = "min_price")
	@Schema(description = "Minimum price of the accommodation per night", example = "50.0")
    private Double minPrice;
	
	@JsonProperty(value = "max_price")
	@Schema(description = "Maximum price of the accommodation per night", example = "150.0")
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
