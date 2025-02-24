package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.UnavailabilityDraft;

@Repository
public interface UnavailabilityDraftRepository extends JpaRepository<UnavailabilityDraft, Long> {
    
}
