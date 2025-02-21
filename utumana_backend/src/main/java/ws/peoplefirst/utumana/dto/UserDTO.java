package ws.peoplefirst.utumana.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Data Transfer Object for User information")
public class UserDTO {
	
	@Schema(description = "Unique identifier of the user", example = "1")
	private final Long id;
	
	@Schema(description = "User's first name", example = "John")
	private final String name;
	
	@Schema(description = "User's last name", example = "Doe")
	private final String surname;

	@Schema(description = "User's email address",  example = "john.doe@example.com", pattern = "^[A-Za-z0-9+_.-]+@(.+)$")
	private final String email;
	
	public UserDTO(Long id, String name, String surname, String email) {
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.email = email;
	}
	
	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getSurname() {
		return surname;
	}

	
	public String getEmail() {
		return email;
	}

	@Override
	public String toString() {
		return "UserDTO [id=" + id + ", name=" + name + ", surname=" + surname + ", email=" + email + "]";
	}
	
	
}
