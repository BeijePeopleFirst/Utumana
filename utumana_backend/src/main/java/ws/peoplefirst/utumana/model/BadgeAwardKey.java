package ws.peoplefirst.utumana.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class BadgeAwardKey implements Serializable{
	
	private static final long serialVersionUID = 1L;

	@Column(name = "badge_id")
	private Long badgeId;
	
	@Column(name = "user_id")
	private Long userId;
	
	
	public BadgeAwardKey(Long badgeId, Long userId) {
		super();
		this.badgeId = badgeId;
		this.userId = userId;
	}
	
	public BadgeAwardKey() {
		super();
	}

	public Long getBadgeId() {
		return badgeId;
	}

	public void setBadgeId(Long badgeId) {
		this.badgeId = badgeId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Override
	public int hashCode() {
		return Objects.hash(badgeId, userId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BadgeAwardKey other = (BadgeAwardKey) obj;
		return Objects.equals(badgeId, other.badgeId) && Objects.equals(userId, other.userId);
	}
	
}
