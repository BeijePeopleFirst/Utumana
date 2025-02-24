package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@Entity
@Table(name = "unavailability_draft")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnavailabilityDraft {
    @Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "unavailability draft's unique ID", example = "1")
	@Min(value = 1)
	private Long id;

    @JsonProperty(value = "check_in")
	@Column(name = "check_in")
	@Schema(description = "check-in's timestamp", example = "2024-11-18T14:00:00")
	private LocalDateTime checkIn;
	
	@JsonProperty(value = "check_out")
	@Column(name = "check_out")
	@Schema(description = "check-out's timestamp", example = "2024-11-25T10:00:00")
	private LocalDateTime checkOut;

    @JsonProperty(value = "accommodation_draft_id")
	@Column(name = "accommodation_draft_id", insertable = false, updatable = false)
	private Long accommodationDraftId;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_draft_id")
    private AccommodationDraft accommodationDraft;


    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

    public Long getAccommodationDraftId() {
		return accommodationDraftId;
	}

	public void setAccommodationDraftId(Long accommodationDraftId) {
		this.accommodationDraftId = accommodationDraftId;
	}
	
	
	public AccommodationDraft getAccommodationDraft() {
		return accommodationDraft;
	}

	public void setAccommodationDraft(AccommodationDraft accommodationDraft) {
		this.accommodationDraft = accommodationDraft;
	}

    @Override
    public String toString() {
        return "UnavailabilityDraft [id=" + id + ", checkIn=" + checkIn + ", checkOut=" + checkOut
                + ", accommodationDraftId=" + accommodationDraftId + "]";
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((checkIn == null) ? 0 : checkIn.hashCode());
        result = prime * result + ((checkOut == null) ? 0 : checkOut.hashCode());
        result = prime * result + ((accommodationDraftId == null) ? 0 : accommodationDraftId.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UnavailabilityDraft other = (UnavailabilityDraft) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (checkIn == null) {
            if (other.checkIn != null)
                return false;
        } else if (!checkIn.equals(other.checkIn))
            return false;
        if (checkOut == null) {
            if (other.checkOut != null)
                return false;
        } else if (!checkOut.equals(other.checkOut))
            return false;
        if (accommodationDraftId == null) {
            if (other.accommodationDraftId != null)
                return false;
        } else if (!accommodationDraftId.equals(other.accommodationDraftId))
            return false;
        return true;
    }
}
