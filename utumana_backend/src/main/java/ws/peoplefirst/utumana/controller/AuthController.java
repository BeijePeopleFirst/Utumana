package ws.peoplefirst.utumana.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ws.peoplefirst.utumana.dto.AuthCredentials;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.model.RefreshToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.security.JwtTokenProvider;
import ws.peoplefirst.utumana.service.RefreshTokenService;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;


@RestController
@RequestMapping(value="/api")
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


	

	@PreAuthorize("hasAuthority('USER')")
	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public @ResponseBody String test(Authentication auth) {

		System.out.println("GET /test");
		log.debug("GET /test");
		
		User user = (User) auth.getPrincipal();
		
		System.out.println("user : " + user.getEmail() + " " + user.getId());

		return "OK!";
	}

	@PreAuthorize("hasAuthority('ADMIN')")
	@RequestMapping(value = "/testadmin", method = RequestMethod.GET)
	public @ResponseBody String testAdmin() throws UnknownHostException {

		System.out.println("GET /testadmin");
		log.debug("GET /testadmin");

		return "OK!";
	}

	@PreAuthorize("permitAll()")
	@PostMapping("/signin")
	public ResponseEntity<Map<String, Object>> signin(@RequestBody AuthCredentials credentials, HttpServletResponse response) throws RuntimeException {
		System.out.println("POST /signin");
		log.debug("POST /signin");
		System.out.println(credentials.getEmail() + "please " + credentials.getPassword());

		try {
			String email = credentials.getEmail();
			//authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, credentials.getPassword()));
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(email, credentials.getPassword());
			log.error(usernamePasswordAuthenticationToken.getCredentials().toString());
			authenticationManager.authenticate(usernamePasswordAuthenticationToken);
			User user = userService.loadUserByUsername(email);
 
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
		} catch (AuthenticationException e) {
			e.printStackTrace();
			throw new BadCredentialsException("Invalid email/password supplied");
		} catch (RuntimeException e) {
			throw e;
		}
	}
	
	//used into creation of users and accept houses as on load fetch
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
