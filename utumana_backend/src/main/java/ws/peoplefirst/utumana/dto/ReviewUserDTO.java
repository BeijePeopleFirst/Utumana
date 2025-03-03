package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import ws.peoplefirst.utumana.utility.Constants;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "DTO representing a review. Used to get a preview of a review.")
public class ReviewUserDTO {
    @Schema(description = "review's unique ID", example = "1")
    @Min(value = 1)
    private final Long id;

    @Column(name = "booking_id")
	@Schema(description = "Unique ID of the booking to which this review is associated", example = "1")
	@Min(value = 1)
	@JsonProperty(value = "booking_id")
	private Long bookingId;

    @Schema(description = "review's title", example = "Wonderful house in the city")
    @Nullable
    private final String title;

    @Schema(description = "review's description", example = "The house was cozy and the owner Mario made us feel at home since the beginning. Close to the subway in the city center.")
    @Nullable
    private final String description;

    @Schema(description = "review's overall rating. Must be a decimal between 0.0 and 5.0", example = "4.33")
    @Nullable
    @JsonProperty(value = "overall_rating")
    private final Double overallRating;

    @JsonProperty(value = "approval_timestamp")
    @Schema(description = "timestamp of the review's approval, formatted as YYYY-MM-DD HH:mm:ss", example = "2024-11-06T15:39:45")
    @Nullable
    private final LocalDateTime approvalTimestamp;

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

    @Schema(description = "review's user name", example = "Pippo")
    @Nullable
    @JsonProperty(value = "name_user")
    private final String nameUser;

    @Schema(description = "review's user profile image", example = "/images/user.jpg")
    @Nullable
    @JsonProperty(value = "image_user")
    private final String imageUser;

    public ReviewUserDTO(Long id, Long bookingId, String title, String description, Double overallRating, LocalDateTime approvalTimestamp, Double comfort, Double convenience, Double position, String nameUser, String imageUser) {
        this.id = id;
        this.bookingId = bookingId;
        this.title = title;
        this.description = description;
        this.overallRating = overallRating;
        this.approvalTimestamp = approvalTimestamp;
        this.comfort = comfort;
        this.convenience = convenience;
        this.position = position;
        this.nameUser = nameUser;
        this.imageUser = imageUser;
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

    public String getNameUser() {
        return nameUser;
    }

    public String getImageUser() {
        return imageUser;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public Double getComfort() {
        return comfort;
    }

    public Double getConvenience() {
        return convenience;
    }

    public Double getPosition() {
        return position;
    }

}




