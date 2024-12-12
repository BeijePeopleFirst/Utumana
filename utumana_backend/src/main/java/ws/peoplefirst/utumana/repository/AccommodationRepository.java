package ws.peoplefirst.utumana.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.SortedMap;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.model.Service;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation,Long>{
	
	@Query(value = "SELECT a FROM Accommodation AS a WHERE a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL ORDER BY a.approvalTimestamp DESC")
	public List<Accommodation> getLatestUploads(Pageable pageable);
	
	// https://www.javaguides.net/2023/08/spring-data-jpa-specific-columns.html
	@Query(value = "SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) "
			+ "FROM Accommodation as a WHERE a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL ORDER BY a.approvalTimestamp DESC")
	public List<AccommodationDTO> getLatestUploadsDTO(Pageable pageable);
	

	@Query(value = "SELECT EXISTS (SELECT * FROM couch_surfing.favourite WHERE accommodation_id = :accommodationId AND user_id = :userId)", nativeQuery = true)
	public int isFavourite(@Param(value = "accommodationId") Long accommodationId, @Param(value = "userId") Long userId);
	
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) " 
			+ "FROM Accommodation a WHERE a.hidingTimestamp IS NULL AND a.id IN (SELECT f.id FROM User u JOIN u.favourites f WHERE u.id = :userId)")
	public List<AccommodationDTO> getFavouritesDTO( @Param(value = "userId") Long userId);

	
	@Query(value="SELECT DISTINCT a FROM Accommodation as a "
			+ "WHERE (:dest IS NULL OR a.country LIKE %:dest% OR a.city LIKE %:dest%) AND a.beds >= :numGuests AND a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL "
			+ "AND EXISTS (SELECT av FROM a.availabilities AS av WHERE av.startDate <= :chkIn AND av.endDate >= :chkOut)")	
	public List<Accommodation> findByUserInput(
			@Param(value="dest") String destination, 
			@Param(value="chkIn") LocalDate checkInDate, 
			@Param(value="chkOut") LocalDate checkOutDate,
			@Param(value="numGuests") Integer numberOfGuests,
			Sort sort
		);

	
	@Query(value="SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) "
			+ " from Accommodation AS a WHERE (:dest IS NULL OR a.country LIKE %:dest% OR a.city LIKE %:dest%) AND "
			+ "a.beds >= :numGuests AND a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL "
			+ "AND a.id IN (SELECT av.accommodation.id FROM Availability AS av WHERE "
			+ "av.startDate <= :chkIn AND av.endDate >= :chkOut )")	
	public List<AccommodationDTO> findByUserInputDTO(@Param(value="dest") String destination, @Param(value="chkIn") LocalDate checkInDate, 
			@Param(value="chkOut") LocalDate checkOutDate, @Param(value="numGuests") Integer numberOfGuests, Sort sort);
	
	
	@Query(value="SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) "
			+ "FROM Accommodation AS a "
			+ "WHERE (:dest IS NULL OR a.country LIKE %:dest% OR a.city LIKE %:dest%) AND "
			+ "a.beds >= :numGuests AND a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL "
			+ "AND a.id IN (SELECT av.accommodation.id FROM Availability AS av WHERE "
			+ "av.startDate <= :chkIn AND av.endDate >= :chkOut ) "
			+ "AND (SELECT COUNT(DISTINCT s.id) FROM a.services AS s WHERE s.id IN :services) = :servicesSize")
	public List<AccommodationDTO> findByUserInputDTOWithServices(@Param(value="dest") String destination, @Param(value="chkIn") LocalDate checkInDate,
			@Param(value="chkOut") LocalDate checkOutDate, @Param(value="numGuests") Integer numberOfGuests, 
			@Param(value="services") List<Long> serviceIds, @Param(value="servicesSize") Long servicesSize, Sort sort);
		
	
	public List<Accommodation> findAllByapprovalTimestampIsNull();
	
	
	public Accommodation findByIdAndHidingTimestampIsNull(Long id); 


	@Query("SELECT MAX(a.id) FROM Accommodation as a")
	public Long getAccommodationMaxId();


	@Modifying
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Query(value = "INSERT INTO photo (accommodation_id, photo_url, `order`) VALUES (:id, :url, :order)", nativeQuery = true)
	public void savePhoto(
			
			@Param(value = "id") Long idAcc, 
			@Param(value = "url") String url, 
			@Param(value = "order") Integer order
			
		);


	public List<Accommodation> findByOwnerIdAndTitleAndDescriptionAndBedsAndRoomsAndAddressNotesAndCapAndCityAndCountryAndProvinceAndStreetAndStreetNumberAndHidingTimestampIsNull(
			
			Long ownerId,
			String title,
			String description,
			Integer beds,
			Integer rooms,
			String addressNotes, 
			String cap, 
			String city, 
			String country, 
			String province, 
			String street, 
			String streetNumber
			
		);
	
	
	public List<Accommodation> findByOwnerIdAndHidingTimestampIsNull(Long ownerId);


	@Deprecated		// use the one in ServiceRepository
	@Query("SELECT s FROM Service as s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :name, '%'))")
	public List<Service> findServiceByName(@Param(value = "name") String name);


	@Query(value="SELECT DISTINCT a FROM Accommodation as a "
			+ "WHERE (:dest IS NULL OR a.country LIKE %:dest% OR a.city LIKE %:dest%) AND a.beds >= :numGuests AND a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL "
			+ "AND EXISTS (SELECT av FROM a.availabilities AS av WHERE av.startDate <= :chkIn AND av.endDate >= :chkOut  AND av.pricePerNight = 0 )")
	public List<Accommodation> findByUserInputFree(	@Param(value="dest") String dest, @Param(value="chkIn") LocalDate checkInDate, 
			@Param(value="chkOut") LocalDate checkOutDate, @Param(value="numGuests") Integer numGst, Sort sort);
	
	
	@Query(value="SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) "
			+ " FROM Accommodation AS a WHERE (:dest IS NULL OR a.country LIKE %:dest% OR a.city LIKE %:dest%) AND "
			+ "a.beds >= :numGuests AND a.approvalTimestamp IS NOT NULL AND a.hidingTimestamp IS NULL "
			+ "AND a.id IN (SELECT av.accommodation.id FROM Availability as av WHERE "
			+ "av.startDate <= :chkIn AND av.endDate >= :chkOut AND av.pricePerNight = 0)")	
	public List<AccommodationDTO> findByUserInputFreeDTO(@Param(value="dest") String destination, @Param(value="chkIn") LocalDate checkInDate, 
			@Param(value="chkOut") LocalDate checkOutDate, @Param(value="numGuests") Integer numberOfGuests, Sort sort);


	@Query("SELECT a FROM Accommodation as a WHERE a.approvalTimestamp IS NULL")
	public List<Accommodation> getAccommodationsToBeApproved();


//	@Query("SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) FROM Accommodation as a where a.approvalTimestamp IS NULL")
//	public List<AccommodationDTO> getAccommodationDTOToBeApproved();
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) "
			+ "FROM Accommodation as a WHERE a.approvalTimestamp IS NULL")
	public List<AccommodationDTO> getAccommodationDTOToBeApproved();


	@Query("SELECT new ws.peoplefirst.utumana.dto.AccommodationDTO(a.id, a.title, a.city, a.mainPhotoUrl, a.country) FROM Accommodation as a "
			+ "WHERE a.ownerId = :ownerId AND a.hidingTimestamp IS NULL")
	public List<AccommodationDTO> findByOwnerIdDTO(@Param(value = "ownerId") Long loggedUserId);

}