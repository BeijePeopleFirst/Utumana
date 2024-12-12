package ws.peoplefirst.utumana.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.model.Notification;
import ws.peoplefirst.utumana.repository.NotificationRepository;

@Service
public class NotificationService {
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	public List<Notification> getAllUserNotifications(Long userId) {
		return notificationRepository.findByUserId(userId);
	}

}
