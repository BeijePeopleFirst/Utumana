package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.service.UserService;


@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;
    @Mock
    private Authentication authentication;

    @Mock
    private UserDTO userDTO;

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

    private UserDTO getUnautorizedUser() {
        return new UserDTO(1L, "", "", "");
    }

    /**
     * GET - API: /user/{id}
     * MTEHOD: getUser(...)
     */

    @Test
    void getUserKO(){
    }

    @Test
    void getUser(){
    }

}
