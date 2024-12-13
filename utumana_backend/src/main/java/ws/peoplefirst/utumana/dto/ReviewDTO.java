package ws.peoplefirst.utumana.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import ws.peoplefirst.utumana.utility.Constants;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewDTO {
	private final Long id;
	
	private final String title;
	
	private final String description;
	
	private final Double overallRating;
	
	@JsonProperty(value = "approval_timestamp")
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
