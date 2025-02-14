package ws.peoplefirst.utumana.exception;

import io.swagger.v3.oas.annotations.media.Schema;

public class InvalidJSONException extends TheJBeansException {
	private static final long serialVersionUID = 2949624079837690014L;

	public InvalidJSONException(String message) {
        super(message);
    }
}
