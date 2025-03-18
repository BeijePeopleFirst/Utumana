package ws.peoplefirst.utumana.utility;

import java.io.InputStream;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MailMessage {

    private String to;
    private String subject;

    @JsonProperty(value="text_content")
    private String textContent;

    @JsonProperty(value="attachment_name")
    private String attachmentName;

    @JsonProperty(value="attachment_payload")
    private InputStream attachmentPayload;


    public MailMessage() {
        this.subject = "Utumana Software - Notification";
    }

    public MailMessage(String to, String textContent) {
        this();

        this.to = to;
        this.textContent = textContent;
    }

    public MailMessage(String to, String subject, String textContent) {
        this(to, textContent);

        this.subject = subject;
    }

    public MailMessage(String to, String subject, String textContent, String attachmentName, InputStream attachmentPayload) {
        this(to, subject, textContent);

        this.attachmentName = attachmentName;
        this.attachmentPayload = attachmentPayload;
    }

    public String getTo() {
        return to;
    }
    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTextContent() {
        return textContent;
    }
    public void setTextContent(String textContent) {
        this.textContent = textContent;
    }

    public String getAttachmentName() {
        return attachmentName;
    }
    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    public InputStream getAttachmentPayload() {
        return attachmentPayload;
    }
    public void setAttachmentPayload(InputStream attachmentPayload) {
        this.attachmentPayload = attachmentPayload;
    }
    
}
