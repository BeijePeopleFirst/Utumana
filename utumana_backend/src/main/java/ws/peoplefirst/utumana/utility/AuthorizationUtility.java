package ws.peoplefirst.utumana.utility;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;

import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.TheJBeansException;

public class AuthorizationUtility {
	
	private static Logger logger = LoggerFactory.getLogger(AuthorizationUtility.class);

	public static void checkIsAdminOrMe(Authentication auth,Long userId) {
		UserDTO user = (UserDTO) auth.getPrincipal();
		
//		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
//		boolean authorized = authorities.contains(new SimpleGrantedAuthority("ADMIN"));
		
		if (!hasAdminRole(auth) && user.getId().compareTo(userId) != 0) {
			logger.error("calls not authorized");
			throw new ForbiddenException("calls not authorized");
		}
	}
	
	public static UserDTO getUserFromAuthentication(Authentication auth) {
		UserDTO user = (UserDTO) auth.getPrincipal();
		
		if(user!=null) {
			return user;
		}
		else {
			logger.error("user not logged");
			throw new TheJBeansException("user not logged");
		}
	}
	
	public static boolean hasAdminRole(Authentication auth) {
		return auth.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ADMIN"));
	}
}
