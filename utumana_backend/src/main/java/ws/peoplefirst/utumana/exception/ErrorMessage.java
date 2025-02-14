package ws.peoplefirst.utumana.exception;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description="Error Message")
public class ErrorMessage {
	
	@Schema(description = "time", example = "00:00:00")
	private String time;
	
	@Schema(description = "status", example = "400")
	private String status;
	
	@Schema(description = "message", example = "Error Message")
	private String message;

	public String getTime() {
		return time;
	}

	public void setTime(LocalDateTime time) {
		this.time = time.toString();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = Integer.toString(status);
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}