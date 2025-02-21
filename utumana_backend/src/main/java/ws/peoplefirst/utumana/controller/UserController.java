package ws.peoplefirst.utumana.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.ErrorMessage;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.BadgeAward;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping(value = "/api")
@Tag(name = "Users", description = "Users entry point")
public class UserController {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());

//	@Value("${photoPrefixPath.path}")
//	private String destinationPathPhotoPrefix;
	
	@Autowired
	private UserService userService;
	
    @Operation(summary = "Get all users as DTOs")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of user DTOs fetched successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value = "/users")
	public List<UserDTO> getUsersDTO(){
		log.debug("GET /users");
		
		return userService.getUsersDTO();
	}
    
    @Operation(summary = "Get all users with full details")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of complete users successfully fetched"),
        @ApiResponse(responseCode = "500", description = "Internal server error", content=@Content(mediaType = "application/json",
			schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value = "/users_full_obj")
	public List<User> getAllUsersFullObj(Authentication auth){
		return userService.findAllUsers();
	}
	
    @Operation(summary = "Get user by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "IdNotFoundException(\"User with id \" + id + \" not found.\")", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class)))
    })
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
	
    @Operation(summary = "Create a new user")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "InvalidJSONException(\"Error: could not create new user. Invalid user.\")", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@PostMapping(value = "/user")
	public User insertUser(@Parameter(description = "the user to insert", schema = @Schema(implementation = User.class)) @RequestBody User user){
		log.debug("POST /user");
		log.debug("User to insert: " + user);		
		
		return userService.insertUser(user);
	}
	
    @Operation(summary = "Change user password")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Password updated successfully"),
        @ApiResponse(responseCode = "404", description = "IdNotFoundException(\"user with email \"+email+\" not found\")", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class))),
        @ApiResponse(responseCode = "503", description = "DBException(\"cannot change current user\")", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("permitAll()")
	@PatchMapping(value = "/change_password")
	public User modifyPassword(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "the map containing email and the new password", content = @Content( mediaType = "application/json",
            schema = @Schema(implementation = Map.class),
            examples = @ExampleObject(
                name = "Example request",
                value = "{ \"email\": \"john.doe@gmail.com\", \"password\": \"password123\" }"
            ))) @RequestBody Map<String, Object> body) {
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
    
    @Operation(summary = "Update user information")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "403", description = "Forbidden action", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class))),
        @ApiResponse(responseCode = "400", description = "InvalidJSONException(\"Invalid key: \" + key)", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class)))
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/user")
	public User modifyUser(@io.swagger.v3.oas.annotations.parameters.RequestBody(description = "the map containing user's field to change", content = @Content( mediaType = "application/json",
	schema = @Schema(implementation = Map.class),
	examples = @ExampleObject(
		name = "Example request",
		value = "{ \"id\": \"1\", \"name\": \"Mario\", \"bio\": \"I like travelling\" }"
	)))@RequestBody Map<String, Object> body, Authentication auth) 
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
	
    @Operation(summary = "Get user badges")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of user badges retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "IdNotFoundException(\"user not found\")", content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=ErrorMessage.class))),
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/user/badges/{userId}")
	public List<BadgeAward> getAllUserBadges(@PathVariable Long userId) {
		log.debug("GET /user/badges/" + userId);
		return userService.getAllUserBadges(userId);
	}

//	@PreAuthorize("hasAuthority('USER')")
//	@PostMapping(value = "/user/store_photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public Map<String, String> storePhotoOnServer(@RequestParam MultipartFile img, Authentication auth) {
//
//		System.out.println("File -> " + img);
//		UserDTO loggedUser = AuthorizationUtility.getUserFromAuthentication(auth);
//
//		if(img == null || img.isEmpty()) throw new InvalidJSONException("You have to provide a photo");
//
//		String orFilename = img.getOriginalFilename();
//		byte[] content = null;
//		FileOutputStream out = null;
//		String finalUrl = null;
//		try {
//
//			finalUrl = URLEncoder.encode(loggedUser.getId() + "_" + new Date().getTime() + "." + orFilename.substring(orFilename.lastIndexOf('.') + 1), StandardCharsets.UTF_8.toString());
//
//		} catch (UnsupportedEncodingException e) {
//			// TODO Auto-generated catch block
//			throw new TheJBeansException("" + e);
//		}
//		//File destination = new File("/Users/riccardogugolati/LAVORO/People First/CouchSurfing/TheJBeansCouchSurfing/src/main/resources/static/images/" + finalUrl);
//		File destination = new File(destinationPathPhotoPrefix + finalUrl);
//		try {
//
//			System.out.println("SONO DENTRO AL TRY");
//			destination.createNewFile();
//			out = new FileOutputStream(destination);
//			content = img.getBytes();
//
//			out.write(content);
//
//
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		finally {
//
//			try {
//				out.close();
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//
//		}
//
//		Map<String, String> map = new HashMap<String, String>();
//		String res = null;
//		res = "/images/" + finalUrl;
//		map.put("url", res);
//
//		return map;
//	}
}
	
