package ws.peoplefirst.utumana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.UserAuthority;
import ws.peoplefirst.utumana.model.UserAuthorityId;

@Repository
public interface UserAuthorityRepository extends JpaRepository<UserAuthority, UserAuthorityId>{
	List<UserAuthority> findByUserId(Long userId);
}
