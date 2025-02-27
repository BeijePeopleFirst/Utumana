package ws.peoplefirst.utumana.criteria;

import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;


public class SearchAccomodationCriteria {
    private String destination;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private Boolean freeOnly;
    private List<Long> serviceIds;
    private Integer minRating;
    private Integer maxRating;
    private Double minPrice;
    private Double maxPrice;
    private String orderBy;
    private String orderDirection;
    private Long userId;
    private Pageable pageable;
    private String addressName;

    public SearchAccomodationCriteria(String destination, LocalDate checkInDate, LocalDate checkOutDate,
                                      Integer numberOfGuests, Boolean freeOnly, List<Long> serviceIds, Integer minRating, Integer maxRating,
                                      Double minPrice, Double maxPrice, String orderBy,
                                      String orderDirection, String addressName, Long userId, Pageable pageable){
        this.destination = destination;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.freeOnly = freeOnly;
        this.serviceIds = serviceIds;
        this.minRating = minRating;
        this.maxRating = maxRating;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.orderBy = orderBy;
        this.orderDirection = orderDirection;
        this.addressName = addressName;
        this.userId = userId;
        this.pageable = pageable;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public Boolean getFreeOnly() {
        return freeOnly;
    }

    public void setFreeOnly(Boolean freeOnly) {
        this.freeOnly = freeOnly;
    }

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }

    public Integer getMinRating() {
        return minRating;
    }

    public void setMinRating(Integer minRating) {
        this.minRating = minRating;
    }

    public Integer getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }

    public Double getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }



    public Double getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public void setOrderBy(String orderBy) {
        this.orderBy = orderBy;
    }

    public String getOrderDirection() {
        return orderDirection;
    }

    public void setOrderDirection(String orderDirection) {
        this.orderDirection = orderDirection;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Pageable getPageable() {
        return pageable;
    }

    public void setPageable(Pageable pageable) {
        this.pageable = pageable;
    }

    public String getAddressName() {
        return addressName;
    }

    public void setAddressName(String addressName) {
        this.addressName = addressName;
    }

    @Override
    public String toString() {
        return "SearchAccomodationCriteria{" +
                "destination='" + destination + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", numberOfGuests=" + numberOfGuests +
                ", freeOnly=" + freeOnly +
                ", serviceIds=" + serviceIds +
                ", minRating=" + minRating +
                ", maxRating=" + maxRating +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                ", orderBy='" + orderBy + '\'' +
                ", orderDirection='" + orderDirection + '\'' +
                ", addressName='" + addressName + '\'' +
                ", userId=" + userId +
                ", pageable=" + pageable +
                '}';
    }
}
