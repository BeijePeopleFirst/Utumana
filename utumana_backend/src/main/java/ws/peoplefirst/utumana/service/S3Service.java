package ws.peoplefirst.utumana.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;
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
import java.util.List;
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
           upload(fileKey, inputStream, file.getSize());
        }catch (IOException e){
            throw new TheJBeansException("File not found!");
        }
    }

    private void upload(String fileKey, InputStream inputStream, long fileSize) throws IOException {
        System.out.println("Uploading " + fileKey);
         // Crea la richiesta di upload su S3
         PutObjectRequest putObjectRequest = PutObjectRequest.builder()
         .bucket(bucketName)
         .key(fileKey)
         .build();

        // Carica il file su S3 senza salvarlo localmente
        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, fileSize));
    }

    public InputStream downloadFile(String fileKey) throws IOException {
        // Crea una richiesta per ottenere il file dal bucket
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build();

        try{
            // Ottieni il flusso di dati dal bucket S3
            return s3Client.getObject(getObjectRequest);
        }catch(NoSuchKeyException e){
            throw new TheJBeansException("File not found!");
        }
    }

    public void deleteFile(String fileKey){
        DeleteObjectResponse response = s3Client.deleteObject(request -> 
            request
                .bucket(bucketName)
                .key(fileKey));
    }

    public void deleteAll(List<String> fileKeys){
        List<ObjectIdentifier> objectsToDelete = fileKeys
            .stream()
            .map(key -> ObjectIdentifier
                .builder()
                .key(key)
                .build())
            .toList();

        s3Client.deleteObjects(request -> 
            request
                .bucket(bucketName)
                .delete(deleteRequest -> 
                    deleteRequest
                        .objects(objectsToDelete)));
        // for(String fileKey : fileKeys){
        //     deleteFile(fileKey);
        // }
    }
    
    public void moveFile(String oldFileKey, String newFileKey){
        try{
            System.out.println("Moving file from " + oldFileKey + " to " + newFileKey);
            s3Client.copyObject(request -> 
                request
                    .sourceBucket(bucketName)
                    .sourceKey(oldFileKey)
                    .destinationBucket(bucketName)
                    .destinationKey(newFileKey));
            
            // delete old file
            deleteFile(oldFileKey);
        }catch (S3Exception e){
            throw new TheJBeansException("Error moving file");
        }
    }
}