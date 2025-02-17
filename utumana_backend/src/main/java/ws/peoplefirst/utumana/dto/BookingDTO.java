package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;
@Schema(description = "DTO representing a booking")
public class BookingDTO {

    @Schema(description = "Unique identifier of the booking", example = "101")
    private Long id;

    @Schema(description = "Accommodation related to the booking")
    private AccommodationDTO accommodation;

    @Schema(description = "Check-in date and time in ISO format", example = "2025-03-15T14:00:00")
    private String checkIn;

    @Schema(description = "Check-out date and time in ISO format", example = "2025-03-20T11:00:00")
    private String checkOut;

    @Schema(description = "Total price of the booking", example = "250.50")
    private Double price;

    @Schema(description = "Current status of the booking", example = "ACCEPTED")
    private BookingStatus status;

    @Schema(description = "Identifier of the review associated with this booking (if any)", example = "55")
    private Long reviewId;
	
	public BookingDTO(Double price,BookingStatus status,LocalDateTime checkIn,LocalDateTime checkOut,
			AccommodationDTO accommodation) {
		this.accommodation = accommodation;
		this.price=price;
		this.status=status;
		this.checkIn=JsonFormatter.parseDateTime(checkIn);
		this.checkOut=JsonFormatter.parseDateTime(checkOut);
	}
	
	public BookingDTO(Long id,Double price,BookingStatus status,LocalDateTime checkIn,LocalDateTime checkOut,
			Long reviewId,AccommodationDTO accommodation) {
		this.accommodation = accommodation;
		this.price=price;
		this.status=status;
		this.checkIn=JsonFormatter.parseDateTime(checkIn);
		this.checkOut=JsonFormatter.parseDateTime(checkOut);
		this.id = id;
		this.reviewId = reviewId;
	}
	
	public String getCheckIn() {
		return checkIn;
	}

	public String getCheckOut() {
		return checkOut;
	}

	public Double getPrice() {
		return price;
	}

	public BookingStatus getStatus() {
		return status;
	}


	public Long getId() {
		return id;
	}
	
	public Long getReviewId() {
		return reviewId;
	}
	
	public AccommodationDTO getAccommodation() {
		return accommodation;
	}

	@Override
	public String toString() {
		return "BookingDTO [id=" + id+ ", accommodation=" + accommodation.toString() + ", checkIn=" + checkIn + ", checkOut=" + checkOut
				+ ", price=" + price + ", status=" + status + ", reviewId="+ reviewId + "]";
	}

}
