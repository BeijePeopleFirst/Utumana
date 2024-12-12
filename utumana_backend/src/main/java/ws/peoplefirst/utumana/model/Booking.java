package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

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
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;


@Entity
@Table(name = "booking")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Booking {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "accommodation_id")
	private Accommodation accommodation;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	@JsonIgnore
	private User user;
	
	@Column(name = "timestamp")
	private LocalDateTime timestamp;
	
	@Column(name = "price")
	private Double price;
	
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private BookingStatus status;
	
	@JsonProperty(value = "check_out")
	@Column(name = "check_out")
	private LocalDateTime checkOut;
	
	@JsonProperty(value = "check_in")
	@Column(name = "check_in")
	private LocalDateTime checkIn;
	
	@JsonProperty(value = "is_unavailability")
	@Column(name = "is_unavailability")
	private Boolean isUnavailability;
	
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "review_id")
	private Review review;
	
	@JsonProperty(value = "user_id")
	@Column(name = "user_id",insertable=false,updatable=false)
	private Long userId;
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

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
