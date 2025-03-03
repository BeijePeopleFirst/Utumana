package ws.peoplefirst.utumana.controller;

import io.jsonwebtoken.JweHeader;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.service.ServiceService;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class ServiceControllerTest {

    @InjectMocks
    ServiceController serviceController;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDTO userDTO;

    @Mock
    private ServiceService serviceService;


    /**
     * Reusable methods
     */

    private <T> T getInstance(Class<T> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile creare una nuova istanza di " + clazz, e);
        }
    }

    /**
     * GET - API: /services
     * MTEHOD: getAllServices(...)
     */

    @Test
    void getAllServices() {
        assertDoesNotThrow(() -> serviceController.getAllServices(authentication, List.of(anyLong())));
    }

    @Test
    void getAllServicesKo() {
        assertDoesNotThrow(() -> serviceController.getAllServices(authentication, null));
    }

    /**
     * GET - API: /services/search
     * MTEHOD: searchServicesByTitle(...)
     */

    @Test
    void searchServicesByTitle() {
        assertDoesNotThrow(() -> serviceController.searchServicesByTitle(authentication, anyString()));
    }



}
