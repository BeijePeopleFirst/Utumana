package ws.peoplefirst.utumana;

import java.util.List;

import org.springframework.context.annotation.PropertySource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:defaultAddress.properties")
@ConfigurationProperties(prefix = "app")
public class AddressConfiguration {
    private List<DefaultAddress> defaultAddresses;

    public List<DefaultAddress> getDefaultAddresses() {
        return defaultAddresses;
    }

    public void setDefaultAddresses(List<DefaultAddress> defaultAddresses) {
        this.defaultAddresses = defaultAddresses;
    }

    public static class DefaultAddress {
        private String name;
        private String address;
        private Double lat;
        private Double lon;

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getAddress() {
            return address;
        }
        public void setAddress(String address) {
            this.address = address;
        }

        public Double getLat() {
            return lat;
        }
        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLon() {
            return lon;
        }
        public void setLon(Double lon) {
            this.lon = lon;
        }
        
        
    }
    
}
