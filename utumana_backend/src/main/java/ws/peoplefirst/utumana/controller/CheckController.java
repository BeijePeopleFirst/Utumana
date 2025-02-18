package ws.peoplefirst.utumana.controller;

import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Check", description = "Endpoints to check if server is up and running correctly")
public class CheckController {
	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Operation(summary = "Check if server is up and running correctly", 
			description = "Check if server is up and running correctly. This endpoint doesn't need authorization.", tags = { "Check" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Server is up and running correctly.", content = @Content(schema = @Schema(implementation = String.class), examples = @ExampleObject(value = "{ \"Utumana PROJECT\" }"))),
			@ApiResponse(responseCode = "500", description = "Server is down", content = @Content),
    })
	@PreAuthorize("permitAll()")
	@RequestMapping(value = "/check", method = RequestMethod.GET)
	public @ResponseBody String check() throws UnknownHostException {

		log.debug("GET /check");	
		
		return "Utumana PROJECT";
	}
	
}
