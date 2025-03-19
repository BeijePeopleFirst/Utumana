package ws.peoplefirst.utumana.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import ws.peoplefirst.utumana.ScheduledTasks;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.PasswordResetToken;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.PasswordResetTokenRepository;
import ws.peoplefirst.utumana.repository.UserRepository;
import ws.peoplefirst.utumana.utility.Constants;
import ws.peoplefirst.utumana.utility.MailMessage;

@Service
public class MailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordResetTokenService passwordResetTokenService;

    @Autowired
    private ScheduledTasks scheduler;


    public MailMessage sendSimpleMessage(MailMessage msg) {
        
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom(this.from);
        message.setTo(msg.getTo()); 
        message.setSubject(msg.getSubject()); 
        message.setText(msg.getTextContent());
        this.mailSender.send(message);
        
        return msg;
    }

    public MailMessage sendMessageWithAttachment(MailMessage msg) {
    
        MimeMessage message = this.mailSender.createMimeMessage();
        
        try {

            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(this.from);
            helper.setTo(msg.getTo());
            helper.setSubject(msg.getSubject());
            helper.setText(msg.getTextContent());

            helper.addAttachment(msg.getAttachmentName(), new InputStreamResource(msg.getAttachmentPayload()));

            this.mailSender.send(message);
            return msg;

        } catch (MessagingException e) {
            throw new TheJBeansException("Error occurred while sending mail Notification");
        }
        
    }

    public void notifyUserAboutOwnAccommodation(Accommodation acc, String textContent) {
        Optional<User> userOpt = userRepository.findById(acc.getOwnerId());
        User user = null;

        if(!userOpt.isPresent()) throw new IdNotFoundException("Accommodation' s Owner with id " + acc.getOwnerId() + " not found");
        else user = userOpt.get();

        MailMessage message = new MailMessage(user.getEmail(), textContent);
        this.sendSimpleMessage(message);
    }

    public boolean passwordResetRequest(String userEmail) {

        User user = this.userRepository.findUserByEmail(userEmail);

        if(user == null) throw new IdNotFoundException("The provided email does not exist in the system");

        String token = this.passwordResetTokenService.generateToken();
        String url = Constants.FRONTEND_URL_PREFIX + "/reset_password_for_user?token=" + token;

        MailMessage message = new MailMessage();
        message.setTo(userEmail);
        message.setSubject("Utumana Software - Password Reset");
        message.setTextContent("You receive this email because a Password Reset was requested for your Utumana Account: if it was not a request of yours please contact immediately an Admin.\n" +
        "Follow this link to reset your Password: " + url);

        //Now lets create an Hash associated with the token:
        String finalToken = this.passwordResetTokenService.generateHashFromToken(token);

        PasswordResetToken tokenEntity = new PasswordResetToken();
        tokenEntity.setToken(finalToken);
        tokenEntity.setExpirationDate(LocalDateTime.now().plusMinutes(5L)); //5 minutes validity
        tokenEntity.setUser(user);

        PasswordResetToken saved = this.passwordResetTokenRepository.save(tokenEntity);

        //Lets launch the scheduler to delete the Token when validity runs out:
        this.passwordResetTokenService.idsToRemove.add(saved.getId());
        this.scheduler.triggerDeleteOldResetPasswordToken();

        this.sendSimpleMessage(message);

        return true;
    }

    public void notifyAllAdminsToAcceptOrRejectAccommodation(Accommodation accommodation) {

        Long userId = accommodation.getOwnerId();
        UserDTO user = this.userRepository.findSingleUserDTOById(userId);

        if(user == null) throw new IdNotFoundException("Accommodation Owner not found");

        List<UserDTO> admins = this.userRepository.findAllAdmins();

        String textContent = "Accommodation named \"" + accommodation.getTitle() + "\", whose owner is " + user.getEmail() + ", needs to be approved or rejected"; 

        MailMessage message = new MailMessage();    //Subject is "Utumana Software - Notification" by default
        message.setTextContent(textContent);

        for(UserDTO admin: admins) {
            message.setTo(admin.getEmail());
            this.sendSimpleMessage(message);
        }

    }
    
}
