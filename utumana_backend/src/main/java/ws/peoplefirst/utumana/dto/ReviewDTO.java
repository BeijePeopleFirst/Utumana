package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import ws.peoplefirst.utumana.utility.Constants;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "DTO representing a review for an accommodation or service")
public class ReviewDTO {

	@Schema(description = "Unique identifier of the review", example = "456")
	private final Long id;
	
	@Schema(description = "Title of the review", example = "Great stay!")
    private final String title;
	
	@Schema(description = "Detailed description of the review", example = "The place was clean and the host was very kind.")
    private final String description;
	
	@Schema(description = "Overall rating score given in the review", example = "4.5")
    private final Double overallRating;
	
	@JsonProperty(value = "approval_timestamp")
	@Schema(description = "Timestamp when the review was approved, formatted as YYYY-MM-DD HH:mm:ss", example = "2025-06-15 14:30:00")
    private final LocalDateTime approvalTimestamp;
	

	public ReviewDTO(Long id, String title, String description, Double overallRating, LocalDateTime approvalTimestamp) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.overallRating = overallRating;
		this.approvalTimestamp = approvalTimestamp;
	}

	public Long getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public Double getOverallRating() {
		return overallRating;
	}

	public LocalDateTime getApprovalTimestamp() {
		return approvalTimestamp;
	}
	
	@JsonGetter(value = "approval_timestamp")
	public String getApprovalTimestampAString() {
		return approvalTimestamp != null ? Constants.DATE_TIME_FORMATTER.format(approvalTimestamp) : null;
	}
	
}
