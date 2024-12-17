package ws.peoplefirst.utumana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

	public abstract List<Photo> findByAccommodationId(Long accommodationId);

}
