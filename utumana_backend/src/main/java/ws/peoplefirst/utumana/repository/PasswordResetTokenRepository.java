package ws.peoplefirst.utumana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.PasswordResetToken;
import ws.peoplefirst.utumana.model.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    public List<PasswordResetToken> findByUser(User user);

}
