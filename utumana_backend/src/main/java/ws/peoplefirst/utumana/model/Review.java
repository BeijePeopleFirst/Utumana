package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import ws.peoplefirst.utumana.utility.Constants;


@Entity
@Table(name = "review")
@Schema(description = "Model to represent a review. A review is in a one on one relationship with a booking.")
public class Review {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "review's unique ID", example = "1")
	@Min(value = 1)
	private Long id;
	
	@Column(name = "booking_id")
	@Schema(description = "Unique ID of the booking to which this review is associated", example = "1")
	@Min(value = 1)
	private Long bookingId;
	
	@Column(name = "title")
	@Schema(description = "review's title", example = "Wonderful house in the city")
	@Nullable
	private String title;
	
	@Column(name = "description")
	@Schema(description = "review's description", example = "The house was cozy and the owner Mario made us feel at home since the beginning. Close to the subway in the city center.")
	@Nullable
	private String description;
	
	@Column(name = "approval_timestamp")
	@Schema(description = "timestamp of the review's approval", example = "2024-11-06T15:39:45")
	@Nullable
	private LocalDateTime approvalTimestamp;
	
	@Column(name = "overall_rating")
	@Schema(description = "review's overall rating. Must be a decimal between 0.0 and 5.0", example = "4.33")
	@Nullable
	private Double overallRating;
	
	@Column(name = "comfort")
	@Schema(description = "rating of the accommodation's comfort. Must be a decimal between 0.0 and 5.0", example = "4.00")
	@Nullable
	private Double comfort;

	@Column(name = "convenience")
	@Schema(description = "rating of the accommodation's convenience/affordibility. Must be a decimal between 0.0 and 5.0", example = "4.00")
	@Nullable
	private Double convenience;
	
	@Column(name = "position")
	@Schema(description = "rating of the accommodation's position. Must be a decimal between 0.0 and 5.0", example = "5.00")
	@Nullable
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
		return approvalTimestamp != null ? Constants.DATE_TIME_FORMATTER.format(approvalTimestamp) : null;
	}

	public void setApprovalTimestamp(LocalDateTime approvalTimestamp) {
		this.approvalTimestamp = approvalTimestamp;
	}
	
	@JsonSetter(value = "approval_timestamp")
	public void setApprovalTimestamp(String approvalTimestamp) {
		this.approvalTimestamp = approvalTimestamp != null ? LocalDateTime.parse(approvalTimestamp, Constants.DATE_TIME_FORMATTER) : null;	
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
