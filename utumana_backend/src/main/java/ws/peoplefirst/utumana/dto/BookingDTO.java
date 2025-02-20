package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@Schema(description = "DTO representing a booking. A booking is in a many to one relationship with an accommodation, in a many to one relationship with a user (the booking's guest), and in a one to one relationship with a review (that may be null).")
public class BookingDTO {
	@Schema(description = "booking's unique ID", example = "1")
	@Min(value = 1)
	private Long id;
	
	@Schema(description = "DTO of the booked accommodation")
	private AccommodationDTO accommodation;
	
	@Schema(description = "check-in's date and time in ISO format", example = "2024-11-18T14:00:00")
	private String checkIn;
	
	@Schema(description = "check-out's date and time in ISO format", example = "2024-11-25T10:00:00")
	private String checkOut;
	
	@Schema(description = "total price of the booking. Must be a decimal greater or equal to 0.0", example = "10.00")
	@Nullable
	private Double price;
	
	@Schema(description = "booking's current status. Can be 'PENDING', 'ACCEPTED', 'REJECTED', 'DOING' or 'DONE'.", example = "ACCEPTED")
	private BookingStatus status;
	
	@Schema(description = "id of the review associated with this booking. A review may only be written when the booking's status is 'DONE'.", example = "1")
	@Nullable
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
	
	
	public Long getId() {
		return id;
	}
	
	public AccommodationDTO getAccommodation() {
		return accommodation;
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
	
	public Long getReviewId() {
		return reviewId;
	}
	

	@Override
	public String toString() {
		return "BookingDTO [id=" + id+ ", accommodation=" + accommodation.toString() + ", checkIn=" + checkIn + ", checkOut=" + checkOut
				+ ", price=" + price + ", status=" + status + ", reviewId="+ reviewId + "]";
	}

}
