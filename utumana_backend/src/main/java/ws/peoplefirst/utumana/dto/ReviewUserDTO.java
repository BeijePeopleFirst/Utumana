package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "DTO representing a review. Used to get a preview of a review.")
public class ReviewUserDTO {
    @Schema(description = "review's unique ID", example = "1")
    @Min(value = 1)
    private final Long id;

    @Schema(description = "review's title", example = "Wonderful house in the city")
    @Nullable
    private final String title;

    @Schema(description = "review's description", example = "The house was cozy and the owner Mario made us feel at home since the beginning. Close to the subway in the city center.")
    @Nullable
    private final String description;

    @Schema(description = "review's overall rating. Must be a decimal between 0.0 and 5.0", example = "4.33")
    @Nullable
    private final Double overallRating;

    @JsonProperty(value = "approval_timestamp")
    @Schema(description = "timestamp of the review's approval, formatted as YYYY-MM-DD HH:mm:ss", example = "2024-11-06T15:39:45")
    @Nullable
    private final LocalDateTime approvalTimestamp;

    @Schema(description = "review's user name", example = "Pippo")
    @Nullable
    private final String nameUser;

    @Schema(description = "review's user profile image", example = "/images/user.jpg")
    @Nullable
    private final String imageUser;

    public ReviewUserDTO(Long id, String title, String description, Double overallRating, LocalDateTime approvalTimestamp, String nameUser, String imageUser) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.overallRating = overallRating;
        this.approvalTimestamp = approvalTimestamp;
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

    public String getNameUser() {
        return nameUser;
    }

    public String getImageUser() {
        return imageUser;
    }

}




