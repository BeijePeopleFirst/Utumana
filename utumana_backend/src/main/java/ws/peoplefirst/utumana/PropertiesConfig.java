package ws.peoplefirst.utumana;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource({
        "classpath:application.properties",
        "classpath:datasource.properties"
})
public class PropertiesConfig {
}
