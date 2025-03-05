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
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@Entity
@Table(name = "accommodation_draft")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(name = "AccommodationDraft", description = "Represents a draft of an accommodation")
public class AccommodationDraft {
    @Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "Unique identifier of the accommodation draft", example = "1")
    private Long id;

	@JsonProperty(value = "owner_id")
	@Column(name = "owner_id")
	@Schema(description = "ID of the owner of the accommodation draft", example = "123")
    private Long ownerId;

	@Column(name = "title")
	@Schema(description = "Title of the accommodation draft", example = "Cozy Apartment in the City")
    private String title;

	@Column(name = "description")
	@Schema(description = "Description of the accommodation draft", example = "A beautiful apartment located in the heart of the city.")
	private String description;

	@Column(name = "beds")
	@Schema(description = "Number of beds in the accommodation draft", example = "2")
    private Integer beds;

	@Column(name = "rooms")
	@Schema(description = "Number of rooms in the accommodation draft", example = "3")
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
	@Schema(description = "City of the accommodation draft", example = "New York")
	private String city;

	@Column(name = "cap")
	@Schema(description = "Postal code of the accommodation draft", example = "10001")
    private String cap;

	@Column(name = "province")
	@Schema(description = "Province of the accommodation draft", example = "NY")
    private String province;

	@Column(name = "country")
	@Schema(description = "Country of the accommodation draft", example = "USA")
    private String country;

	@Column(name = "coordinates")
	@Schema(description = "Geographical coordinates of the accommodation draft", example = "40.7128,-74.0060")
	private String coordinates;

	@JsonProperty(value = "main_photo_url")
	@Column(name = "main_photo_url")
	@Schema(description = "URL of the main photo of the accommodation draft", example = "https://example.com/photo.jpg")
	private String mainPhotoUrl;

    @JsonIgnore
	@Column(name = "last_modified_timestamp")
	@Schema(description = "Timestamp of the last modification of the accommodation draft", example = "2024-01-01T12:00:00")
	private LocalDateTime lastModifiedTimestamp;


	@ManyToMany(fetch = FetchType.EAGER)
	@OrderColumn(name="service_order")
	@JoinTable(name = "service_availability_draft", joinColumns = {
            @JoinColumn(name = "accommodation_draft_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) }, inverseJoinColumns = {
                    @JoinColumn(name = "service_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) })
	@Schema(description = "Set of services available in the accommodation draft")
	private Set<Service> services;

	@OneToMany(mappedBy = "accommodationDraft", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderColumn(name = "photo_order")
	@Schema(description = "List of photos of the accommodation draft")
	private List<PhotoDraft> photos;


	@OneToMany(mappedBy = "accommodationDraft", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderBy("startDate")
	@Schema(description = "List of availabilities of the accommodation draft")
    private List<AvailabilityDraft> availabilities;

    @OneToMany(mappedBy = "accommodationDraft", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@OrderBy("checkIn")
	@Schema(description = "List of unavailabilities of the accommodation draft")
    private List<UnavailabilityDraft> unavailabilities;

    public AccommodationDraft() {
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public Long getOwnerId() {
        return ownerId;
    }
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public Integer getBeds() {
        return beds;
    }
    public void setBeds(Integer beds) {
        this.beds = beds;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public Integer getRooms() {
        return rooms;
    }
    public void setRooms(Integer rooms) {
        this.rooms = rooms;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getStreetNumber() {
        return streetNumber;
    }
    public void setStreetNumber(String streetNumber) {
        this.streetNumber = streetNumber;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getAddressNotes() {
        return addressNotes;
    }
    public void setAddressNotes(String addressNotes) {
        this.addressNotes = addressNotes;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getCap() {
        return cap;
    }
    public void setCap(String cap) {
        this.cap = cap;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getProvince() {
        return province;
    }
    public void setProvince(String province) {
        this.province = province;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getCoordinates() {
        return coordinates;
    }
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public String getMainPhotoUrl() {
        return mainPhotoUrl;
    }
    public void setMainPhotoUrl(String mainPhotoUrl) {
        this.mainPhotoUrl = mainPhotoUrl;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public LocalDateTime getLastModifiedTimestamp() {
        return lastModifiedTimestamp;
    }

    public void setLastModifiedTimestamp(LocalDateTime lastModifiedTimestamp) {
        this.lastModifiedTimestamp = lastModifiedTimestamp;
    }

    @JsonGetter(value = "last_modified_timestamp")
    public String getLastModifiedTimestampJson() {
        return JsonFormatter.parseDateTime(lastModifiedTimestamp);
    }

    @JsonSetter(value = "last_modified_timestamp")
    public void setLastModifiedTimestampJson(String date) {
        this.lastModifiedTimestamp = JsonFormatter.parseStringIntoDateTime(date);
    }

    public Set<Service> getServices() {
        return services;
    }
    public void setServices(Set<Service> services) {
        this.services = services;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public List<PhotoDraft> getPhotos() {
        return photos;
    }
    public void setPhotos(List<PhotoDraft> photos) {
        this.photos = photos;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public List<AvailabilityDraft> getAvailabilities() {
        return availabilities;
    }
    public void setAvailabilities(List<AvailabilityDraft> availabilities) {
        this.availabilities = availabilities;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    public List<UnavailabilityDraft> getUnavailabilities() {
        return unavailabilities;
    }
    public void setUnavailabilities(List<UnavailabilityDraft> unavailabilities) {
        this.unavailabilities = unavailabilities;
        lastModifiedTimestamp = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "AccommodationDraft [id=" + id + ", ownerId=" + ownerId + ", title=" + title + ", description=" + description
                + ", beds=" + beds + ", rooms=" + rooms + ", street=" + street + ", streetNumber=" + streetNumber
                + ", addressNotes=" + addressNotes + ", city=" + city + ", cap=" + cap + ", province=" + province
                + ", country=" + country + ", coordinates=" + coordinates + ", mainPhotoUrl=" + mainPhotoUrl
                + ", lastModifiedTimestamp=" + lastModifiedTimestamp + ", services="
                + services + ", photos=" + photos + ", availabilities=" + availabilities + "]";
    }
}
