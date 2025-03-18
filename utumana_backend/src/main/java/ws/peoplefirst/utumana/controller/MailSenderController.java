package ws.peoplefirst.utumana.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ws.peoplefirst.utumana.service.MailSenderService;
import ws.peoplefirst.utumana.utility.MailMessage;

@RestController
@RequestMapping("/api")
public class MailSenderController {

    @Autowired
    private MailSenderService mailSenderService;


    @PreAuthorize("permitAll()")
    @PostMapping("/email_sender/send_simple_message")
    public MailMessage test(@RequestBody MailMessage message) {
        return this.mailSenderService.sendSimpleMessage(message);
    }
    
}
