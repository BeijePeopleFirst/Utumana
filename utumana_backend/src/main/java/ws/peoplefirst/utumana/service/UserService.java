package ws.peoplefirst.utumana.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.BadgeAward;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.model.UserAuthority;
import ws.peoplefirst.utumana.repository.UserAuthorityRepository;
import ws.peoplefirst.utumana.repository.UserRepository;
import ws.peoplefirst.utumana.utility.Constants;


@Service
@Transactional
public class UserService implements UserDetailsService {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserAuthorityRepository userAuthorityRepository;

	@Autowired
	private S3Service s3Service;


	public boolean isUserOK(User user) {
		if(user == null) {
			log.trace("User is null");
			return false;
		}
		
		boolean isNameOK = isValidName(user.getName());
		if(!isNameOK) {
			log.trace("Invalid user name: " + user.getName());
		}
		
		boolean isSurnameOK = isValidSurname(user.getSurname());
		if(!isSurnameOK) {
			log.trace("Invalid user surname: " + user.getSurname());
		}
		
		boolean isEmailOK = isValidEmail(user.getEmail());
		if(!isEmailOK) {
			log.trace("Invalid user email: " + user.getEmail());
		}
		if(user.getId() == null) {
			if(userRepository.findUserByEmail(user.getEmail()) != null) {
				isEmailOK = false;
				log.trace("Email is not unique: " + user.getEmail());
			}
		} else if(!isEmailUnique(user.getEmail(), user.getId())) {
			isEmailOK = false;
			log.trace("Email is not unique: " + user.getEmail());
		}
		
		boolean isPasswordOK = isValidPassword(user.getPassword());
		if(!isPasswordOK) {
			log.trace("Invalid password: " + user.getPassword());		}
		
		return isNameOK && isSurnameOK && isEmailOK && isPasswordOK;
	}
	
	public boolean isValidName(String name) {
		return name != null && !name.isBlank();
	}
	
	public boolean isValidSurname(String surname) {
		return surname != null && !surname.isBlank();
	}
	
	public boolean isValidEmail(String email) {
		return email != null && !email.isBlank() && email.matches(Constants.EMAIL_REGEX);
	}
	
	public boolean isEmailUnique(String email, Long userId) {
		return userRepository.findUserByEmailExceptMe(email, userId) == null;
	}
	
	public boolean isValidPassword(String password) {
		if(password == null || password.isBlank())
			return false;
		if(password.length() < Constants.MIN_PASSWORD_CHARACTERS || password.length() > Constants.MAX_PASSWORD_CHARACTERS)
			return false;
		
		int countUpper = 0;
		int countLower = 0;
		int countNumbers = 0;
		int countSymbols = 0;
		char c;
		for(int i = 0; i < password.length(); i++) {
			c = password.charAt(i);
			if(Character.isUpperCase(c)) {
				countUpper++;
			}else if(Character.isLowerCase(c)) {
				countLower++;
			}else if(c >= 48 && c <= 57) {	// 0-9
				countNumbers++;
				} else if(c >= 33 && c <= 46 || c >= 50 && c <= 64) {
					countSymbols++;
				}
		}
		
		return countUpper >= Constants.MIN_PASSWORD_UPPER_CHARACTERS && countLower >= Constants.MIN_PASSWORD_LOWER_CHARACTERS && 
					countNumbers >= Constants.MIN_PASSWORD_DIGIT_CHARACTERS && countSymbols >= Constants.MIN_PASSWORD_SYMBOL_CHARACTERS;
	}
	
	public List<User> findAllUsersExceptMe(Long userId){
		return userRepository.findAllUserExceptMe(userId);
	}
	
	public boolean saveUser(User userToSave) {
		try {			
			userRepository.save(userToSave);
		}catch(RuntimeException e) {
			log.error("Could not save user. Exception message: " + e.getMessage());
			//throw e;
			return false;
		}
		return true;
	}

	public String uploadProfilePicture(Long userId, MultipartFile photo) {
		User user = getUserById(userId);
		if(user == null){
			throw new IdNotFoundException("User not found with id: " + userId);
		}

		String fileExtension = photo.getContentType() != null ? photo.getContentType().split("/")[1] : ".jpg";
        String savedPhotoUrl = "images/users/" + userId.toString() + "/profile" + "." + fileExtension;
        
        //save photo file in s3
        s3Service.uploadFile(savedPhotoUrl, photo);

		user.setProfilePictureUrl(savedPhotoUrl);
		userRepository.save(user);
		return savedPhotoUrl;
	}
	
	public User getUserByEmail(String email) {
		return userRepository.findUserByEmail(email);
	}
	
	public User getUserById(Long id) {
		log.trace("Get user by id with id " + id + " (no badges, no favourites, no reviews)");
		return userRepository.findById(id).orElse(null);
	}
	

	public List<ReviewDTO> getUserReviews(Long id)  {
		log.trace("Getting reviews of user with id " + id);
		return userRepository.findUserReviewsDTO(id);
	}
	
	public List<UserDTO> getUsersDTO() {
		log.trace("Getting all users DTO");
		return userRepository.findAllDTO();
	}
	
    @Transactional(readOnly = true)
    public User getUserWithBadges(Long userId) {
    	log.trace("Getting user with badges with user id " + userId);
        return userRepository.findByIdWithBadges(userId)
            .orElseThrow(() -> new IdNotFoundException("User not found with id: " + userId));
    }

	public User insertUser(User user) {	
		
		log.trace("Checking if user to insert is OK...");
		if(!isUserOK(user)) {
			throw new InvalidJSONException("Error: could not create new user. Invalid user.");
		}
		log.trace("User OK");
		
		log.trace("Setting user.isAdmin to false");		 // DA TOGLIERE POI
		user.setIsAdmin(false); 						 // DA TOGLIERE POI

		user = userRepository.save(user);
		
		UserAuthority userAuthority = new UserAuthority();
		
		userAuthority.setUserId(user.getId());
		userAuthority.setAuthorityId(1); //USER
		
		userAuthorityRepository.save(userAuthority);
		
		log.debug("Inserted user: " + user + " with authority \"USER\"");

		return user;
	}

	public User getUserForProfile(Long id) {
		User user = getUserWithBadges(id);
		user.setReviews(getUserReviews(id));
		
		log.trace("Got user for profile: " + user);
		
		return user;
	}
	
	public List<BadgeAward> getAllUserBadges(Long id) {
		log.trace("Getting all badges of user with id " + id);
		return userRepository.findAllUserBadges(id);
	}
	
	public User findById(Long currentUsr) {
		Optional<User> tmp = userRepository.findById(currentUsr);
		return tmp.isPresent() ? tmp.get() : null;
	}

	// SPRING SECURITY
	@Override
	public User loadUserByUsername(String email) throws UsernameNotFoundException {
		try {
			User user = userRepository.findUserByEmail(email);
			if (user == null) throw new UsernameNotFoundException("email: " + email + " not found");

			return user;
		} catch (Exception e) {
			throw e;
		}
	}

	public List<User> findAllUsers() {
		return userRepository.findAll();
	}

}
