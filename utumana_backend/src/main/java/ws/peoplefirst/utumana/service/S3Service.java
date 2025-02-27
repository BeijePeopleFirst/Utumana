package ws.peoplefirst.utumana.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.core.sync.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ws.peoplefirst.utumana.exception.TheJBeansException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
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
        try(InputStream inputStream = file.getInputStream()) {
            // Crea la richiesta di upload su S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            // Carica il file su S3 senza salvarlo localmente
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }catch (IOException e){
            throw new TheJBeansException("File not found!");
        }
    }

    // public void downloadFile(String fileKey, String downloadPath) {
    //     GetObjectRequest getObjectRequest = GetObjectRequest.builder()
    //             .bucket(bucketName)
    //             .key(fileKey)
    //             .build();

    //     s3Client.getObject(getObjectRequest, Paths.get(downloadPath));
    // }

    public InputStream downloadFile(String fileKey) throws IOException {
        // Crea una richiesta per ottenere il file dal bucket
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        // Ottieni il flusso di dati dal bucket S3
        return s3Client.getObject(getObjectRequest);
    }
}