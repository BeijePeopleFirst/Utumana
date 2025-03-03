package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.service.NotificationService;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class NotificationControllerTest {

    @InjectMocks
    private NotificationController notificationController;
    @Mock
    private Authentication authentication;
    @Mock
    private NotificationService notificationService;
    @Mock
    private UserDTO userDTO;


    /**
     * GET - API: /notifications
     * MTEHOD: getAllUserNotifications(...)
     */

    @Test
    void getAllUserNotifications() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> notificationController.getAllUserNotifications(authentication));

    }
}
