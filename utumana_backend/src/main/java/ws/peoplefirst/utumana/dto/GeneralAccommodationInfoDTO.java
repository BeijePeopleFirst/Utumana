package ws.peoplefirst.utumana.dto;

public class GeneralAccommodationInfoDTO {
    private String title;
    private String description;
    private Integer beds;
    private Integer rooms;
    
    public GeneralAccommodationInfoDTO() {}
    
    public GeneralAccommodationInfoDTO(String title, String description, Integer beds, Integer rooms) {
        this.title = title;
        this.description = description;
        this.beds = beds;
        this.rooms = rooms;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getBeds() {
        return beds;
    }

    public void setBeds(Integer beds) {
        this.beds = beds;
    }

    public Integer getRooms() {
        return rooms;
    }

    public void setRooms(Integer rooms) {
        this.rooms = rooms;
    }
}
