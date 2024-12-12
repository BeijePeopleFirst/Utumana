package ws.peoplefirst.utumana.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/*  That model uses two primary key, so for that reason we have to create a support Class ("UserAuthorityId"), to handle the id.
*  That id will not be generated automatically, but must be set.
*/

@Entity
@IdClass(UserAuthorityId.class)
@Table(name = "user_authority")
@JsonInclude(Include.NON_NULL)
public class UserAuthority {
	
	@Id
	@Column(name = "user_id")
	private Long userId;
	
	@Id
	@Column(name = "authority_id")
	private Integer authorityId;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public Integer getAuthorityId() {
		return authorityId;
	}

	public void setAuthorityId(Integer authorityId) {
		this.authorityId = authorityId;
	}
	
}
