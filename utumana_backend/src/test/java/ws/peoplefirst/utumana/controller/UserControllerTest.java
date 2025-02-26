package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.model.BadgeAward;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;


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

    private MockedStatic<AuthorizationUtility> authorizationUtilityMock;

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

    @BeforeEach
    void setUp() {
        authorizationUtilityMock = Mockito.mockStatic(AuthorizationUtility.class);
    }

    @AfterEach
    void tearDown() {
        if (authorizationUtilityMock != null) {
            authorizationUtilityMock.close();
        }
    }

    /**
     * GET - API: /users
     * MTEHOD: getUser(...)
     */

    @Test
    void getUsersDTO(){
        assertDoesNotThrow(() -> userController.getUsersDTO());
    }

    /**
     * GET - API: /users_full_obj
     * MTEHOD: getAllUsersFullObj(...)
     */

    @Test
    void getUsersgetAllUsersFullObjDTO(){
        assertDoesNotThrow(() -> userController.getAllUsersFullObj(authentication));
    }

    /**
     * GET - API: /user/{id}
     * MTEHOD: getUser(...)
     */

    @Test
    void getUserKo(){
//        authorizationUtilityMock = mockStatic(AuthorizationUtility.class);
        authorizationUtilityMock.when(() -> AuthorizationUtility.checkIsAdminOrMe(authentication, 1L))
                .thenAnswer(invocation -> null);
        when(userService.getUserForProfile(1L)).thenThrow(new IdNotFoundException("User not found"));
        assertThrows(IdNotFoundException.class, () -> userController.getUser(1L, authentication));
    }

    /**
     * POST - API: /user
     * MTEHOD: insertUser(...)
     */

    @Test
    void insertUser(){
        assertDoesNotThrow(() -> userController.insertUser(getInstance(User.class)));
    }

    /**
     * POST - API: /change_password
     * MTEHOD: modifyPassword(...)
     */

    @Test
    void modifyPasswordSuccess(){
        when(userService.getUserByEmail(anyString())).thenReturn(getInstance(User.class));
        when(userService.isValidPassword(anyString())).thenReturn(true);
        when(userService.saveUser(any(User.class))).thenReturn(true);
        assertDoesNotThrow(() -> userController.modifyPassword(anyMap()));
    }

    @Test
    void modifyPasswordKoDbSave(){
        when(userService.getUserByEmail(anyString())).thenReturn(getInstance(User.class));
        when(userService.isValidPassword(anyString())).thenReturn(true);
        when(userService.saveUser(any(User.class))).thenReturn(false);
        assertThrows(DBException.class, () -> userController.modifyPassword(anyMap()));
    }

    @Test
    void modifyPasswordKoIdNotFound(){
        when(userService.getUserByEmail(anyString())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> userController.modifyPassword(anyMap()));
    }

    /**
     * POST - API: /user/badges/{userId}
     * MTEHOD: getAllUserBadges(...)
     */

    @Test
     void getAllUserBadges(){
        when(userService.getAllUserBadges(anyLong())).thenReturn(List.of(getInstance(BadgeAward.class)));
        assertDoesNotThrow(() -> userController.getAllUserBadges(anyLong()));
    }

    /**
     * PATCH - API: /user}
     * MTEHOD: modifyUser(...)
     */

    @Test
    void modifyUserSuccess(){
        Map<String , Object> mockMap = new HashMap<>();
        mockMap.put("id", 1L);
        mockMap.put("name", "pollo");
        mockMap.put("surname", "alberto");
        mockMap.put("email", "alberto@pollo.it");
        mockMap.put("password", "1234");
        mockMap.put("bio", "hello my name is Pollo");
        mockMap.put("profile_picture", "questa è un immagine");
        mockMap.put("archived_timestamp", "boh");


//        authorizationUtilityMock = mockStatic(AuthorizationUtility.class);

        authorizationUtilityMock.when(() -> AuthorizationUtility.checkIsAdminOrMe(authentication, 1L))
                .thenAnswer(invocation -> null);
        authorizationUtilityMock.when(() -> AuthorizationUtility.hasAdminRole(authentication))
                .thenAnswer(invocation -> true);
        when(userService.isValidName(anyString())).thenReturn(true);
        when(userService.isValidSurname(anyString())).thenReturn(true);
        when(userService.isValidEmail(anyString())).thenReturn(true);
        when(userService.isEmailUnique(anyString(), anyLong())).thenReturn(true);
        when(userService.isValidPassword(anyString())).thenReturn(true);
        when(userService.getUserById(anyLong())).thenReturn(getInstance(User.class));


        assertDoesNotThrow(() -> userController.modifyUser(mockMap, authentication));
       // assertThrows(ForbiddenException.class, () -> userController.modifyUser(mockMap, authentication));
    }

}
