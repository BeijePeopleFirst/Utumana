package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import ws.peoplefirst.utumana.utility.JsonFormatter;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnavailabilityDTO {
	private Long id;
	
	@JsonProperty(value = "check_in")
	private String checkIn;
	
	@JsonProperty(value = "check_out")
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
