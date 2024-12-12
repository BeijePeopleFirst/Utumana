package ws.peoplefirst.utumana.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.JsonFormatter;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;


@Entity
@Table(name = "badge_award")
public class BadgeAward {
	
	@EmbeddedId
	private BadgeAwardKey id;
	
	@JsonIgnore
	@ManyToOne
	@MapsId("userId")
	@JoinColumn(name = "user_id")
	User user;
	
	
	@ManyToOne(fetch = FetchType.EAGER)
	@MapsId("badgeId")
	@JoinColumn(name = "badge_id")
	Badge badge;
	
	@Column(name = "award_date")
	@JsonProperty(value = "award_date")
	LocalDate awardDate;

	public BadgeAwardKey getId() {
		return id;
	}

	public void setId(BadgeAwardKey id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Badge getBadge() {
		return badge;
	}

	public void setBadge(Badge badge) {
		this.badge = badge;
	}

	public LocalDate getAwardDate() {
		return awardDate;
	}

	@JsonGetter(value = "award_date")
	public String getAwardDateAsString() {
		return awardDate != null ? JsonFormatter.DATE_FORMATTER.format(awardDate) : null;
	}
	
	public void setAwardDate(LocalDate awardDate) {
		this.awardDate = awardDate;
	}
	
	@JsonSetter(value = "award_date")
	public void setAwardDate(String awardDate) {
		this.awardDate = awardDate != null ? LocalDate.parse(awardDate, JsonFormatter.DATE_FORMATTER) : null;	
	}
}
