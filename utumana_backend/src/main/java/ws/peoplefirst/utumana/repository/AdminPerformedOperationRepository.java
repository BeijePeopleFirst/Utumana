package ws.peoplefirst.utumana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ws.peoplefirst.utumana.model.AdminPerformedOperation;
import ws.peoplefirst.utumana.model.User;

public interface AdminPerformedOperationRepository extends JpaRepository<AdminPerformedOperation, Long> {

    List<AdminPerformedOperation> findByUser(User user);

    
}
