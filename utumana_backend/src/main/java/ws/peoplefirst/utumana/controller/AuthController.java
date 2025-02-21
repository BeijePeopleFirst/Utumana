package ws.peoplefirst.utumana.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import ws.peoplefirst.utumana.dto.AuthCredentials;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ErrorMessage;
import ws.peoplefirst.utumana.model.RefreshToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.security.JwtTokenProvider;
import ws.peoplefirst.utumana.service.RefreshTokenService;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;


@RestController
@RequestMapping(value="/api")
@Tag(name = "Authentication", description = "Endpoints for user authentication and authorization")
public class AuthController {

	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private UserService userService;

	@Autowired
	private RefreshTokenService refreshTokenService;
	
	@Operation(summary = "Test endpoint for USER role")
	@PreAuthorize("hasAuthority('USER')")
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public @ResponseBody String test(Authentication auth) {

		System.out.println("GET /test");
		log.debug("GET /test");
		
		User user = (User) auth.getPrincipal();
		
		System.out.println("user : " + user.getEmail() + " " + user.getId());

		return "OK!";
	}

	@Operation(summary = "Test endpoint for ADMIN role")
	@PreAuthorize("hasAuthority('ADMIN')")
	@RequestMapping(value = "/testadmin", method = RequestMethod.GET)
	public @ResponseBody String testAdmin() throws UnknownHostException {

		System.out.println("GET /testadmin");
		log.debug("GET /testadmin");

		return "OK!";
	}

    @Operation(summary = "User sign-in", description = "Authenticates a user and returns a JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("permitAll()")
	@PostMapping("/signin")
	public ResponseEntity<Map<String, Object>> signin(@RequestBody AuthCredentials credentials, HttpServletResponse response) throws RuntimeException {
		log.debug("POST /signin");
		System.out.println(credentials.getEmail() + " " + credentials.getPassword());

		try {
			String email = credentials.getEmail();
			User user = userService.loadUserByUsername(email);
			//authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, credentials.getPassword()));
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(email, credentials.getPassword());
			log.error(usernamePasswordAuthenticationToken.getCredentials().toString());
			authenticationManager.authenticate(usernamePasswordAuthenticationToken);		
 
			String token = jwtTokenProvider.createToken(email, user.getAuthorityList());

//			Cookie cookie = new Cookie("token", token);
//			cookie.setMaxAge(86400); //one-day
//			cookie.setHttpOnly(true);
//			response.addCookie(cookie);
			
			RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

			Map<String, Object> res = new HashMap<>();
			res.put("email", email);
			res.put("permission", user.getAuthorityList());
			res.put("token", token);
			res.put("refresh_token", refreshToken.getRefreshToken());
			res.put("id", user.getId());

			return ok(res);
		} catch (UsernameNotFoundException e) {
			e.printStackTrace();
			throw new BadCredentialsException("Email not found");
		} catch (AuthenticationException e) {
			e.printStackTrace();
			throw new BadCredentialsException("Invalid password supplied");
		} catch (RuntimeException e) {
			throw e;
		}
	}
	
	//used into creation of users and accept houses as on load fetch
    @Operation(summary = "Check if user is an admin")
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/testIsAdmin")
	public ResponseEntity<Map<String, Object>> isAdmin(Authentication auth) {
		Map<String, Object> res = new HashMap<>();
		
		if(AuthorizationUtility.hasAdminRole(auth)) {
			res.put("isAdmin", true);
		} else {
			res.put("isAdmin", false);
		}	
		return ok(res);
	}
	
    @Operation(summary = "Check if user is an admin or the owner")
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping("/isAdmin")
	public ResponseEntity<Map<String, Object>> isAdminOrOwner(Authentication auth, @PathVariable Long ownerId) {
		Map<String, Object> res = new HashMap<>();
		
		UserDTO user = (UserDTO) auth.getPrincipal();
		
		if(AuthorizationUtility.hasAdminRole(auth)) {
			res.put("isAdmin", true);
		} else {
			res.put("isAdmin", false);
		}
		
		if(user.getId() == ownerId) {
			res.put("isOwner", true);
		} else {
			res.put("isOwner", false);
		}
		
		return ok(res);
	}
	
    @Operation(summary = "Refresh JWT token")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid refresh token",content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("permitAll()")
	@PostMapping("/refresh_token")
	public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody RefreshToken refreshToken, HttpServletResponse response){
		System.out.println("POST /refresh_token");
		System.out.println("Refresh token = " + refreshToken.getRefreshToken());
		try {
			return this.signin(refreshTokenService.getAuthenticationFromRefreshToken(refreshToken.getRefreshToken()), response);
		} catch (RuntimeException e) {
			throw e;
		}
	}

}
