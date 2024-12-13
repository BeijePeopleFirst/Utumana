package ws.peoplefirst.utumana.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.JsonFormatter;


@Entity
@Table(name = "availability")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Availability {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@JsonProperty(value = "start_date")
	@Column(name = "start_date")
	private LocalDate startDate;
	
	@JsonProperty(value = "end_date")
	@Column(name = "end_date")
	private LocalDate endDate;
	
	@JsonProperty(value = "price_per_night")
	@Column(name = "price_per_night")
	private Double pricePerNight;
	
	@JsonProperty(value = "accommodation_id")
	@Column(name = "accommodation_id", insertable = false, updatable = false)
	private Long accommodationId;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	
	@JsonGetter(value = "start_date")
	public String getStartDateJson() {
		return JsonFormatter.parseDate(startDate);
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}
	
	@JsonSetter(value = "start_date")
	public void setStartDateJson(String date) {
		this.startDate = JsonFormatter.parseStringIntoDate(date);
	}
	

	@JsonGetter(value = "end_date")
	public String getEndDateJson() {
		return JsonFormatter.parseDate(endDate);
	}
	
	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}
	
	@JsonSetter(value = "end_date")
	public void setEndDateJson(String date) {
		this.endDate = JsonFormatter.parseStringIntoDate(date);;
	}
	
	
	public Double getPricePerNight() {
		return pricePerNight;
	}

	public void setPricePerNight(Double pricePerNight) {
		this.pricePerNight = pricePerNight;
	}

	
	public Long getAccommodationId() {
		return accommodationId;
	}

	public void setAccommodationId(Long accommodationId) {
		this.accommodationId = accommodationId;
	}
	
	
	public Accommodation getAccommodation() {
		return accommodation;
	}

	public void setAccommodation(Accommodation accommodation) {
		this.accommodation = accommodation;
	}

	@Override
	public String toString() {
		return "Availability [startDate=" + startDate + ", endDate=" + endDate + ", pricePerNight=" + pricePerNight
				+ ", accommodationId=" + accommodationId + "]";
	}
}
