package ws.peoplefirst.utumana.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.model.PasswordResetToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetTokenService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public final List<Long> idsToRemove = Collections.synchronizedList(new ArrayList<Long>());


    public PasswordResetToken save(PasswordResetToken token) {
        return this.passwordResetTokenRepository.save(token);
    }

    public String generateToken() {
        BytesKeyGenerator generator = KeyGenerators.secureRandom();
        byte[] bytesToken = generator.generateKey();

        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytesToken);

        return token;
    }

    public void validateToken(String token, User user) {

        List<PasswordResetToken> tokenEntityList = this.passwordResetTokenRepository.findByUser(user);

        if(tokenEntityList == null || tokenEntityList.size() == 0) throw new BadCredentialsException("Invalid Token provided");

        PasswordResetToken tokenEntity = null;

        for(PasswordResetToken t: tokenEntityList) {
            if(token.equals(t.getToken())) tokenEntity = t;
        }

        if(tokenEntity == null) throw new BadCredentialsException("Invalid Token provided");

        if((tokenEntity.getExpirationDate().isBefore(LocalDateTime.now())) || (tokenEntity.getExpirationDate().isEqual(LocalDateTime.now()))) {
            this.passwordResetTokenRepository.delete(tokenEntity);
            throw new BadCredentialsException("Invalid Token provided");
        }
        else this.passwordResetTokenRepository.delete(tokenEntity);
    }

    /**
     * "gc" -> "garbage-collector"
     * 
     * This method removes all useless PasswordResetToken entities
     */
    public void gc() {

        Optional<PasswordResetToken> temp = null;
        PasswordResetToken token = null;
        LocalDateTime duration = null;

        List<Long> removed = new ArrayList<Long>();

        synchronized(this.idsToRemove) {

            for(Long id: this.idsToRemove) {
                temp = this.passwordResetTokenRepository.findById(id);
    
                if(temp.isPresent()) {
                    token = temp.get();
    
                    duration = token.getExpirationDate();
                    if(duration.isBefore(LocalDateTime.now()) || duration.isEqual(LocalDateTime.now())) {
                        this.passwordResetTokenRepository.delete(token);
                        removed.add(id);
                    }
                }
                else removed.add(id);
            }
    
            for(Long id: removed) {
                this.idsToRemove.remove(id);
            }

        }

    }
    
}
