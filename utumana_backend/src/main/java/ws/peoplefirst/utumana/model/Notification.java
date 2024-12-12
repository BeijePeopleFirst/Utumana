package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "notification")
public class Notification {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "read_timestamp")
	private LocalDateTime readTimestamp;
	
	@Column(name = "on_click_url")
	private String onClickUrl;
	
	@Column(name = "user_id")
	private Long userId;

	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	
	public LocalDateTime getReadTimestamp() {
		return readTimestamp;
	}

	public void setReadTimestamp(LocalDateTime readTimestamp) {
		this.readTimestamp = readTimestamp;
	}
	

	public String getOnClickUrl() {
		return onClickUrl;
	}

	public void setOnClickUrl(String onClickUrl) {
		this.onClickUrl = onClickUrl;
	}
	

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}
}
