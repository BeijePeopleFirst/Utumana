package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.JsonFormatter;



@Entity
@Table(name = "accommodation")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Model representing an accommodation")
public class Accommodation {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "Unique identifier of the accommodation", example = "1")
    private Long id;
	
	@JsonProperty(value = "owner_id")
	@Column(name = "owner_id")
	@Schema(description = "ID of the owner of the accommodation", example = "123")
    private Long ownerId;

	@Column(name = "title")
	@Schema(description = "Title of the accommodation", example = "Cozy Apartment in the City")
    private String title;
	
	@Column(name = "description")
	@Schema(description = "Description of the accommodation", example = "A beautiful apartment located in the heart of the city.")
	private String description;
	
	//@JsonInclude(JsonInclude.Include.NON_EMPTY)
	@JsonIgnore
	@Column(name = "approval_timestamp")
	@Schema(description = "Timestamp when the accommodation was approved", example = "2023-10-01T12:00:00")
    private LocalDateTime approvalTimestamp;
	
	@JsonIgnore
	@Column(name = "hiding_timestamp")
	@Schema(description = "Timestamp when the accommodation was hidden", example = "2023-10-01T12:00:00")
    private LocalDateTime hidingTimestamp;
	
	@Column(name = "beds")
	@Schema(description = "Number of beds in the accommodation", example = "2")
    private Integer beds;
	
	@Column(name = "rooms")
	@Schema(description = "Number of rooms in the accommodation", example = "3")
    private Integer rooms;
	
	@Column(name = "street")
	@Schema(description = "Street name of the accommodation's address", example = "Main Street")
	private String street;
	
	@JsonProperty(value = "street_number")
	@Column(name = "street_number")
	@Schema(description = "Street number of the accommodation's address", example = "123")
	private String streetNumber;
	
	@JsonProperty(value = "address_notes")
	@Column(name = "address_notes")
	@Schema(description = "Additional notes for the address", example = "Near the central park")
    private String addressNotes;
	
	@Column(name = "city")
	@Schema(description = "City of the accommodation", example = "New York")
	private String city;
	
	@Column(name = "cap")
	@Schema(description = "Postal code of the accommodation", example = "10001")
    private String cap;
	
	@Column(name = "province")
	@Schema(description = "Province of the accommodation", example = "NY")
    private String province;
	
	@Column(name = "country")
	@Schema(description = "Country of the accommodation", example = "USA")
    private String country;
	
	@Column(name = "coordinates")
	@Schema(description = "Geographical coordinates of the accommodation", example = "40.7128,-74.0060")
	private String coordinates;
	
	@JsonProperty(value = "main_photo_url")
	@Column(name = "main_photo_url")
	@Schema(description = "URL of the main photo of the accommodation", example = "https://example.com/photo.jpg")
	private String mainPhotoUrl;
	
	@ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@OrderColumn(name="service_order")
	@JoinTable(name = "service_availability", joinColumns = {
            @JoinColumn(name = "accommodation_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) }, inverseJoinColumns = {
                    @JoinColumn(name = "service_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) })
	@Schema(description = "Set of services available in the accommodation")
	private Set<Service> services;
	
	@OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderColumn(name = "order")
	@Schema(description = "List of photos of the accommodation")
	private List<Photo> photos;


	@OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderBy("startDate")
	@Schema(description = "List of availabilities of the accommodation")
    private List<Availability> availabilities;
	
	@OneToOne(mappedBy = "accommodation", fetch = FetchType.LAZY)
	@PrimaryKeyJoinColumn
	@Schema(description = "Rating of the accommodation")
    private AccommodationRating rating;
	


	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}
	
	
	public String getMainPhotoUrl() {
		return mainPhotoUrl;
	}

	public void setMainPhotoUrl(String mainPhotoUrl) {
		this.mainPhotoUrl = mainPhotoUrl;
	}
	

	public Set<Service> getServices() {
		return services;
	}

	public void setServices(Set<Service> services) {
		this.services = services;
	}
	
	public List<Photo> getPhotos() {
		return photos;
	}
	
	public void setPhotos(List<Photo> photos) {
		this.photos = photos;
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
	
	public LocalDateTime getApprovalTimestamp() {
		return approvalTimestamp;
	}
	
	@JsonGetter(value = "approval_timestamp")
	public String getApprovalTimestampJson() {
		return JsonFormatter.parseDateTime(approvalTimestamp);
	}

	@JsonSetter(value = "approval_timestamp")
	public void setApprovalTimestampJson(String date) {
		this.approvalTimestamp = JsonFormatter.parseStringIntoDateTime(date);
	}
	
	public void setApprovalTimestamp(LocalDateTime approvalTimestamp) {
		this.approvalTimestamp = approvalTimestamp;
	}

	
	public Integer getBeds() {
		return beds;
	}

	public void setBeds(Integer beds) {
		this.beds = beds;
	}
	

	public Integer getRooms() {
		return rooms;
	}

	public void setRooms(Integer rooms) {
		this.rooms = rooms;
	}

	
	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	
	public String getStreetNumber() {
		return streetNumber;
	}

	public void setStreetNumber(String streetNumber) {
		this.streetNumber = streetNumber;
	}

	
	public String getAddressNotes() {
		return addressNotes;
	}

	public void setAddressNotes(String addressNotes) {
		this.addressNotes = addressNotes;
	}

	
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	
	public String getCap() {
		return cap;
	}

	public void setCap(String cap) {
		this.cap = cap;
	}

	
	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	
	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	
	public String getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}
	
	public List<Availability> getAvailabilities() {
		return availabilities;
	}

	public void setAvailabilities(List<Availability> availabilities) {
		this.availabilities = availabilities;
	}

	public LocalDateTime getHidingTimestamp() {
		return hidingTimestamp;
	}

	public void setHidingTimestamp(LocalDateTime hidingTimestamp) {
		this.hidingTimestamp = hidingTimestamp;
	}
	
	@JsonGetter(value = "hiding_timestamp")
	public String getHidingTimestampJson() {
		return JsonFormatter.parseDateTime(hidingTimestamp);
	}

	@JsonSetter(value = "hiding_timestamp")
	public void setHidingTimestampJson(String date) {
		this.hidingTimestamp = JsonFormatter.parseStringIntoDateTime(date);
	}

	public AccommodationRating getRating() {
		return rating;
	}

	public void setRating(AccommodationRating rating) {
		this.rating = rating;
	}

	@Override
	public String toString() {
		return "Accommodation [id=" + id + ", ownerId=" + ownerId + ", title=" + title + ", description=" + description
				+ ", approvalTimestamp=" + approvalTimestamp + ", hidingTimestamp=" + hidingTimestamp + ", beds=" + beds
				+ ", rooms=" + rooms + ", street=" + street + ", streetNumber=" + streetNumber + ", addressNotes="
				+ addressNotes + ", city=" + city + ", cap=" + cap + ", province=" + province + ", country=" + country
				+ ", coordinates=" + coordinates + ", mainPhotoUrl=" + mainPhotoUrl + ", services=" + services
				+ ", photos=" + photos + ", availabilities=" + availabilities + "]";
	}

	
}
