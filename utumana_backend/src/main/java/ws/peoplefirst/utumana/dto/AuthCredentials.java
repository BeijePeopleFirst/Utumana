package ws.peoplefirst.utumana.dto;

import java.io.Serializable;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authentication credentials for user login")
public class AuthCredentials implements Serializable {
	
	private static final long serialVersionUID = -3519905797046907320L;
	
	@Schema(description = "User's email address for authentication", example = "user@example.com", pattern = "^[A-Za-z0-9+_.-]+@(.+)$")
	private String email;
	
    @Schema(description = "User's password", example = "password123", format = "password")
    private String password;
    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
