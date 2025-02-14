package ws.peoplefirst.utumana.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.Nullable;
import jakarta.persistence.PersistenceException;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@Service
public class BookingService {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private AccommodationService accommodationService;
	
	public Map<String,LocalDate> checkDate(String checkInString,String checkOutString) {
		if(checkInString.isBlank() || checkOutString.isBlank()) {
			log.error("checkDate checkInString is blank ?"+checkInString.isBlank()+" checkOutString is blank "+checkOutString.isBlank());
			throw new ForbiddenException("Please specify both check-in and check-out dates.");
		}
		
		LocalDate checkIn=JsonFormatter.parseStringIntoDate(checkInString);
		LocalDate checkOut = JsonFormatter.parseStringIntoDate(checkOutString);
		
		if(!checkIn.isBefore(checkOut)) {
			log.error("checkDate check in after check out this is not allowed");
			throw new ForbiddenException("Check-in date must come before the check-out date. The booking period must be at least one day.");
		}
		
		Map<String,LocalDate> returnedMap=new HashMap<String,LocalDate>();
		returnedMap.put("checkIn", checkIn);
		returnedMap.put("checkOut", checkOut);
		return returnedMap;
	}
	
	public List<Booking> findAllBookingsById(Long userId) {
		return bookingRepository.findAllByUserIdAndIsUnavailabilityIsFalseOrderByCheckInDesc(userId);
	}
	
	public List<BookingDTO> findAllBookingsDTOById(Long userId, @Nullable BookingStatus status) {
		User user=userService.findById(userId);
		if(user == null) {			
			log.warn("findAllBookingsDTOById user not found with id "+userId);
			throw new IdNotFoundException("User with id " + userId + " not found");
		}
		if(status == null) {
			return bookingRepository.findAllDTOByUserId(userId);
		} else {
			return bookingRepository.findByUserIdAndStatusDTO(userId, status);
		}
	}
	
	public List<BookingDTO> findAllHostBookingsDTO(Long userId) {
		User user=userService.findById(userId);
		if(user!=null) {			
			return bookingRepository.findAllDTOByOwnerId(userId);
		}
		else {
			log.warn("findAllHostBookingsDTO user not found with id "+userId);
			throw new IdNotFoundException("user with given id does not exist");
		}
	}
	
	public Booking hostActionOnBooking(Long bookingId,BookingStatus newStatus) {
		Optional<Booking> optionalBooking=bookingRepository.findById(bookingId);
		if(optionalBooking.isPresent()) {
			Booking booking= optionalBooking.get();
			booking.setTimestamp(LocalDateTime.now());
			
			if(booking.getStatus()==BookingStatus.DOING || booking.getStatus()==BookingStatus.DONE) {
				log.error("current booking status is "+booking.getStatus()+" changing it is not allowed");
				throw new ForbiddenException("you cannot change a doing or done booking");
			}
			
			booking.setStatus(newStatus);
			try {				
				bookingRepository.save(booking);
			}catch(PersistenceException e) {
				log.error("booking cannot be saved with id "+bookingId);
				throw new DBException("something wrong saving booking");
			}
			return booking;
		}else {
			log.error("hostActionOnBooking booking not found with id "+bookingId);
			throw new IdNotFoundException("booking not found");
		}

	}
	
	public BookingDTO bookAndReturnBooking(Long userId, Long accommodationId, LocalDate checkIn, LocalDate checkOut, double price) {
		User user = userService.getUserById(userId);
		Accommodation accommodation = accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
		
		if(user == null) {
			log.warn("bookAndReturnBooking user id not found "+userId);
			throw new IdNotFoundException("cannot find current user");
		}
			
		if(accommodation == null) {
			log.warn("bookAndReturnBooking accommodation id not found "+accommodationId);
			throw new IdNotFoundException("cannot find current accomodation");
		}
		
		Booking booking = new Booking();
		booking.setAccommodation(accommodation);
		booking.setUser(user);
		booking.setCheckIn(LocalDateTime.of(checkIn, LocalTime.of(14, 0)));
		booking.setCheckOut(LocalDateTime.of(checkOut, LocalTime.of(10, 0)));
		booking.setPrice(price);
		booking.setStatus(BookingStatus.PENDING);
		booking.setIsUnavailability(false);
		
		try {			
			Booking savedBooking= bookingRepository.save(booking);
			return JsonFormatter.fromBookingToBookingDTO(savedBooking);
		}catch(PersistenceException e) {
			throw new DBException("cannot save current booking");
		}
		
	}

	public boolean hasPendingBooking(Long userId, Long accommodationId) {
		return !bookingRepository.findByUserIdAndAccommodationIdAndStatus(userId, accommodationId, BookingStatus.PENDING).isEmpty();
	}
	
	public Long pendingBooking(Long userId, Long accommodationId) {
		List<Booking> pending = bookingRepository.findByUserIdAndAccommodationIdAndStatus(userId, accommodationId, BookingStatus.PENDING);
		return !pending.isEmpty() ? pending.get(0).getId() : null;
	}

