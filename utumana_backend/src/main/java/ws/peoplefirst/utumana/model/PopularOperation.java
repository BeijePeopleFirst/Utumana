package ws.peoplefirst.utumana.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import ws.peoplefirst.utumana.utility.PopularOperationTitle;

@Entity
@Table(name = "popular_operation")
public class PopularOperation {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "title")
    private PopularOperationTitle title;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PopularOperationTitle getTitle() {
        return title;
    }

    public void setTitle(PopularOperationTitle title) {
        this.title = title;
    }
    
}
