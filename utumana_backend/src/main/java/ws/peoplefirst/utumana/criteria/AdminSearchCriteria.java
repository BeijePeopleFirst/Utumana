package ws.peoplefirst.utumana.criteria;

import org.springframework.data.domain.Pageable;

public class AdminSearchCriteria {
    private String title;
    private String ownerName;
    private String ownerSurname;
    private String city;
    private Pageable pageable;

    public AdminSearchCriteria (String title, String ownerName, String ownerSurname, String city, Pageable pageable) {
        this.title = title;
        this.ownerName = ownerName;
        this.ownerSurname = ownerSurname;
        this.city = city;
        this.pageable = pageable;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerSurname() {
        return ownerSurname;
    }

    public void setOwnerSurname(String ownerSurname) {
        this.ownerSurname = ownerSurname;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Pageable getPageable() {
        return pageable;
    }

    public void setPageable(Pageable pageable) {
        this.pageable = pageable;
    }

    
    
}