	public Booking deleteBookingFromId(Long userId, Long bookingId) {
		Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
		
		if(optionalBooking.isPresent()) {
			Booking booking=optionalBooking.get();
			if(userId==booking.getUser().getId()) {
				if(booking.getStatus()==BookingStatus.ACCEPTED || booking.getStatus()==BookingStatus.PENDING) {
					try {
						bookingRepository.delete(booking);						
					}catch(IllegalArgumentException e) {
						log.error("deleteBookingFromId booking with id "+bookingId+"is null");
						throw new DBException("no booking to delete found");
					}catch(PersistenceException e) {
						log.warn("deleteBookingFromId cannot delete booking with id "+bookingId);
						throw new DBException("cannot delete current booking");
					}
					return booking;
				}else {
					log.warn("deleteBookingFromId cannot delete booking with id "+bookingId);
					throw new ForbiddenException("cannot dalete a done booking or an in progress one");
				}
			}else {
				log.warn("deleteBookingFromId your id is "+userId+" but the owner of the booking id is "+booking.getUser().getId());
				throw new ForbiddenException("you are not the owner of this booking");
			}
		}else {
			log.error("deleteBookingFromId booking with id "+bookingId+"does not exist");
			throw new IdNotFoundException("booking not present");
		}
	}
	
	public List<Booking> getExpiredBookings() {
		List<Booking> bookings = bookingRepository.findExpiredBookings(LocalDateTime.now());
		return bookings;
	}

	public List<Booking> getStartedBookings() {
		List<Booking> bookings = bookingRepository.findStartedBookings(LocalDateTime.now());
		return bookings;
	}

	public Booking findById(Long bookingId) {
		return bookingRepository.findById(bookingId).orElse(null);
	}
	
	//rest controller
	public List<BookingDTO> findUnavailabilities(Long accommodationId) {	
		Accommodation accoommodation=accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
		if(accoommodation!=null) {			
			return bookingRepository.findUnAvailabilities(accommodationId);
		}else {
			log.warn("findUnAvailabilities accommodation with id "+accommodationId+" not found");
			throw new IdNotFoundException("accommodation not found");
		}
	}
	
	public List<UnavailabilityDTO> findUnavailabilitiesDTO(Long accommodationId) {	
		Accommodation accoommodation=accommodationService.findById(accommodationId);
		if(accoommodation!=null) {			
			return bookingRepository.findUnAvailabilitiesDTO(accommodationId);
		}else {
			throw new IdNotFoundException("Accommodation with id " + accommodationId + " not found");
		}
	}
	
	public Booking deleteUnAvailabilities(Long userId,Long bookingId) {
		Optional<Booking> optionalBooking=bookingRepository.findById(bookingId);
		
		if(optionalBooking.isPresent()) {
			Booking booking=optionalBooking.get();
			
			if(!booking.getIsUnavailability()) {
				log.error("deleteUnAvailabilities unavailability with id "+bookingId+" is a normal booking and not an unavailability");
				throw new ForbiddenException("cannot delete a not unavailaiblity");
			}

			if(booking.getUser().getId()!=userId) {
				log.warn("deleteUnAvailabilities unavailability with id "+bookingId+" belongs to "+booking.getUser().getId()+" your id is "+userId);
				throw new ForbiddenException("cannot delete another user unavailability");
			}
			
			bookingRepository.delete(booking);
			return booking;
		}else {
			log.error("deleteUnAvailabilities unavailability with id "+bookingId+" not found");
			throw new IdNotFoundException("unavailability not found");
		}

	}

