package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ws.peoplefirst.utumana.model.AvailabilityDraft;

@Repository
public interface AvailabilityDraftRepository extends JpaRepository<AvailabilityDraft,Long> {
    
}
