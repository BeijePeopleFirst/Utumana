package ws.peoplefirst.utumana;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    // Injecting access key from application.properties
    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;

    // Injecting secret key from application.properties
    @Value("${cloud.aws.credentials.secretKey}")
    private String accessSecret;

    // Injecting region from application.properties
    @Value("${cloud.aws.region.static}")
    private String region;

    // Creating a bean for Amazon S3 client
    @Bean
    public S3Client s3Client() {

        AwsCredentials credentials = AwsBasicCredentials.create(accessKey, accessSecret);


        S3Client s3Client = S3Client
                .builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .build();

        return s3Client;
    }

}