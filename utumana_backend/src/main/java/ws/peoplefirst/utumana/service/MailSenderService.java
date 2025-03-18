package ws.peoplefirst.utumana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.utility.MailMessage;

@Service
public class MailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;


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
    
}
