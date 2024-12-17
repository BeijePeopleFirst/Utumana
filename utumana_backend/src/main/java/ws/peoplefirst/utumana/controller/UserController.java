package ws.peoplefirst.utumana.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.BadgeAward;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;


@RestController
@RequestMapping(value = "/api")
public class UserController {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Value("${photoPrefixPath.path}")
	private String destinationPathPhotoPrefix;
	
	@Autowired
	private UserService userService;
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value = "/users")
	public List<UserDTO> getUsersDTO(){
		log.debug("GET /users");
		
		return userService.getUsersDTO();
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value = "/users_full_obj")
	public List<User> getAllUsersFullObj(Authentication auth){
		return userService.findAllUsers();
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/user/{id}")
	public User getUser(@PathVariable Long id, Authentication auth){
		//im looking for mine profile
		log.debug("GET /user/" + id);
		log.trace("Checking if the user that made this request is an admin or is requesting info about their own account...");
		AuthorizationUtility.checkIsAdminOrMe(auth, id);
		log.trace("Check OK");
		
		try {
			return userService.getUserForProfile(id);
		} catch(RuntimeException e) {
			log.error("Could not get user for profile with id " + id);
			throw new IdNotFoundException("User with id " + id + " not found.");
		}
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@PostMapping(value = "/user")
	public User insertUser(@RequestBody User user){
		log.debug("POST /user");
		log.debug("User to insert: " + user);		
		
		return userService.insertUser(user);
	}
	
	
	@PreAuthorize("permitAll()")
	@PatchMapping(value = "/change_password")
	public User modifyPassword(@RequestBody Map<String, Object> body) {
		String email= ""+body.get("email");
		
		User user = userService.getUserByEmail(email);
		if(user!=null) {			
			String newPassword= ""+body.get("password");
			
			if(newPassword == null || !(newPassword instanceof String)) throw new InvalidJSONException("Password must be a not null String");
			if(!userService.isValidPassword((String) newPassword)) throw new InvalidJSONException("Password not valid");
			user.setPassword((String) newPassword);
			log.trace("Set new password");
			
			if(userService.saveUser(user)) {
				return user;
			}else {
				throw new DBException("cannot change current user");
			}
		}else {
			throw new IdNotFoundException("user with email "+email+" not found");
		}
				
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/user")
	public User modifyUser(@RequestBody Map<String, Object> body, Authentication auth) //@PathVariable Long id, 
	{	
		log.debug("PATCH /user");
		
//		if(!id.equals(Long.valueOf((String) body.get("id")))) throw new InvalidJSONException("User id in JSON not equal to user id in path");
		
		Long id=Long.valueOf("" + body.get("id"));
		
		log.trace("Checking if the user that made this request is an admin or is editing their own info...");
		AuthorizationUtility.checkIsAdminOrMe(auth, id);
		log.trace("Check OK");
		
		User user = userService.getUserById(id);
		log.debug("User pre: " + user);
		
		body.forEach((key, value) -> {			
			switch(key) {
				case "id": 
					break;
				case "name" : 
					System.out.println("authorities" + user.getAuthorityList() + user.getAuthorityList().contains("ADMIN"));
					if(AuthorizationUtility.hasAdminRole(auth)) {
						if(value == null || !(value instanceof String)) throw new InvalidJSONException("Name must be a not null String");	
						if(!userService.isValidName((String) value)) throw new InvalidJSONException("Invalid name");
						user.setName((String) value);
						log.trace("Set new name: " + (String) value);
					} else {
						throw new ForbiddenException("Forbidden: Not allowed to modify name");
					}
					break;
					
				case "surname" :
					if(AuthorizationUtility.hasAdminRole(auth)) {
						if(value == null || !(value instanceof String)) throw new InvalidJSONException("Surname must be a not null String");
						if(!userService.isValidSurname((String) value)) throw new InvalidJSONException("Invalid surname");
						user.setSurname((String) value);
						log.trace("Set new surname: " + (String) value);
					} else {
						throw new ForbiddenException("Forbidden: Not allowed to modify surname");
					}
					break;
					
				case "email" :
					if(AuthorizationUtility.hasAdminRole(auth)) {
						if(value == null || !(value instanceof String)) throw new InvalidJSONException("Email must be a not null String");
						if(!userService.isValidEmail((String) value)) throw new InvalidJSONException("Email not valid");
						if(!userService.isEmailUnique((String) value, id))	throw new DBException("Email " + value + " already exists in db");
						user.setEmail((String) value);
						log.trace("Set new email: " + (String) value);
					} else {
						throw new ForbiddenException("Forbidden: Not allowed to modify email");
					}
					break;
					
				case "password" :
					if(value == null || !(value instanceof String)) throw new InvalidJSONException("Password must be a not null String");
					if(!userService.isValidPassword((String) value)) throw new InvalidJSONException("Password not valid");
					user.setPassword((String) value);
					log.trace("Set new password");
					break;
					
				case "bio" :
					if(!(value instanceof String)) throw new InvalidJSONException("Bio must be a String");
					user.setBio((String) value);
					log.trace("Set new bio: " + (String) value);
					break;
					
				case "profile_picture" :
					if(value == null || ("" + value).isEmpty()) throw new InvalidJSONException("The new URL must be a String");
					user.setProfilePictureUrl("" + value);
					log.trace("Set new profile picture: " + "" + value);
					break;
				
				case "archived_timestamp": 
					if(AuthorizationUtility.hasAdminRole(auth)) {
						if(!(value instanceof String)) throw new InvalidJSONException("Archive timestamp must be a String");
						
						try {
							user.setArchivedTimestamp(LocalDateTime.now());
							log.trace("Set archived timestamp: " + LocalDateTime.now());
						} catch (DateTimeParseException e) {
							throw new InvalidJSONException("Invalid archived timestamp: text cannot be parsed");
						}
					} else {
						throw new ForbiddenException("Forbidden: Not allowed to modify archived timestamp");
					}
					break;
				default: 
					throw new InvalidJSONException("Invalid key: " + key);
			}
		});
		
		userService.saveUser(user);
		log.debug("User after: " + user);
		
		return user;
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/user/badges/{userId}")
	public List<BadgeAward> getAllUserBadges(@PathVariable Long userId) {
		log.debug("GET /user/badges/" + userId);
		return userService.getAllUserBadges(userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value = "/user/store_photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, String> storePhotoOnServer(@RequestParam MultipartFile img, Authentication auth) {
		
		System.out.println("File -> " + img);
		UserDTO loggedUser = AuthorizationUtility.getUserFromAuthentication(auth);
		
		if(img == null || img.isEmpty()) throw new InvalidJSONException("You have to provide a photo");
		
		String orFilename = img.getOriginalFilename();
		byte[] content = null;
		FileOutputStream out = null;
		String finalUrl = null;
		try {
			
			finalUrl = URLEncoder.encode(loggedUser.getId() + "_" + new Date().getTime() + "." + orFilename.substring(orFilename.lastIndexOf('.') + 1), StandardCharsets.UTF_8.toString());
			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			throw new TheJBeansException("" + e);
		}
		//File destination = new File("/Users/riccardogugolati/LAVORO/People First/CouchSurfing/TheJBeansCouchSurfing/src/main/resources/static/images/" + finalUrl);
		File destination = new File(destinationPathPhotoPrefix + finalUrl);
		try {
			
			System.out.println("SONO DENTRO AL TRY");
			destination.createNewFile();
			out = new FileOutputStream(destination);
			content = img.getBytes();
			
			out.write(content);
			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally {
			
			try {
				out.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		
		Map<String, String> map = new HashMap<String, String>();
		String res = null;
		res = "/userImages/" + finalUrl;
		map.put("url", res);
	
		return map;
	}
}
	
