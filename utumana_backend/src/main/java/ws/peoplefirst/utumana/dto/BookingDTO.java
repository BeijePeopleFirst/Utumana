package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

public class BookingDTO {
	
	private Long id;

	private String accommodationMainPhotoURL;
	
	private String accommodationName;
	
	private String checkIn;
	
	private String checkOut;
	
	private Double price;
	
	private BookingStatus status;
	
	private Long accommodationId;
	
	private Long reviewId;
	
	public BookingDTO(String accommodationMainPhotoURL,String accommodationName,Double price,BookingStatus status,
			Long accommodationId,LocalDateTime checkIn,LocalDateTime checkOut) {
		this.accommodationMainPhotoURL=accommodationMainPhotoURL;
		this.accommodationName=accommodationName;
		this.price=price;
		this.status=status;
		this.accommodationId=accommodationId;
		this.checkIn=JsonFormatter.parseDateTime(checkIn);
		this.checkOut=JsonFormatter.parseDateTime(checkOut);
	}
	
	public BookingDTO(Long id, String accommodationMainPhotoURL,String accommodationName,Double price,BookingStatus status,
			Long accommodationId,LocalDateTime checkIn,LocalDateTime checkOut, Long reviewId) {
		this.accommodationMainPhotoURL=accommodationMainPhotoURL;
		this.accommodationName=accommodationName;
		this.price=price;
		this.status=status;
		this.accommodationId=accommodationId;
		this.checkIn=JsonFormatter.parseDateTime(checkIn);
		this.checkOut=JsonFormatter.parseDateTime(checkOut);
		this.id = id;
		this.reviewId = reviewId;
	}
	
	
	
	public String getAccommodationMainPhotoURL() {
		return accommodationMainPhotoURL;
	}

	public String getAccommodationName() {
		return accommodationName;
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


	public Long getAccommodationId() {
		return accommodationId;
	}

	public Long getId() {
		return id;
	}
	
	public Long getReviewId() {
		return reviewId;
	}
}
