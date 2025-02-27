package ws.peoplefirst.utumana.controller;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import jakarta.servlet.http.HttpServletRequest;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.service.S3Service;

@RestController
@RequestMapping(value = "/api/s3")
public class S3Controller {
    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private S3Service s3Service;

    @GetMapping(value = "/**")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<InputStreamResource> getFile(final HttpServletRequest request, Authentication auth) {
        log.info("GET /s3/");
        //fileKey = URLDecoder.decode(fileKey, StandardCharsets.UTF_8);

        String path = (String) request.getAttribute(
        HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String ) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        AntPathMatcher apm = new AntPathMatcher();
        String fileKey = apm.extractPathWithinPattern(bestMatchPattern, path);
        log.info("fileKey = " + fileKey);

        if(fileKey.indexOf("icons") < 0 && fileKey.indexOf("images") < 0){
            throw new ForbiddenException("File not found!");
        }
        try{
            InputStream inputStream = s3Service.downloadFile(fileKey);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(new InputStreamResource(inputStream));
        }catch (IOException e){
            throw new TheJBeansException("Error converting input stream");
        }
    }
}
