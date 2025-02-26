package ws.peoplefirst.utumana.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ws.peoplefirst.utumana.AddressConfiguration;
import ws.peoplefirst.utumana.AddressConfiguration.DefaultAddress;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    private final AddressConfiguration addressConfiguration;

    public AddressController(AddressConfiguration addressConfiguration) {
        this.addressConfiguration = addressConfiguration;
    }

    @GetMapping("/default")
    public List<DefaultAddress> getDefaultAddresses() {
        return addressConfiguration.getDefaultAddresses();
    }
}
