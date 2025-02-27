package ws.peoplefirst.utumana.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ws.peoplefirst.utumana.exception.TheJBeansException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class S3Service {

    private Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;



    public void uploadFile(String fileKey, MultipartFile file) {

        File convFile = new File(file.getOriginalFilename());
        try {
            file.transferTo(convFile); // Convert MultipartFile to File
        }catch (IOException e){
            throw new TheJBeansException("File not found!");
        }

        log.info(convFile.getPath());

        Path path = Paths.get(convFile.getPath());

        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .build(),
                RequestBody.fromFile(path));
    }

    public void downloadFile(String fileKey, String downloadPath) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        s3Client.getObject(getObjectRequest, Paths.get(downloadPath));
    }
}