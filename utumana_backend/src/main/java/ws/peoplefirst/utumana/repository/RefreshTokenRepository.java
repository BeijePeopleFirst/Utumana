package ws.peoplefirst.utumana.repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.RefreshToken;


@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByRefreshToken(String refreshTokenString);

	Optional<RefreshToken> findByUserId(Long id);

	List<RefreshToken> deleteByExpirationDateLessThan(Timestamp valueOf);

	Iterable<? extends RefreshToken> findByExpirationDateLessThan(Timestamp valueOf);

}