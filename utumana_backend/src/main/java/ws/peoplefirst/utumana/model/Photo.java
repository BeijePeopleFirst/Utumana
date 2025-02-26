package ws.peoplefirst.utumana.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "photo")
public class Photo {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "photo_url")
	@JsonProperty(value = "photo_url")
	private String photoUrl;
	
	@Column(name = "photo_order")
	@JsonProperty(value = "photo_order")
	private Integer photoOrder;
	
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
	
	
	public Accommodation getAccommodation() {
		return accommodation;
	}

	public void setAccommodation(Accommodation accommodation) {
		this.accommodation = accommodation;
	}
	

	public String getPhotoUrl() {
		return photoUrl;
	}

	public void setPhotoUrl(String photoUrl) {
		this.photoUrl = photoUrl;
	}
	
	public Integer getPhotoOrder() {
		return photoOrder;
	}

	public void setPhotoOrder(Integer order) {
		this.photoOrder = order;
	}

	@Override
	public int hashCode() {
		return Objects.hash(photoUrl);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Photo other = (Photo) obj;
		return Objects.equals(photoUrl, other.photoUrl);
	}

	@Override
	public String toString() {
		return "Photo [id=" + id + ", photoUrl=" + photoUrl + ", order=" + photoOrder + ",accommodation=" + accommodation.toString() + "]";
	}	
}
