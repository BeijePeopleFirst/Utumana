package ws.peoplefirst.utumana.dto;

public class UserDTO {
	
	private final Long id;
	
	private final String name;
	
	private final String surname;
	
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
