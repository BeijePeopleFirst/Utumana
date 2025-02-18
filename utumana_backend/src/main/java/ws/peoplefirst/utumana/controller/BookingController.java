package ws.peoplefirst.utumana.controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
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

@RestController
@RequestMapping(value="/api")
@Tag(name = "Bookings", description = "Endpoints for bookings operations")
public class BookingController {
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private BookingService bookingService;
	
	@Autowired
	private AvailabilityService availabilityService;
	
	@Operation(summary = "Get bookings made by the current user as guest", description = "Get all bookings where the guest is the current user. Returns a list of Booking DTOs. If the parameter status is present, filters the list to return only the bookings with the given status.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking DTO's list returned successfully, ordered by check-in timestamp.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = BookingDTO.class)))),
            @ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "404", description = "User does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/myBookingGuest")
	public List<BookingDTO> openBookingGuest(Authentication auth,
			@Parameter(description = "status of the bookings to return", example = "'PENDING'") 
			@RequestParam(name = "status", required = false) BookingStatus status){
		
		log.debug("GET /myBookingGuest");
		
		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		
		List<BookingDTO> allBookings=bookingService.findAllBookingsDTOById(userDTO.getId(), status);
		Collections.sort(allBookings, Comparator.comparing(BookingDTO::getCheckIn));
		return allBookings;
	}
	
	@Operation(summary = "Get bookings received by the current user as the host", description = "Get all bookings where the host and owner of the associated accommodation is the current user. Returns a list of Booking DTOs.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking DTO's list returned successfully, ordered by check-in timestamp.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = BookingDTO.class)))),
            @ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "404", description = "User does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/myBookingHost")
	public List<BookingDTO> openBookingHost(Authentication auth){
		
		log.debug("GET /myBookingHost");
		
		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		
		List<BookingDTO> allBookings=bookingService.findAllHostBookingsDTO(userDTO.getId());
		Collections.sort(allBookings, Comparator.comparing(BookingDTO::getCheckIn));
		return allBookings;
	}