	public Booking addUnAvailabilities(Long userId,Availability unavailability) {System.out.println("AGGIUNGO UNAVAILABLITY \n\n\n\n");
		
		Booking selfBooking=new Booking();
		
		if(unavailability==null) {
			log.error("addUnAvailabilities the unavailability arrived null");
			throw new InvalidJSONException("wrong unavailability format");
		}
		
		if(unavailability.getStartDate()==null || unavailability.getEndDate()==null) {
			log.error("addUnAvailabilities unavailability.getStartDate() is null: "+ (unavailability.getStartDate()==null)+
					" unavailability.getEndDate() is null :"+(unavailability.getEndDate()==null));
			throw new InvalidJSONException("start date or end date of the current unavailability are null");
		}
		
		if(unavailability.getStartDate().isBefore(LocalDate.now())) {
			log.warn("start date "+unavailability.getStartDate()+" is before today "+ LocalDate.now());
			throw new ForbiddenException("cannot set a start date previos than today");
		}
		
		if(!unavailability.getStartDate().isBefore(unavailability.getEndDate())) {
			log.warn("addUnAvailabilities start date "+unavailability.getStartDate()+" is after "+ unavailability.getEndDate());
			throw new ForbiddenException("cannot set an end date previous than the star date");
		}
		selfBooking.setCheckIn(LocalDateTime.of(unavailability.getStartDate(), LocalTime.of(14, 0)));
		selfBooking.setCheckOut(LocalDateTime.of(unavailability.getEndDate(), LocalTime.of(10, 0)));
		selfBooking.setIsUnavailability(true);
		selfBooking.setPrice(0.0);
		selfBooking.setStatus(BookingStatus.ACCEPTED);
		selfBooking.setTimestamp(LocalDateTime.now());
		
		User loggedUser=userService.getUserWithBadges(userId);
		selfBooking.setUser(loggedUser);
		selfBooking.setUserId(userId);
		
		Accommodation accommodation=accommodationService.findByIdAndHidingTimestampIsNull(unavailability.getAccommodationId());
		if(accommodation.getOwnerId()!=userId) {
			log.error("addUnAvailabilities accommodation with id "+unavailability.getAccommodationId()+
					" belongs to "+accommodation.getOwnerId()+" your id is "+userId);
			throw new ForbiddenException("cannot set unavailability for another user accomodation");
		}
		selfBooking.setAccommodation(accommodation);
		
		//Lets retrieve the Booking that are considered to be valid:
		//if there will be some overlapping the operation won' t be allowed
		List<BookingDTO> occupiedBookings = this.bookingRepository.findNotPendingNotRejectedBookingsByAccommodationID(accommodation.getId());
		
		for(BookingDTO b : occupiedBookings) {
			if(checkIfDatesAreOverlapping(unavailability.getStartDate(), unavailability.getEndDate(), LocalDate.parse(b.getCheckIn(), DateTimeFormatter.ISO_DATE_TIME), LocalDate.parse(b.getCheckOut(), DateTimeFormatter.ISO_DATE_TIME))) {
				log.error("unavailability dates are overlapping with pre-existent lecit bookings" );
				throw new ForbiddenException("cannot set unavailability due to overlapping dates");
			}
		}
		
		//Now that the operation is considered legal lets REJECT all the Bookings that are PENDING:
		List<Booking> pendingBookings = this.bookingRepository.findPendingBookingsByAccommodationID(accommodation.getId());
		
		for(Booking b : pendingBookings) {
			if(checkIfDatesAreOverlapping(unavailability.getStartDate(), unavailability.getEndDate(), b.getCheckIn().toLocalDate(), b.getCheckOut().toLocalDate())) {
				b.setStatus(BookingStatus.REJECTED);
				this.bookingRepository.save(b);
			}
		}
		
		try {
			bookingRepository.save(selfBooking);
		}catch(PersistenceException e) {
			log.warn("cannot dave current unavailailability");
			throw new DBException("cannot dave current unavailailability");
		}
		return selfBooking;
	}

	private static boolean checkIfDatesAreOverlapping(LocalDate startDate, LocalDate endDate, LocalDate checkIn,
			LocalDate checkOut) {
		
		
		if((startDate.isEqual(checkIn) || endDate.isEqual(checkOut))) return true;
		
		if(startDate.isAfter(checkIn) && startDate.isBefore(checkOut)) return true;
		
		if(endDate.isAfter(checkIn) && endDate.isBefore(checkOut)) return true;
		
		return false;
	}

	public List<Booking> getAcceptedBookings(Long accommodationId, LocalDateTime now, LocalDateTime of) {
		return bookingRepository.getAcceptedBookings(accommodationId,now,of);
	}

	public Booking findByIdIfDONE(Long id) {
		return bookingRepository.findByIdAndStatus(id, BookingStatus.DONE);
	}

	public void save(Booking b) {
		bookingRepository.save(b);
	}

	/**
	 * 
	 * @param userId
	 * @param accommodationId
	 * @param checkIn
	 * @param checkOut
	 * @return
	 * 
	 * This method checks if a User has booked an Accommodation in the specified interval of time
	 */
	public boolean isBookingPresentAlreadyOrOverlapping(Long userId, Long accommodationId, LocalDate checkIn,
			LocalDate checkOut) {
		
		//Una volta presa la lista di bookings controlla se ci sono sovrapposizioni e nel caso ritorna TRUE
		User user = userService.findById(userId);
		Accommodation acc = accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
		
		if(user == null) throw new IdNotFoundException("The provided User ID is not Valid");
		if(acc == null) throw new IdNotFoundException("The provided Accommodation ID is not Valid");
		
		List<Booking> bookings = this.findByAccommodationAndUser(acc, user);
		
		for(Booking b : bookings) {
			
			LocalDate bChkIn = b.getCheckIn().toLocalDate();
			LocalDate bChkOut = b.getCheckOut().toLocalDate();
			
			
			if(bChkIn.equals(checkIn) || bChkOut.equals(checkOut)) return true;
			else if(checkOut.isAfter(bChkIn) && checkOut.isBefore(bChkOut)) return true;
			else if(checkIn.isAfter(bChkIn) && checkIn.isBefore(bChkOut)) return true;
			else if(checkIn.isAfter(bChkIn) && checkIn.isBefore(bChkOut) && checkOut.isAfter(bChkIn) && checkOut.isBefore(bChkOut)) {
				return true;
			}
			else {};
		}
		
		
		return false;
	}

	private List<Booking> findByAccommodationAndUser(Accommodation acc, User user) {
		return bookingRepository.findByAccommodationAndUser(acc, user);
	}
	
	public List<BookingDTO> getAllAcceptedOrDoingBookings(Long accommodationId) {
		return bookingRepository.findByStatusACCEPTEDOrDOINGAndAccommodationId(accommodationId);
	}
}
