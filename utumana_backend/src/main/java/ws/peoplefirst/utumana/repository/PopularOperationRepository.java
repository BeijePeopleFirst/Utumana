package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.PopularOperation;
import java.util.Optional;

import ws.peoplefirst.utumana.utility.PopularOperationTitle;


@Repository
public interface PopularOperationRepository extends JpaRepository<PopularOperation, Long> {

    public Optional<PopularOperation> findByTitle(PopularOperationTitle title);
    
}
