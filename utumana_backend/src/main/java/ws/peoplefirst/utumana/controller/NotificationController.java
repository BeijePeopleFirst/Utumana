package ws.peoplefirst.utumana.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ws.peoplefirst.utumana.model.Notification;
import ws.peoplefirst.utumana.service.NotificationService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

@RestController
@RequestMapping(value = "/api")
@Tag(name = "Notifications", description = "Endpoints for notifications operations")
public class NotificationController {
	@Autowired
	private NotificationService notificationService;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Operation(summary = "Get all the notifications received by the user", 
			description = "Get all the notifications received by the current user.", tags = { "Notifications" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications returned successfully. If the user with given userId doesn't exist, an empty list is returned.",
            	content = @Content(array = @ArraySchema(schema = @Schema(implementation = Notification.class)))),
			@ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/notifications")
	public List<Notification> getAllUserNotifications(Authentication auth){
		log.debug("GET /notifications");
		
		return notificationService.getAllUserNotifications(AuthorizationUtility.getUserFromAuthentication(auth).getId());
	}
	
}
