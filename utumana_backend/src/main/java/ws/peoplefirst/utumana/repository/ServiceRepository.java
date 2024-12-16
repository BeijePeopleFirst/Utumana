package ws.peoplefirst.utumana.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.Service;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
	
	public List<Service> findByTitleIgnoreCaseContaining(String title);
	
	public Set<Service> findByIdIn(List<Long> ids);
	
	@Query("SELECT a.services FROM Accommodation as a WHERE a.id = :id")
	public Set<Service> findByAccommodationId(@Param(value = "id") Long id);
}
