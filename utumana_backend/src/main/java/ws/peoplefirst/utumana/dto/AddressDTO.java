package ws.peoplefirst.utumana.dto;

public class AddressDTO {
    private String street;
    private String streetNumber;
    private String city;
    private String cap;
    private String province;
    private String country;

    public AddressDTO() {}

    public AddressDTO(String street, String streetNumber, String city, String province, String cap, String country) {
        this.street = street;
        this.streetNumber = streetNumber;
        this.city = city;
        this.province = province;
        this.cap = cap;
        this.country = country;
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


    public String getProvince() {
        return province;
    }


    public void setProvince(String state) {
        this.province = state;
    }


    public String getCap() {
        return cap;
    }


    public void setCap(String cap) {
        this.cap = cap;
    }


    public String getCountry() {
        return country;
    }


    public void setCountry(String country) {
        this.country = country;
    }
   
}
