package ws.peoplefirst.utumana.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability,Long>{

	@Query("SELECT MAX(a.id) FROM Availability as a")
	public Long getMaxIndex();
	
	@Query("SELECT MIN(av.pricePerNight) FROM Availability as av WHERE av.accommodation.id = :accommodationId GROUP BY av.accommodation.id")
	public Double getMinPricePerNight(@Param(value = "accommodationId") Long accommodationId);

	@Query("SELECT MAX(av.pricePerNight) FROM Availability as av WHERE av.accommodation.id = :accommodationId GROUP BY av.accommodation.id")
	public Double getMaxPricePerNight(@Param(value = "accommodationId") Long accommodationId);

	public List<Availability> findByAccommodation(Accommodation base);
	
	public List<Availability> findByAccommodationId(Long accommodationId);
	
    @Query("SELECT av FROM Availability av WHERE " +
            "av.accommodation.id = :accommodationId AND " +
            "av.startDate <= :endDate AND " +
            "av.endDate >= :startDate")
    public List<Availability> findByAccommodationIdAndDateRange( @Param("accommodationId") Long accommodationId, @Param("startDate") LocalDate startDate,@Param("endDate") LocalDate endDate);
}
