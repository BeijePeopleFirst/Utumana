package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "DTO representing an unavailability period for an accommodation")
public class UnavailabilityDTO {

	@Schema(description = "Unique identifier of the unavailability period", example = "123")
    private Long id;
	
	@JsonProperty(value = "check_in")
	@Schema(description = "Check-in date in YYYY-MM-DD format", example = "2025-06-15")
    private String checkIn;
	
	@JsonProperty(value = "check_out")
	@Schema(description = "Check-out date in YYYY-MM-DD format", example = "2025-06-20")
    private String checkOut;
	
	
	public UnavailabilityDTO() {}
	
	public UnavailabilityDTO(Long id, LocalDateTime checkIn, LocalDateTime checkOut) {
		this.id = id;
		this.checkIn = JsonFormatter.parseDate(checkIn.toLocalDate());
		this.checkOut = JsonFormatter.parseDate(checkOut.toLocalDate());
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCheckIn() {
		return checkIn;
	}

	public void setCheckIn(String checkIn) {
		this.checkIn = checkIn;
	}

	public String getCheckOut() {
		return checkOut;
	}

	public void setCheckOut(String checkOut) {
		this.checkOut = checkOut;
	}
}
