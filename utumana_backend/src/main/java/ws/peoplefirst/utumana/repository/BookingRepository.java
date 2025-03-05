package ws.peoplefirst.utumana.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import io.swagger.v3.oas.annotations.Parameter;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.ReviewUserDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.utility.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long>{

	@Query(value = "SELECT b.review FROM Booking as b WHERE b.accommodation.id = :accommodationId AND b.review.approvalTimestamp IS NOT NULL")
	List<Review> getApprovedAccommodationReviews(@Param(value = "accommodationId") Long accommodationId);
	
	public List<Booking> findAllByUserIdAndIsUnavailabilityIsFalseOrderByCheckInDesc(Long userId);
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
			+ "FROM Booking as b WHERE b.user.id = :userId AND b.isUnavailability IS false ORDER BY b.checkIn DESC")
	public List<BookingDTO> findAllDTOByUserId(@Param(value="userId")Long userId);
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
			+ "FROM Booking as b WHERE b.user.id = :userId AND b.isUnavailability IS false AND b.status = :status ORDER BY b.checkIn DESC")
	public List<BookingDTO> findByUserIdAndStatusDTO(@Param(value="userId")Long userId, @Param(value = "status") BookingStatus status);
	
	@Query("SELECT b from Booking as b WHERE b.accommodation.ownerId = :ownerId AND b.isUnavailability IS false ORDER BY b.checkIn DESC")
	public List<Booking> findAllByOwnerId(@Param(value="ownerId")Long ownerId);
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
			+ "FROM Booking as b JOIN Accommodation as a ON b.accommodation.id = a.id WHERE b.accommodation.ownerId = :ownerId AND b.isUnavailability  IS false ORDER BY b.checkIn DESC")
	public List<BookingDTO> findAllDTOByOwnerId(@Param(value="ownerId")Long ownerId);
	
	public List<Booking> findByUserIdAndAccommodationIdAndStatus(Long userId, Long accommodationId, BookingStatus status);

	@Query(value = "SELECT b FROM Booking as b WHERE b.accommodation.id = :accommodationId AND b.checkOut >= :now AND b.checkIn <= :myCheckOut AND (b.status = 'ACCEPTED' OR b.status = 'DOING') ORDER BY b.checkIn")
	public List<Booking> getAcceptedBookings(@Param(value = "accommodationId") Long accommodationId, @Param(value = "now") LocalDateTime now, @Param(value = "myCheckOut") LocalDateTime myCheckOut);

	@Query("SELECT b FROM Booking AS b WHERE b.status = 'DOING' AND b.checkOut <= :now")
	List<Booking> findExpiredBookings(@Param(value="now")LocalDateTime now);

	@Query("SELECT b FROM Booking AS b WHERE b.status = 'ACCEPTED' AND b.checkIn <= :now")
	List<Booking> findStartedBookings(@Param(value="now")LocalDateTime now); 
	
	public List<Booking> findByAccommodationAndIsUnavailabilityIsFalse(Accommodation accommodation);
	
	public List<Booking> findByAccommodationIdAndIsUnavailabilityIsTrue(Long accommodationId);

	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
			+ "FROM Booking as b WHERE b.accommodation.id = :accommodationId  AND b.isUnavailability IS true ORDER BY b.checkIn DESC")
	List<BookingDTO> findUnAvailabilities(@Param(value="accommodationId")Long accommodationId);

	@Query("SELECT new ws.peoplefirst.utumana.dto.UnavailabilityDTO(b.id,b.checkIn,b.checkOut) "
			+ "FROM Booking as b WHERE b.accommodation.id = :accommodationId  AND b.isUnavailability IS true ORDER BY b.checkIn ASC")
	List<UnavailabilityDTO> findUnAvailabilitiesDTO(@Param(value="accommodationId")Long accommodationId);
	
	public Booking findByIdAndIsUnavailabilityIsFalse(Long id);

	public Booking findByIdAndStatus(Long id, BookingStatus done);
	
    @Query("SELECT b FROM Booking b WHERE " +
            "b.accommodation.id = :accommodationId AND " +
            "(b.status = 'ACCEPTED' OR b.status = 'DOING') AND " +
            "b.checkIn <= :endDate AND " +
            "b.checkOut >= :startDate")
    public List<Booking> findAcceptedBookings(@Param("accommodationId") Long accommodationId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

	public abstract List<Booking> findByAccommodationAndUser(Accommodation acc, User user);
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
           + " FROM Booking b WHERE b.accommodation.id = :accommodationId AND " + "(b.status = 'ACCEPTED' OR b.status = 'DOING') AND b.isUnavailability IS false")
    public List<BookingDTO> findByStatusACCEPTEDOrDOINGAndAccommodationId(@Param("accommodationId") Long accommodationId);

	@Query("SELECT new ws.peoplefirst.utumana.dto.BookingDTO(b.id,b.price,b.status,b.checkIn,b.checkOut,b.review.id, new ws.peoplefirst.utumana.dto.AccommodationDTO(b.accommodation.id, b.accommodation.title, b.accommodation.city, b.accommodation.mainPhotoUrl, b.accommodation.country)) "
	           + " FROM Booking b WHERE b.status != 'PENDING' AND b.status != 'REJECTED' AND b.accommodation.id = :id")
	List<BookingDTO> findNotPendingNotRejectedBookingsByAccommodationID(@Param("id") Long id);

	@Query("SELECT b FROM Booking as b WHERE b.status = 'PENDING' AND b.accommodation.id = :id")
	List<Booking> findPendingBookingsByAccommodationID(@Param("id") Long id);

	public List<Booking> findByStatusInAndAccommodationId(List<BookingStatus> list, Long accId);

	List<Booking> findByStatusInAndAccommodationIdAndUserId(List<BookingStatus> stats, Long accId, Long usrId);

}
