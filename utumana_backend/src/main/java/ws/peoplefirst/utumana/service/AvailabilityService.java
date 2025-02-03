package ws.peoplefirst.utumana.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.repository.AccommodationRepository;
import ws.peoplefirst.utumana.repository.AvailabilityRepository;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@Service
public class AvailabilityService {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AvailabilityRepository availabilityRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private AccommodationRepository accommodationRepository;

	
	// returns date >= start and date <= end
	public boolean isBetweenIncluded(LocalDate date, LocalDate start, LocalDate end) {
		return !date.isBefore(start) && !date.isAfter(end);
	}
	
	// returns dateTIME >= start and dateTIME <= end
	public boolean isBetweenIncluded(LocalDateTime date, LocalDateTime start, LocalDateTime end) {
		return !date.isBefore(start) && !date.isAfter(end);
	}

	public List<Availability> findAvailabilities(Long accommodationId, String checkInString, String checkOutString) {		

		LocalDate checkIn = JsonFormatter.parseStringIntoDate(checkInString);
		LocalDate checkOut = JsonFormatter.parseStringIntoDate(checkOutString);
		
		if(checkIn.isBefore(LocalDate.now())) {
			log.warn("start date "+checkIn+" is before today "+ LocalDate.now());
			throw new ForbiddenException("cannot set a start date previos than today");
		}
		
		return findAvailabilities(accommodationId, checkIn, checkOut);
	}
	
	public List<Availability> findAvailabilities(Long accommodationId, LocalDate checkIn, LocalDate checkOut) {
		Accommodation accommodation = accommodationRepository.findById(accommodationId).orElse(null);
		LocalDate checkInCopy = checkIn;
		List<Availability> availabilities = new ArrayList<Availability>();
		for(Availability availability : accommodation.getAvailabilities()) {
			if(!checkIn.isBefore(availability.getStartDate()) && !checkOut.isAfter(availability.getEndDate())) {
				availabilities.add(availability);
				break;
			}else if(!checkIn.isBefore(availability.getStartDate()) && !checkIn.isAfter(availability.getEndDate())){
				availabilities.add(availability);
				checkIn = availability.getEndDate();
			}
		}
		
		if(availabilities.isEmpty() || checkOut.isAfter(availabilities.get(availabilities.size()-1).getEndDate())) {
			return null;
		}
		
		
		List<Booking> acceptedBookings = bookingRepository.getAcceptedBookings(accommodationId, LocalDateTime.now(), LocalDateTime.of(checkOut, LocalTime.of(10, 0)));
		for(Booking booking : acceptedBookings) {
			if(isBetweenIncluded(LocalDateTime.of(checkInCopy, LocalTime.of(14, 0)), booking.getCheckIn(), booking.getCheckOut())){
				return null;
			} else if(checkInCopy.isBefore(booking.getCheckIn().toLocalDate()) && checkOut.isAfter(booking.getCheckIn().toLocalDate())){
				return null;
			}
		}	
		return availabilities;
	}

	public double calculatePrice(List<Availability> availabilities, LocalDate checkIn, LocalDate checkOut) {
		double price = 0;
		for(LocalDate currentDate = checkIn; currentDate.isBefore(checkOut); currentDate = currentDate.plusDays(1)) {
			for(Availability availability : availabilities) {
				if(isBetweenIncluded(currentDate, availability.getStartDate(), availability.getEndDate())) {
					price += availability.getPricePerNight();
					break;
				}
			}
		}
		
		return price;
	}

	public void deleteAvailabilities(List<Availability> avs) {
		for(Availability a : avs)
			availabilityRepository.delete(a);
	}

	public List<Availability> findByAccommodation(Accommodation base) {
		return availabilityRepository.findByAccommodation(base);
	}
	
	public Page<Availability> findByAccommodationId(Long accommodationId, Pageable pageable) {
		return availabilityRepository.findByAccommodationId(accommodationId, pageable);
	}
	
	public Map<LocalDate, Double> findAvailableDatesByMonth(Long accommodationId, String startDateString,  String endDateString) {
		LocalDate startDate = JsonFormatter.parseStringIntoDate(startDateString);
		LocalDate endDate = JsonFormatter.parseStringIntoDate(endDateString);    
		
		Map<LocalDate, Double> availableDates = new HashMap<>();
		    
	    List<Availability> availabilities = findByAccommodationIdAndDateRange(accommodationId, startDate, endDate);

	    List<Booking> acceptedBookings = bookingRepository.findAcceptedBookings(accommodationId, LocalDateTime.of(startDate, LocalTime.of(14, 0)), LocalDateTime.of(endDate, LocalTime.of(10, 0)));
	    
	    
	    for (Availability av : availabilities) {
	        LocalDate currentDate = av.getStartDate();
	        while (!currentDate.isAfter(av.getEndDate()) && !currentDate.isAfter(endDate)) {
	            if (isDateAvailable(LocalDateTime.of(currentDate, LocalTime.of(18, 0)), acceptedBookings)) {
	                availableDates.put(currentDate, av.getPricePerNight());
	            }
	            currentDate = currentDate.plusDays(1);
	        }
	    }
	    
	    return availableDates;
	}

	private boolean isDateAvailable(LocalDateTime date, List<Booking> acceptedBookings) {
		for(Booking b: acceptedBookings) {

			if(date.isAfter(b.getCheckIn()) && date.isBefore(b.getCheckOut())) {
				return false;
			}
		}
		return true;
	}
	
	public List<Availability> findByAccommodationIdAndDateRange(Long accommodationId, LocalDate startDate, LocalDate endDate) {
		return availabilityRepository.findByAccommodationIdAndDateRange(accommodationId, startDate, endDate);
	}


}
