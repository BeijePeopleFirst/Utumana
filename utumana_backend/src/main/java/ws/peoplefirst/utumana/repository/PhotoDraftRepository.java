package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.PhotoDraft;

@Repository
public interface PhotoDraftRepository extends JpaRepository<PhotoDraft, Long> {
    
}
