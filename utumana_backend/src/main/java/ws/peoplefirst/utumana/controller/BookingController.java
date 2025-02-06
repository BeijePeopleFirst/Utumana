package ws.peoplefirst.utumana.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.service.AvailabilityService;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;
import ws.peoplefirst.utumana.utility.BookingStatus;
import ws.peoplefirst.utumana.utility.JsonFormatter;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value="/api")
public class BookingController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private BookingService bookingService;

	@Autowired
	private AvailabilityService availabilityService;

	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/myBookingGuest")
	public List<BookingDTO> openBookingGuest(Authentication auth){

		log.debug("GET /myBookingGuest");

		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);

		List<BookingDTO> allBookings = bookingService.findAllBookingsDTOById(userDTO.getId());

		allBookings.sort(Comparator.comparing(BookingDTO::getCheckIn));
		return allBookings;
	}

	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/myBookingHost")
	public List<BookingDTO> openBookingHost(Authentication auth){

		log.debug("GET /myBookingHost");

		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);

		List<BookingDTO> allBookings=bookingService.findAllHostBookingsDTO(userDTO.getId());
		Collections.sort(allBookings, Comparator.comparing(BookingDTO::getCheckIn));
		return allBookings;
	}

	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/manage_booking/{booking_id}/approve")
	public Booking manageBookingAppove(Authentication auth,
									   @PathVariable(name = "booking_id") Long bookingId) {

		log.debug("PATCH /manage_booking/{booking_id}/approve");

		Booking savedBooking=bookingService.hostActionOnBooking(bookingId,BookingStatus.ACCEPTED);
		return savedBooking;
	}

	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/manage_booking/{booking_id}/reject")
	public Booking manageBookingReject(Authentication auth,
									   @PathVariable(name = "booking_id") Long bookingId) {

		log.debug("PATCH /manage_booking/{booking_id}/reject");

		Booking savedBooking=bookingService.hostActionOnBooking(bookingId,BookingStatus.REJECTED);
		return savedBooking;
	}

	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping(value = "/delete_booking/{booking_id}")
	public BookingDTO deleteBooking(Authentication auth,
									@PathVariable(name = "booking_id") Long bookingId) {

		log.debug("DELETE /delete_booking/{booking_id}");

		UserDTO userDTO = AuthorizationUtility.getUserFromAuthentication(auth);
		Booking deletedBooking = bookingService.deleteBookingFromId(userDTO.getId(), bookingId);
		if (deletedBooking != null) {
			return JsonFormatter.fromBookingToBookingDTO(deletedBooking);
		} else {
			throw new DBException("cannot delete current booking");
		}
	}

	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/calculate_price/{accommodation_id}")
	public double CalculatePrice(@PathVariable(name="accommodation_id") Long accommodationId,
								 @RequestParam(name = "checkIn") String checkInString,
								 @RequestParam(name = "checkOut") String checkOutString) {

		log.debug("GET /manage_booking/{booking_id}/approve");

		Map<String, LocalDate> dateMap = bookingService.checkDate(checkInString, checkOutString);

		LocalDate checkIn = dateMap.get("checkIn");
		LocalDate checkOut = dateMap.get("checkOut");

		List<Availability> availabilities = availabilityService.findAvailabilities(accommodationId, checkInString, checkOutString);
		if(availabilities == null) throw new ForbiddenException("Not available in this period");
		double price = availabilityService.calculatePrice(availabilities, checkIn, checkOut);

		return price;
	}

	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value = "/book/{accommodation_id}")
	public BookingDTO bookAccommodation(Authentication auth,
										@PathVariable(name = "accommodation_id") Long accommodationId,
										@RequestParam(name = "checkIn") String checkInString,
										@RequestParam(name = "checkOut") String checkOutString) {

		log.debug("POST /book/{accommodation_id}");

		UserDTO loggedUser=AuthorizationUtility.getUserFromAuthentication(auth);
		Map<String,LocalDate> dateMap=bookingService.checkDate(checkInString, checkOutString);

		LocalDate checkIn = dateMap.get("checkIn");
		LocalDate checkOut = dateMap.get("checkOut");

		boolean doneAlready = bookingService.isBookingPresentAlreadyOrOverlapping(loggedUser.getId(), accommodationId, checkIn, checkOut);
		if(doneAlready) throw new ForbiddenException("You have booked this Accommodation in the same period of time (or an overlapping one) already");

		List<Availability> availabilities = availabilityService.findAvailabilities(accommodationId, checkInString, checkOutString);
		if(availabilities == null) {
			throw new ForbiddenException("This accommodation is not available in the period selected.");
		}

		double price = availabilityService.calculatePrice(availabilities, checkIn, checkOut);


		BookingDTO booking=bookingService.bookAndReturnBooking(loggedUser.getId(), accommodationId, checkIn, checkOut, price);
		if(booking==null) {
			log.warn("bookAccommodation booking for accommodation "+accommodationId+ "from user +"+loggedUser.getId()+ "is null");
			throw new ForbiddenException("Error: could not complete booking request. Please retry.");
		}

		return booking;
	}

	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/unavailabilities/{accommodation_id}")
	public List<BookingDTO> getUnavailabilityList(Authentication auth,
												  @PathVariable(name = "accommodation_id") Long accommodationId) {

		log.debug("GET /unavailabilities/{accommodation_id}");
		return bookingService.findUnavailabilities(accommodationId);
	}

	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value = "/add_unavailability")
	public Booking addUnavilability(Authentication auth,
									@RequestBody Availability unavailability) {

		log.debug("POST /add_unavailability");

		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		return bookingService.addUnAvailabilities(userDTO.getId(),unavailability);
	}

	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping(value = "/delete_unavailability/{booking_id}")
	public Booking deleteUnavilability(Authentication auth,
									   @PathVariable(name = "booking_id") Long bookingId) {

		log.debug("DELETE /delete_unavailability/{booking_id}");

		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		return bookingService.deleteUnAvailabilities(userDTO.getId(),bookingId);
	}

	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/booking/{id}")
	public Booking getSingleDONEBookingById(@PathVariable(name="id") Long id, Authentication auth) {
		return bookingService.findByIdIfDONE(id);
	}

	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/booking_assign_review/{id}")
	public Booking assignReviewToBooking(@PathVariable(name="id") Long id, @RequestBody(required = true) Booking booking, Authentication auth) {

		Booking b = bookingService.findByIdIfDONE(id);

		if(b.getId() != booking.getId()) throw new InvalidJSONException("The bookings must correspond");
		if(b.getUserId() != booking.getUserId()) throw new ForbiddenException("Error: could not complete booking request because you have no privileges");
		AuthorizationUtility.checkIsAdminOrMe(auth, b.getUserId());

		Review r = booking.getReview();
		b.setReview(r);

		bookingService.save(b);
		return b;
	}

}
