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

import ws.peoplefirst.utumana.model.Notification;
import ws.peoplefirst.utumana.service.NotificationService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

@RestController
@RequestMapping(value = "/api")
public class NotificationController {
	@Autowired
	private NotificationService notificationService;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/notifications")
	public List<Notification> getAllUserNotifications(Authentication auth){
		log.debug("GET /notifications");
		
		return notificationService.getAllUserNotifications(AuthorizationUtility.getUserFromAuthentication(auth).getId());
	}
	
}
