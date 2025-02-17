package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.AuthCredentials;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.model.RefreshToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.security.JwtTokenProvider;
import ws.peoplefirst.utumana.service.RefreshTokenService;
import ws.peoplefirst.utumana.service.UserService;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
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
     * MTEHOD: signIn(...)
     */

    @Test
    void signIn() {
        AuthCredentials mockCredentials = getInstance(AuthCredentials.class);
        mockCredentials.setEmail("<EMAIL>");
        mockCredentials.setPassword("<PASSWORD>");
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userService.loadUserByUsername(anyString())).thenReturn(getInstance(User.class));
        when(jwtTokenProvider.createToken(anyString(), anyList())).thenReturn("<TOKEN>");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(getInstance(RefreshToken.class));
        assertDoesNotThrow(() -> authController.signin(mockCredentials, null));
    }

    @Test
    void signInKoAuth() {
        AuthCredentials mockCredentials = getInstance(AuthCredentials.class);
        mockCredentials.setEmail("<EMAIL>");
        mockCredentials.setPassword("<PASSWORD>");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Credenziali non valide"));
        assertThrows(BadCredentialsException.class, () -> authController.signin(mockCredentials, null));
    }

    /**
     * GET - API: /testIsAdmin
     * MTEHOD: isAdmin(...)
     */

    @Test
    void isNotAdmin() {
        assertDoesNotThrow(() -> authController.isAdmin(authentication));
    }

    /**
     * GET - API: /isAdmin
     * MTEHOD: isAdminOrOwner(...)
     */

    @Test
    void isAdminOrOwner() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> authController.isAdminOrOwner(authentication, 0L));
    }

    /**
     * POST - API: /refresh_token
     * MTEHOD: refreshToken(...)
     */

    @Test
    void refreshToken() {
        RefreshToken mockRefreshToken = getInstance(RefreshToken.class);
        mockRefreshToken.setRefreshToken("<REFRESH_TOKEN>");
        AuthCredentials mockCredentials = getInstance(AuthCredentials.class);
        mockCredentials.setEmail("<EMAIL>");
        mockCredentials.setPassword("<PASSWORD>");
        when(refreshTokenService.getAuthenticationFromRefreshToken(any())).thenReturn(mockCredentials);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userService.loadUserByUsername(anyString())).thenReturn(getInstance(User.class));
        when(jwtTokenProvider.createToken(anyString(), anyList())).thenReturn("<TOKEN>");
        when(refreshTokenService.createRefreshToken(any())).thenReturn(getInstance(RefreshToken.class));
        assertDoesNotThrow(() -> authController.refreshToken(mockRefreshToken, null));
    }
}
