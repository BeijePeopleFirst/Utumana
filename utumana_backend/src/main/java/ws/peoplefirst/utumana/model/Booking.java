package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;


@Entity
@Table(name = "booking")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Model to represent a booking. A booking is in a many to one relationship with an accommodation, in a many to one relationship with a user (the booking's guest), and in a one to one relationship with a review (that may be null).")
public class Booking {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "booking's unique ID", example = "1")
	@Min(value = 1)
	private Long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "accommodation_id")
	@Schema(description = "the booked accommodation")
	private Accommodation accommodation;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	@JsonIgnore
	@Schema(description = "the guest who made the booking")
	private User user;
	
	@JsonProperty(value = "user_id")
	@Column(name = "user_id",insertable=false,updatable=false)
	@Schema(description = "id of the guest who made the booking", example = "14")
	private Long userId;
	
	@Column(name = "timestamp")
	@Schema(description = "timestamp of when the host approved this booking", example = "2024-11-06T15:39:45")
	@Nullable
	private LocalDateTime timestamp;
	
	@Column(name = "price")
	@Schema(description = "total price of the booking. Must be a decimal greater or equal to 0.0", example = "10.00")
	@Nullable
	private Double price;
	
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	@Schema(description = "booking's current status. Can be 'PENDING', 'ACCEPTED', 'REJECTED', 'DOING' or 'DONE'.", example = "ACCEPTED")
	private BookingStatus status;
	
	@JsonProperty(value = "check_in")
	@Column(name = "check_in")
	@Schema(description = "check-in's timestamp", example = "2024-11-18T14:00:00")
	private LocalDateTime checkIn;
	
	@JsonProperty(value = "check_out")
	@Column(name = "check_out")
	@Schema(description = "check-out's timestamp", example = "2024-11-25T10:00:00")
	private LocalDateTime checkOut;
	
	@JsonProperty(value = "is_unavailability")
	@Column(name = "is_unavailability")
	@Schema(description = "flag to indicate if this is a real booking (false) or if it is a period of unavailability set by the host (true)", example = "false")
	private Boolean isUnavailability;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "review_id")
	@Schema(description = "review associated with this booking. A review may only be written when the booking's status is 'DONE'.")
	@Nullable
	private Review review;
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Accommodation getAccommodation() {
		return accommodation;
	}

	public void setAccommodation(Accommodation accommodation) {
		this.accommodation = accommodation;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	
	@JsonGetter(value = "timestamp")
	public String getTimeStampJson() {
		return JsonFormatter.parseDateTime(timestamp);
	}
	
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	
	@JsonSetter(value = "timestamp")
	public void setTimeStampJson(String date) {
		this.timestamp = JsonFormatter.parseStringIntoDateTime(date);;
	}
	
	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}


	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public LocalDateTime getCheckIn() {
		return checkIn;
	}
	
	@JsonGetter(value = "check_in")
	public String getCheckInJson() {
		return JsonFormatter.parseDateTime(checkIn);
	}

	public void setCheckIn(LocalDateTime checkIn) {
		this.checkIn = checkIn;
	}
	
	@JsonSetter(value = "check_in")
	public void setCheckInJson(String date) {
		this.checkIn = JsonFormatter.parseStringIntoDateTime(date);;
	}
	
	public LocalDateTime getCheckOut() {
		return checkOut;
	}
	
	@JsonGetter(value = "check_out")
	public String getCheckOutJson() {
		return JsonFormatter.parseDateTime(checkOut);
	}

	public void setCheckOut(LocalDateTime checkOut) {
		this.checkOut = checkOut;
	}
	
	@JsonSetter(value = "check_out")
	public void setCheckOutJson(String date) {
		this.checkOut = JsonFormatter.parseStringIntoDateTime(date);;
	}
	
	public Boolean getIsUnavailability() {
		return isUnavailability;
	}

	public void setIsUnavailability(Boolean isUnavailability) {
		this.isUnavailability = isUnavailability;
	}

	
	public Review getReview() {
		return review;
	}

	public void setReview(Review review) {
		this.review = review;
	}
}
