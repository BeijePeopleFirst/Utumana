package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.JsonFormatter;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;


@Entity
@Table(name = "review")
public class Review {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "booking_id")
	private Long bookingId;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "approval_timestamp")
	private LocalDateTime approvalTimestamp;
	
	@Column(name = "overall_rating")
	private Double overallRating;
	
	@Column(name = "comfort")
	private Double comfort;

	@Column(name = "convenience")
	private Double convenience;
	
	@Column(name = "position")
	private Double position;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}

	public LocalDateTime getApprovalTimestamp() {
		return approvalTimestamp;
	}
	
	@JsonGetter(value = "approval_timestamp")
	public String getApprovalTimestampAString() {
		return approvalTimestamp != null ? JsonFormatter.DATE_TIME_FORMATTER.format(approvalTimestamp) : null;
	}

	public void setApprovalTimestamp(LocalDateTime approvalTimestamp) {
		this.approvalTimestamp = approvalTimestamp;
	}
	
	@JsonSetter(value = "approval_timestamp")
	public void setApprovalTimestamp(String approvalTimestamp) {
		this.approvalTimestamp = approvalTimestamp != null ? LocalDateTime.parse(approvalTimestamp, JsonFormatter.DATE_TIME_FORMATTER) : null;	
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getOverallRating() {
		return overallRating;
	}

	public void setOverallRating(Double overallRating) {
		this.overallRating = overallRating;
	}

	public Double getComfort() {
		return comfort;
	}

	public void setComfort(Double comfort) {
		this.comfort = comfort;
	}

	public Double getConvenience() {
		return convenience;
	}

	public void setConvenience(Double convenience) {
		this.convenience = convenience;
	}

	public Double getPosition() {
		return position;
	}

	public void setPosition(Double position) {
		this.position = position;
	}

	@Override
	public String toString() {
		return "Review [id=" + id + ", bookingId=" + bookingId + ", title=" + title + ", description=" + description
				+ ", approvalTimestamp=" + approvalTimestamp + ", overallRating=" + overallRating + ", comfort="
				+ comfort + ", convenience=" + convenience + ", position=" + position + "]";
	}
	
	

}
