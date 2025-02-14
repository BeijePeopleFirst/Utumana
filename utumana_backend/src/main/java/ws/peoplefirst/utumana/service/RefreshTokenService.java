package ws.peoplefirst.utumana.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.persistence.EntityExistsException;
import ws.peoplefirst.utumana.dto.AuthCredentials;
import ws.peoplefirst.utumana.exception.InvalidJwtAuthenticationException;
import ws.peoplefirst.utumana.model.RefreshToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.RefreshTokenRepository;
import ws.peoplefirst.utumana.repository.UserRepository;


@Service
public class RefreshTokenService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private RefreshTokenRepository tokenRepository;

	@Autowired
	private UserRepository userRepository;

	@Value("${refreshToken.secretKey}")
	private String secretKey = "secretKey";

	@Value("${refreshToken.validityInSeconds}")
	private long validityInSeconds;

	@Transactional
	public RefreshToken createRefreshToken(User user) {
		try {
			//clearOldTokens();
			Optional<RefreshToken> oldToken = tokenRepository.findByUserId(user.getId());
			if (oldToken.isPresent()) {
				if(oldToken.get().getExpirationDate().before(Timestamp.valueOf(LocalDateTime.now()))) {
					tokenRepository.delete(oldToken.get());
				} else {
					return oldToken.get();
				}
			}

			RefreshToken token = new RefreshToken();
			token.setUserId(user.getId());
			token.setRefreshToken(generateRefreshToken(user.getUsername()));
			token.setExpirationDate(Timestamp.valueOf(LocalDateTime.now().plusSeconds(validityInSeconds)));

			return tokenRepository.saveAndFlush(token);
		} catch (EntityExistsException
				| DataIntegrityViolationException
				/* | SQLIntegrityConstraintViolationException */ e) {
			return createRefreshToken(user);
		}
	}

	private String generateRefreshToken(String username) {
		String secretKey = this.secretKey + new Random().nextInt();
		return Jwts.builder().setClaims(Jwts.claims().setSubject(username))
				.setExpiration(new java.util.Date(new java.util.Date().getTime() + validityInSeconds * 1000))
				.signWith(SignatureAlgorithm.HS256, secretKey).compact();
	}

	public AuthCredentials getAuthenticationFromRefreshToken(String tokenString) {
		clearOldTokens();
		RefreshToken token = tokenRepository.findByRefreshToken(tokenString)
				.orElseThrow(() -> new InvalidJwtAuthenticationException("token not present",
						InvalidJwtAuthenticationException.FORBIDDEN));
		System.out.println("Token exp: " + token.getExpirationDate() + ", now: " + Timestamp.valueOf(LocalDateTime.now()));
		if (token.getExpirationDate().before(Timestamp.valueOf(LocalDateTime.now())))
			throw new InvalidJwtAuthenticationException("token expired", InvalidJwtAuthenticationException.EXPIRED);
		User user = userRepository.findById(token.getUserId())
				.orElseThrow(() -> new RuntimeException("JWT TOKEN ERROR"));
		AuthCredentials auth = new AuthCredentials();
		auth.setEmail(user.getUsername());
		auth.setPassword(user.getPassword());
		return auth;
	}

	@Transactional
	@Scheduled(fixedDelay = 1000 * 60 * 60 * 24, initialDelay = 1000 * 60) // 24h
	public void clearOldTokens() {
		log.debug("Cleaning refreshToken from database");
		tokenRepository.deleteAll(
				tokenRepository.findByExpirationDateLessThan(Timestamp.valueOf(LocalDateTime.now().minusMinutes(10))));
	}

	public Optional<RefreshToken> findByRefreshToken(String refreshTokenString) {
		return tokenRepository.findByRefreshToken(refreshTokenString);
	}

	public void delete(RefreshToken refreshToken) {
		tokenRepository.delete(refreshToken);

	}

}