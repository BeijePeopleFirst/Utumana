package ws.peoplefirst.utumana.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.AuthCredentials;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.security.JwtTokenProvider;
import ws.peoplefirst.utumana.service.RefreshTokenService;
import ws.peoplefirst.utumana.service.UserService;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @InjectMocks
    AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserService userService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private Authentication authentication;

    @Mock
    private User user;

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
     * GET - API: /test
     * MTEHOD: test(...)
     */

    @Test
    void test() {
        when(authentication.getPrincipal()).thenReturn(user);
        assertDoesNotThrow(() -> authController.test(authentication));
    }


    /**
     * GET - API: /testadmin
     * MTEHOD: testAdmin(...)
     */

    @Test
    void testAdmin() {
        assertDoesNotThrow(() -> authController.testAdmin());
    }

    /**
     * POST - API: /signin
     * MTEHOD: signin(...)
     */

    void signin() {
        AuthCredentials mockCredentials = getInstance(AuthCredentials.class);
        HttpServletResponse mockResponse = getInstance(HttpServletResponse.class);
        assertDoesNotThrow(() -> authController.signin(mockCredentials, mockResponse));
    }
}
