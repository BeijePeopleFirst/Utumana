package ws.peoplefirst.utumana.repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ws.peoplefirst.utumana.model.AccommodationDraft;

public interface AccommodationDraftRepository extends JpaRepository<AccommodationDraft, Long> {
    
    List<AccommodationDraft> findByOwnerId(Long ownerId);

    Integer countByOwnerId(Long ownerId);

    List<AccommodationDraft> findByLastModifiedTimestampBefore(LocalDateTime valueOf);
    
/*     List<AccommodationDraft> findByOwnerIdAndId(Long ownerId, Long id);
    
    @Query("INSERT INTO photo_draft (accommodation_id, photo_url, `order`) VALUES (:id, :url, :order)")
    public void savePhoto(@Param("id") Long id, @Param("url") String url, @Param("order") Integer order);

    @Query("DELETE FROM photo_draft WHERE accommodation_id = :id")
    public void deletePhotos(@Param("id") Long id);

    @Query("DELETE FROM AccommodationDraft WHERE id = :id")
    public void delete(@Param("id") Long id);

    @Query("INSERT INTO service_draft (accommodation_id, service_id) VALUES (:id, :service)")
    public void saveServices(@Param("id") Long id, @Param("services") List<Long> services); */
}