	@Operation(summary = "Approve a booking", description = "Approve a booking you received as the host and owner of the associated accommodation. Returns the booking updated with the 'ACCEPTED' status and the approval timestamp.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking approved successfully. Returns the booking updated with the 'ACCEPTED' status and the approval timestamp.",
                    content = @Content(schema = @Schema(implementation = Booking.class))),
            @ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "You cannot approve this booking. The booking is already ongoing or done (status is 'DOING' or 'DONE'), or you are not the host and owner of the accommodation associated with this booking.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking with given ID does not exist.", content = @Content),
            @ApiResponse(responseCode = "503", description = "The booking could not be saved in the database due to an unexpected error", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/manage_booking/{booking_id}/approve")
	public Booking manageBookingAppove(Authentication auth,
			@Parameter(description = "ID of the booking to approve", example = "1") 
			@PathVariable(name="booking_id")Long bookingId){
		
		log.debug("PATCH /manage_booking/{booking_id}/approve");
		
		UserDTO userDTO = AuthorizationUtility.getUserFromAuthentication(auth);
		Booking savedBooking=bookingService.hostActionOnBooking(bookingId,BookingStatus.ACCEPTED, userDTO.getId());
		return savedBooking;
	}
	
	@Operation(summary = "Reject a booking", description = "Reject a booking you received as the host and owner of the associated accommodation. Returns the booking updated with the 'REJECTED' status.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking rejected successfully. Returns the booking updated with the 'REJECTED' status.",
                    content = @Content(schema = @Schema(implementation = Booking.class))),
            @ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "You cannot reject this booking. The booking is already ongoing or done (status is 'DOING' or 'DONE'), or you are not the host and owner of the accommodation associated with this booking.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking with given ID does not exist.", content = @Content),
            @ApiResponse(responseCode = "503", description = "The booking could not be saved in the database due to an unexpected error", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/manage_booking/{booking_id}/reject")
	public Booking manageBookingReject(Authentication auth,
			@Parameter(description = "ID of the booking to reject", example = "1") 
			@PathVariable(name="booking_id")Long bookingId){
		
		log.debug("PATCH /manage_booking/{booking_id}/reject");
	
		UserDTO userDTO = AuthorizationUtility.getUserFromAuthentication(auth);
		Booking savedBooking=bookingService.hostActionOnBooking(bookingId, BookingStatus.REJECTED, userDTO.getId());
		return savedBooking;
	}
	
	@Operation(summary = "Delete a booking", description = "Reject a booking you received as the host and owner of the associated accommodation. Returns the booking updated with the 'REJECTED' status.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking deleted successfully. Returns the booking DTO.",
                    content = @Content(schema = @Schema(implementation = BookingDTO.class))),
            @ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "You cannot delete this booking. The booking is already ongoing or done (status is 'DOING' or 'DONE'), or you are not the host and owner of the accommodation associated with this booking.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Booking with given ID does not exist.", content = @Content),
            @ApiResponse(responseCode = "503", description = "The booking could not be deleted from the database due to an unexpected error", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping(value = "/delete_booking/{booking_id}")
	public BookingDTO deleteBooking(Authentication auth,
			@Parameter(description = "ID of the booking to delete", example = "1") 
			@PathVariable(name="booking_id") Long bookingId) {
		
		log.debug("DELETE /delete_booking/{booking_id}");

			UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
			Booking deletedBooking=bookingService.deleteBookingFromId(userDTO.getId(), bookingId);
			if(deletedBooking!=null) {
				return JsonFormatter.fromBookingToBookingDTO(deletedBooking);
			}else {
				throw new DBException("cannot delete current booking");
			}
	}
	
	@Operation(summary = "Calculate price", description = "Calculate the price of a booking based on the check-in and check-out dates.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Price calculated successfully. Returns the calculated price.",
                    content = @Content(schema = @Schema(implementation = double.class), examples = @ExampleObject(value = "10.50"))),
            @ApiResponse(responseCode = "403", description = "Check-in date or check-out date is null, or check-out date is before check-in date, or the accommodation is not available in the period selected", content = @Content),
            @ApiResponse(responseCode = "404", description = "Accommodation with given ID does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/calculate_price/{accommodation_id}")
	public double calculatePrice(
			@Parameter(description = "ID of the accommodation", example = "1") 
			@PathVariable(name="accommodation_id") Long accommodationId,
			@Parameter(description = "Check-in date in format yyyy-MM-dd", example = "2024-01-01")
			@RequestParam(name = "checkIn") String checkInString,
			@Parameter(description = "Check-out date in format yyyy-MM-dd", example = "2024-01-08")
			@RequestParam(name = "checkOut") String checkOutString) {
		
		log.debug("GET /calculate_price/{accommodation_id}");
		
		Map<String,LocalDate> dateMap=bookingService.checkDate(checkInString, checkOutString);
	
		LocalDate checkIn = dateMap.get("checkIn");
		LocalDate checkOut = dateMap.get("checkOut");
		
		List<Availability> availabilities = availabilityService.findAvailabilities(accommodationId, checkInString, checkOutString);
		if(availabilities == null) throw new ForbiddenException("Not available in this period");
		double price = availabilityService.calculatePrice(availabilities, checkIn, checkOut);
		
		return price;
	}
	
	@Operation(summary = "Book an accommodation", description = "Book an accommodation for the period between the check-in and check-out dates. The booking is pending until the host accepts or rejects it.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking successful. Returns the booking details.",
                    content = @Content(schema = @Schema(implementation = BookingDTO.class), examples = @ExampleObject(value = "{ \"id\": 1, \"accommodationDTO\": { \"id\": 1, \"title\": \"Comfortable couch\", \"city\": \"Milano\", \"province\": \"MI\", \"country\": \"Italia\", \"mainPhotoUrl\": \"images/house1.jpg\", \"min_price\": 0.00, \"max_price\": 50.00, \"is_favourite\": false, \"rating\": 4.5}, \"checkIn\": \"2024-01-01T14:00:00\", \"checkOut\": \"2024-01-08T10:00:00\", \"price\": 0.00, \"status\": \"PENDING\" }"))),
			@ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Check-in date or check-out date is null, or check-out date is before check-in date, or the accommodation is not available/already booked in the period selected", content = @Content),
            @ApiResponse(responseCode = "404", description = "Accommodation with given ID does not exist, or logged user does not exist.", content = @Content),
			@ApiResponse(responseCode = "503", description = "The booking could not be created due to an unexpected error with the database", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value = "/book/{accommodation_id}")
	public BookingDTO bookAccommodation(Authentication auth,
			@Parameter(description = "ID of the accommodation", example = "1") 
			@PathVariable(name="accommodation_id") Long accommodationId,
			@Parameter(description = "Check-in date in format yyyy-MM-dd", example = "2024-01-01")
			@RequestParam(name = "checkIn") String checkInString,
			@Parameter(description = "Check-out date in format yyyy-MM-dd", example = "2024-01-08")
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
	
	// Unless you specifically need a BookingDTO, you want to use the method getAccommodationUnavailabilitiesDTO in AccommodationController
	@Operation(summary = "Get the unavailability periods of an accommodation", description = "Get the unavailability periods of an accommodation. Returns a list of BookingDTOs. Unless you specifically need a list of BookingDTOs, please use the method getAccommodationUnavailabilitiesDTO in AccommodationController instead, which returns a list of UnavailabilityDTOs.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking successful. Returns the booking details.",
                    content = @Content(array = @ArraySchema( schema = @Schema(implementation = BookingDTO.class)), examples = @ExampleObject(value = "[{ \"id\": 1, \"accommodationDTO\": { \"id\": 1, \"title\": \"Comfortable couch\", \"city\": \"Milano\", \"province\": \"MI\", \"country\": \"Italia\", \"mainPhotoUrl\": \"images/house1.jpg\", \"min_price\": 0.00, \"max_price\": 50.00, \"is_favourite\": false, \"rating\": 4.5}, \"checkIn\": \"2024-01-01T14:00:00\", \"checkOut\": \"2024-01-08T10:00:00\", \"price\": 0.00, \"status\": \"ACCEPTED\" }]"))),
            @ApiResponse(responseCode = "404", description = "Accommodation with given ID does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/unavailabilities/{accommodation_id}")
	public List<BookingDTO> getUnavailabilityList(Authentication auth,
			@Parameter(description = "ID of the accommodation", example = "1") 
			@PathVariable(name="accommodation_id") Long accommodationId) {
				
		log.debug("GET /unavailabilities/{accommodation_id}");
		return bookingService.findUnavailabilities(accommodationId);
	}
	
	@Operation(summary = "Add an unavailability period to an accommodation", description = "Add an unavailability period to an accommodation. Returns the unavalibility details as an UnavailabilityDTO.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unavailability added successfully. Returns the unavailability details in an UnavailabilityDTO.", content = @Content(schema = @Schema(implementation = UnavailabilityDTO.class))),
			@ApiResponse(responseCode = "400", description = "Unavailability or its start or end dates are null, or logged user's info not found", content = @Content),
			@ApiResponse(responseCode = "403", description = "Unavailability's start is before today's date, or the end date is before the start date, or logged user's info not found, or logged user is not the owner of the accommodation associated with this unavailability", content = @Content),
            @ApiResponse(responseCode = "404", description = "Accommodation with given ID does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value = "/add_unavailability")
	public UnavailabilityDTO addUnavilability(Authentication auth,
		@io.swagger.v3.oas.annotations.parameters.RequestBody(
			description = "period of unavailability", required = true,
			content = @Content(mediaType = "application/json",
			schema = @Schema(implementation = Availability.class),
			examples = @ExampleObject(value = "{ \"start_date\": \"2024-12-20\", \"end_date\": \"2024-12-27\", \"accommodation_id\": 1 }")))
		@RequestBody Availability unavailability) {
				
		log.debug("POST /add_unavailability");
		
		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		return bookingService.addUnAvailability(userDTO.getId(), unavailability);
	}
	
	@Operation(summary = "Delete an unavailability period from an accommodation", description = "Delete an unavailability period from an accommodation. Returns the unavalibility details as an UnavailabilityDTO.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Unavailability deleted successfully. Returns the unavailability details in an UnavailabilityDTO.", content = @Content(schema = @Schema(implementation = UnavailabilityDTO.class))),
			@ApiResponse(responseCode = "400", description = "Logged user's info not found", content = @Content),
			@ApiResponse(responseCode = "403", description = "The unavailability with given ID is actually not an unavailability but is a normal booking, or logged user's info not found, or logged user is not the owner of the accommodation associated with this unavailability", content = @Content),
            @ApiResponse(responseCode = "404", description = "Unavailability with given ID does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping(value = "/delete_unavailability/{booking_id}")
	public UnavailabilityDTO deleteUnavilability(Authentication auth,
			@Parameter(description = "ID of the unavailability (booking)", example = "1") 
			@PathVariable(name="booking_id") Long bookingId) {
				
		log.debug("DELETE /delete_unavailability/" + bookingId);
		
		UserDTO userDTO=AuthorizationUtility.getUserFromAuthentication(auth);
		return bookingService.deleteUnAvailability(userDTO.getId(),bookingId);
	}
	
	@Operation(summary = "Get a past booking by its ID", description = "Get a past booking (status = 'DONE') by its ID.", tags = { "Bookings" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking found successfully.", content = @Content(schema = @Schema(implementation = Booking.class), examples = @ExampleObject(value = "{\r\n  \"id\": 1,\r\n  \"accommodation\": {\r\n" + //
								"    \"id\": 0,\r\n    \"title\": \"string\",\r\n    \"description\": \"string\",\r\n" + //
								"    \"beds\": 0,\r\n    \"rooms\": 0,\r\n    \"street\": \"string\",\r\n" + //
								"    \"city\": \"string\",\r\n    \"cap\": \"string\",\r\n    \"province\": \"string\",\r\n"+
								"    \"country\": \"string\",\r\n    \"coordinates\": \"string\",\r\n    \"services\": [\r\n" + //
								"      {\r\n        \"id\": 0,\r\n        \"title\": \"string\",\r\n        \"icon_url\": \"string\"\r\n" + //
								"      }\r\n    ],\r\n" + //
								"    \"photos\": [\r\n      {\r\n        \"id\": 0,\r\n        \"order\": 0,\r\n" + //
								"        \"photo_url\": \"string\"\r\n      }\r\n    ],\r\n" + //
								"    \"availabilities\": [\r\n      {\r\n        \"id\": 0,\r\n        \"start_date\": \"string\",\r\n" + //
								"        \"end_date\": \"string\",\r\n        \"price_per_night\": 0,\r\n        \"accommodation_id\": 0\r\n" + //
								"      }\r\n    ],\r\n    \"rating\": {\r\n      \"accommodationId\": 0,\r\n      \"rating\": 0\r\n    },\r\n" + //
								"    \"owner_id\": 0,\r\n    \"street_number\": \"string\",\r\n    \"address_notes\": \"string\",\r\n" + //
								"    \"main_photo_url\": \"string\",\r\n    \"hiding_timestamp\": \"string\",\r\n" + //
								"    \"approval_timestamp\": \"string\"\r\n  },\r\n  \"timestamp\": \"2024-11-06T15:39:45\",\r\n" + //
								"  \"price\": 10,\r\n  \"status\": \"DONE\",\r\n  \"user_id\": 14,\r\n" + //
								"  \"check_in\": \"2024-11-18T14:00:00\",\r\n  \"check_out\": \"2024-11-25T10:00:00\",\r\n" + //
								"  \"is_unavailability\": false\r\n}"))),
            @ApiResponse(responseCode = "404", description = "Booking with given ID and status = 'DONE' does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/booking/{id}")
	public Booking getSingleDONEBookingById(
		@Parameter(description = "ID of the booking", example = "1")
		@PathVariable(name="id") Long id, 
		Authentication auth) {
		return bookingService.findByIdIfDONE(id);
	}
	
	
	/*
	// Not used anywhere: it may be a left over from previous versions of utumana. Use the methods in review controller instead.
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/booking_assign_review/{id}")
	public Booking assignReviewToBooking(
		@PathVariable(name="id") Long id, 
		@RequestBody(required = true) Booking booking, 
		Authentication auth) {
		
		Booking b = bookingService.findByIdIfDONE(id);
		
		if(b.getId() != booking.getId()) throw new InvalidJSONException("The bookings must correspond");
		if(b.getUserId() != booking.getUserId()) throw new ForbiddenException("Error: could not complete booking request because you have no privileges");
		AuthorizationUtility.checkIsAdminOrMe(auth, b.getUserId());
		
		Review r = booking.getReview();
		b.setReview(r);
		
		bookingService.save(b);
		return b;
	}
	*/
	
}
