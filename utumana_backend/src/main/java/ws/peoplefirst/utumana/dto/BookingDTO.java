package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

public class BookingDTO {
	
	private Long id;
	
	private AccommodationDTO accommodation;
	
	private String checkIn;
	
	private String checkOut;
	
	private Double price;
	
	private BookingStatus status;
	
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
