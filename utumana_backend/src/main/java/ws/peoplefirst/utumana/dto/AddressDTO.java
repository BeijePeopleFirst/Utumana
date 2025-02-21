package ws.peoplefirst.utumana.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddressDTO {
    private String street;
    @JsonProperty(value = "street_number")
    private String streetNumber;
    private String city;
    private String cap;
    private String province;
    private String country;
    @JsonProperty(value = "address_notes")
    private String addressNotes;

    public AddressDTO() {}

    public AddressDTO(String street, String streetNumber, String city, String cap, String province, String country,
            String addressNotes) {
        this.street = street;
        this.streetNumber = streetNumber;
        this.city = city;
        this.cap = cap;
        this.province = province;
        this.country = country;
        this.addressNotes = addressNotes;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getStreetNumber() {
        return streetNumber;
    }

    public void setStreetNumber(String streetNumber) {
        this.streetNumber = streetNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddressNotes() {
        return addressNotes;
    }

    public void setAddressNotes(String addressNotes) {
        this.addressNotes = addressNotes;
    }



   
}
