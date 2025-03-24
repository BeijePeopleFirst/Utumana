package ws.peoplefirst.utumana.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_performed_operations")
public class AdminPerformedOperation {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    @JoinColumn(name = "operation_id")
    @ManyToOne(fetch = FetchType.EAGER)
    private PopularOperation operation;

    @Column(name = "number_of_times")
    private Integer numberOfTimes;

    @Column(name = "latest_update")
    private LocalDateTime latestUpdate;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PopularOperation getOperation() {
        return operation;
    }

    public void setOperation(PopularOperation operation) {
        this.operation = operation;
    }

    public Integer getNumberOfTimes() {
        return numberOfTimes;
    }

    public void setNumberOfTimes(Integer numberOfTimes) {
        this.numberOfTimes = numberOfTimes;
    }

    public LocalDateTime getLatestUpdate() {
        return latestUpdate;
    }

    public void setLatestUpdate(LocalDateTime latestUpdate) {
        this.latestUpdate = latestUpdate;
    }
    
    @Override
    public boolean equals(Object other) {
        return other != null && (other instanceof AdminPerformedOperation) && ((AdminPerformedOperation)other).getId().equals(this.id);
    }
}
