package ws.peoplefirst.utumana.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.utility.Constants;



@Entity
@Table(name = "user")
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "User representation")
public class User implements Serializable, UserDetails {
	
	private static final long serialVersionUID = -6221103912480752901L;

	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	@Schema(description = "Unique id of the user", example = "1")
	private Long id;
	
	@Column(name = "name")
	@Schema(description = "User name", example = "Mario")
	private String name;
	
	@Column(name = "surname")
	@Schema(description = "User surname", example = "Rossi")
	private String surname;
	
	@Column(name = "email")
	@Schema(description = "User email", example = "mario.rossi@example.com")
	private String email;
	
	@Column(name = "password")
	@Schema(description = "User password", example = "password123")
	private String password;
	
	@Column(name = "is_admin")
	@Schema(description = "Keep the information about the admin role", example = "false")
	private Boolean isAdmin;
	
	@Column(name = "bio")
	@Schema(description = "User biography", example = "I like travelling")
	private String bio;
	
	@Column(name = "profile_picture_url")
	@Schema(description = "User profile picture url", example = "https://example.com/profile.jpg")
	private String profilePictureUrl;
	
	@Column(name = "rating")
	@Schema(description = "Avarage rating of all user accommodations", example = "4.5")
	private Double rating;
	
	@Column(name = "archived_timestamp")
	@JsonProperty(value = "archived_timestamp" )
	@Schema(description = "Archived timestamp", example = "2024-05-01T10:15:30")
	private LocalDateTime archivedTimestamp;
	
//	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
//	@JoinTable(name = "badge_award", joinColumns = {
//            @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, updatable = false) }, inverseJoinColumns = {
//                    @JoinColumn(name = "badge_id", referencedColumnName = "id", nullable = false, updatable = false) })
//	@OrderBy("score DESC")
//	private List<Badge> badges;
	
	@OneToMany(mappedBy = "user")
	@OrderBy("awardDate DESC")
	//@Embedded
	@Schema(description = "Badges the user won")
	private List<BadgeAward> badges;
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
	@JoinTable(name = "favourite", joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) }, inverseJoinColumns = {
                    @JoinColumn(name = "accommodation_id", referencedColumnName = "id", insertable = true, nullable = false, updatable = true) })
	@Schema(description = "List of favorite accommodations")
	private List<Accommodation> favourites;
	
	@Transient
	@Schema(description = "Review list of the user")
	private List<ReviewDTO> reviews;
	
	
//	public List<Badge> getBadges() {
//		return badges;
//	}
//
//	public void setBadges(List<Badge> badges) {
//		this.badges = badges;
//	}
	
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	@JsonIgnore
	public String getPassword() {
		return password;
	}
	
	@JsonSetter
	public void setPassword(String password) {
		this.password = password;
	}
	

	public Boolean getIsAdmin() {
		return isAdmin;
	}

	public void setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	
	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	
	public String getProfilePictureUrl() {
		return profilePictureUrl;
	}

	public void setProfilePictureUrl(String profilePictureUrl) {
		this.profilePictureUrl = profilePictureUrl;
	}

	
	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}
	
	public List<Accommodation> getFavourites() {
		if(!Hibernate.isInitialized(favourites))
			return null;
		return favourites;
	}

	public void setFavourites(List<Accommodation> favourites) {
		this.favourites = favourites;
	}
	

	public LocalDateTime getArchivedTimestamp() {
		return archivedTimestamp;
	}

	@JsonGetter(value = "archived_timestamp")
	public String getArchivedTimestampAsString() {
		return archivedTimestamp != null ? Constants.DATE_TIME_FORMATTER.format(archivedTimestamp) : null;
	}

	public void setArchivedTimestamp(LocalDateTime archivedTimestamp) {
		this.archivedTimestamp = archivedTimestamp;
	}
	
	@JsonSetter(value = "archived_timestamp")
	public void setArchivedTimestamp(String archivedTimestamp) {
		this.archivedTimestamp = archivedTimestamp != null ? LocalDateTime.parse(archivedTimestamp, Constants.DATE_TIME_FORMATTER) : null;	
	}

	public List<ReviewDTO> getReviews() {
		return reviews;
	}

	public void setReviews(List<ReviewDTO> reviews) {
		this.reviews = reviews;
	}
	
	public List<BadgeAward> getBadges() {
		if(!Hibernate.isInitialized(badges))
			return null;
		return badges;
	}

	public void setBadges(List<BadgeAward> badges) {
		this.badges = badges;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", surname=" + surname + ", email=" + email + ", isAdmin="
				+ isAdmin + ", bio=" + bio + ", profilePictureUrl=" + profilePictureUrl + ", rating=" + rating
				+ ", badges=" + getBadges() 
				+ ", favourites=" + getFavourites() 
				+ ", reviews=" + reviews + "]";
	}

	
	// SPRING SECURITY
	@ManyToMany(cascade = CascadeType.PERSIST)//fetch = FetchType.EAGER, 
	@LazyCollection(LazyCollectionOption.FALSE)
	@JoinTable(name = "user_authority",
		joinColumns = {	@JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, nullable = false, updatable = false) },
		inverseJoinColumns = { @JoinColumn(name = "authority_id", referencedColumnName = "id", insertable = false, nullable = false, updatable = false) }
	)
	@OrderBy(value = "id")
	@JsonIgnore
	private List<Authority> authorityEntity = new ArrayList<>();

	private List<String> createStringAuth() {
		List<String> list = new ArrayList<>();
		for (Authority r : authorityEntity)
			list.add(r.getAuthority());
		return list;
	}

	@JsonIgnore
	public List<String> getAuthorityList() {
		return createStringAuth();
	}

	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return createStringAuth().stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
	}

	// Serializable methods
	@JsonIgnore
	@Override
	public String getUsername() {
		return this.email;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return true;
	}
}
