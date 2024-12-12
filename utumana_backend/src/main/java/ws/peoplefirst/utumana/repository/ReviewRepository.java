package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long>{

	public abstract Review findByBookingId(Long id);

}
