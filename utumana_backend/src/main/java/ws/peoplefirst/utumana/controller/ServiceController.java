package ws.peoplefirst.utumana.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.models.media.MediaType;
import ws.peoplefirst.utumana.exception.ErrorMessage;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Service;
import ws.peoplefirst.utumana.service.ServiceService;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/api")
@Tag(name = "Service", description = "Service management APIs")
public class ServiceController {
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private ServiceService serviceService;
	
	@Operation(
	        summary = "Get all services or services by IDs",
	        description = "Retrieves either all services or specific services by their IDs if provided"
	    )
	    @ApiResponses(value = {
	        @ApiResponse(responseCode = "200", description = "Services retrieved successfully", content = @Content),
	        @ApiResponse(responseCode = "403", description = "Unauthorized access - requires USER role", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class))),
	        @ApiResponse(responseCode = "500",description = "Internal server error", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class)))
			})
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/services")
	public Set<Service> getAllServices(Authentication auth,
			@RequestParam(required = false) List<Long> ids){
		if(ids == null || ids.isEmpty()) {
			return serviceService.getAllServices();
		} else {
			return serviceService.getServicesByIds(ids);
		}
	}
	
	@Operation(summary = "Search services by title", description = "Searches for services using a title search string")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Search completed successfully", content = @Content), 
			@ApiResponse(responseCode = "400", description = "Invalid title encoding", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class))), 
			@ApiResponse(responseCode = "403", description = "Unauthorized access - requires USER role", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class))),
			@ApiResponse(responseCode = "500", description = "Internal server error", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class)))})
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/services/search")
	public List<Service> searchServicesByTitle(Authentication auth,
			@RequestParam String title){
		try {
			title = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
		} catch (UnsupportedEncodingException e) {
			throw new TheJBeansException("Error decoding title string from search URL: " + title);
		}
		
		return serviceService.searchByTitle(title);
	}
}
