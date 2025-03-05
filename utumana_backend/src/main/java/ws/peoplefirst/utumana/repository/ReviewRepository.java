package ws.peoplefirst.utumana.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.dto.ReviewUserDTO;
import ws.peoplefirst.utumana.model.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long>{

	public abstract Review findByBookingId(Long id);


    @Query("SELECT new ws.peoplefirst.utumana.dto.ReviewUserDTO(r.id, r.bookingId, r.title, r.description, r.overallRating, r.approvalTimestamp, r.comfort, r.convenience, r.position, u.name, u.profilePictureUrl, b.accommodation.id) "
            + "FROM Review r "
            + "JOIN Booking b ON r.bookingId = b.id "
            + "JOIN User u ON b.userId = u.id "
            + "WHERE b.accommodation.ownerId = :userId")
    public List<ReviewUserDTO> findReviewsReceivedByUserByUserId(@Param(value="userId")Long userId);

    @Query("SELECT new ws.peoplefirst.utumana.dto.ReviewUserDTO(r.id, r.bookingId, r.title, r.description, r.overallRating, r.approvalTimestamp, r.comfort, r.convenience, r.position, u.name, u.profilePictureUrl, b.accommodation.id) "
            + "FROM Review r "
            + "JOIN Booking b ON r.bookingId = b.id "
            + "JOIN User u ON b.userId = u.id "
            + "WHERE b.accommodation.id = :accommodationId")
	List<ReviewUserDTO> getAllAccommodationReviews(@Param(value = "accommodationId") Long accommodationId);
}
