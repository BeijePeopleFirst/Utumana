package ws.peoplefirst.utumana.controller;

import static org.springframework.http.ResponseEntity.ok;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.PriceDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.model.Service;
import ws.peoplefirst.utumana.service.AccommodationService;
import ws.peoplefirst.utumana.service.AvailabilityService;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.service.PhotoService;
import ws.peoplefirst.utumana.service.UserService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;
import ws.peoplefirst.utumana.utility.Constants;
import ws.peoplefirst.utumana.utility.JsonFormatter;

@RestController
@RequestMapping(value="/api")
public class AccommodationController {

	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AccommodationService accommodationService;
	
	@Autowired
	private UserService usrService;
	
	@Autowired
	private PhotoService photoService;
	
	@Autowired
	private AvailabilityService avService;
	
	@Autowired
	private BookingService bookingService;
	
	
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodations")
	public List<Accommodation> getAllAccommodationsAPI(Authentication auth) {
		logger.debug("GET /accommodations");
		
		List<Accommodation> list = accommodationService.getAllAccommodations();
		
		if(list == null || list.size() == 0) return new ArrayList<Accommodation>();
		else {
			return list;
		}
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/{id}")
	public Accommodation getSingleAccommodationAPI(@PathVariable Long id, Authentication auth) {	
		logger.debug("GET /accommodation/" + id);
		
		Accommodation acc = accommodationService.findByIdAndHidingTimestampIsNull(id);	
		
		if(acc != null) return acc;
		else {
			logger.error("Incorrect ID -- No Accommodation was found");
			throw new IdNotFoundException("Incorrect ID -- No Accommodation was found");
		}
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/rejected_accommodation/{id}")
	public Accommodation getRejectedAccommodationAPI(@PathVariable Long id, Authentication auth) {	
		logger.debug("GET /rejected_accommodation/" + id);
		
		Accommodation acc = accommodationService.findRejectedAccommodation(id);	
		
		if(acc != null) return acc;
		else {
			logger.error("Incorrect ID -- No Accommodation was found");
			throw new IdNotFoundException("Incorrect ID -- No Accommodation was found");
		}
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/accommodation/{accommodationId}/info")
	public ResponseEntity<Map<String, Object>> getAccomodationInfo(Authentication auth, 
			@PathVariable(name = "accommodationId") Long accommodationId) {
			
		Accommodation accommodation = accommodationService.findById(accommodationId);
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + accommodationId + " not found");
		
		if (accommodation.getApprovalTimestamp() != null && accommodation.getHidingTimestamp() != null) {
			// accommodation deleted
			throw new IdNotFoundException("Accommodation not found");
		} else {
			if(!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodation.getOwnerId())) {
				throw new ForbiddenException("Only owners can edit their accommodation");
			}
		}
		
		Map<String, Object> res = new HashMap<>();
		
		res.put("id", accommodation.getId());
		res.put("title", accommodation.getTitle());
		res.put("description", accommodation.getDescription());
		res.put("beds", accommodation.getBeds());
		res.put("rooms", accommodation.getRooms());
		
		return ok(res);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/accommodation/{accommodationId}/address")
	public ResponseEntity<Map<String, Object>> getAccomodationAddress(Authentication auth, 
			@PathVariable(name = "accommodationId") Long accommodationId) {
			
		Accommodation accommodation = accommodationService.findById(accommodationId);
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + accommodationId + " not found");
		
		if (accommodation.getApprovalTimestamp() != null && accommodation.getHidingTimestamp() != null) {
			// accommodation deleted
			throw new IdNotFoundException("Accommodation not found");
		} else {
			if(!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodation.getOwnerId())) {
				throw new ForbiddenException("Only owners can edit their accommodation");
			}
		}
		
		Map<String, Object> res = new HashMap<>();
		
		res.put("id", accommodation.getId());
		res.put("country", accommodation.getCountry());
		res.put("cap", accommodation.getCap());
		res.put("street", accommodation.getStreet());
		res.put("street_number", accommodation.getStreetNumber());
		res.put("city", accommodation.getCity());
		res.put("province", accommodation.getProvince());
		res.put("address_notes", accommodation.getAddressNotes());
		
		return ok(res);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/{id}/services")
	public Set<Service> getAccommodationServices(@PathVariable Long id, Authentication auth) {
		logger.debug("GET /accommodation/" + id + "/services");
		
		Accommodation accommodation = accommodationService.findById(id);
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + id + " not found");
		
		if (accommodation.getApprovalTimestamp() != null && accommodation.getHidingTimestamp() != null) {
			// accommodation deleted
			throw new IdNotFoundException("Accommodation not found");
		} else {
			if(!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodation.getOwnerId())) {
				throw new ForbiddenException("Only owners can edit their accommodation");
			}
		}

		return accommodationService.getAccommodationServices(id);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/{id}/availabilities")
	public List<Availability> getAccommodationAvailabilities(@PathVariable Long id, Authentication auth) {
		logger.debug("GET /accommodation/" + id + "/availabilities");
		
		Accommodation accommodation = accommodationService.findById(id);
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + id + " not found");
		
		if (accommodation.getApprovalTimestamp() != null && accommodation.getHidingTimestamp() != null) {
			// accommodation deleted
			throw new IdNotFoundException("Accommodation not found");
		} else {
			if(!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodation.getOwnerId())) {
				throw new ForbiddenException("Only owners can edit their accommodation");
			}
		}
		
		return avService.findByAccommodationId(id);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/{id}/unavailabilities")
	public List<UnavailabilityDTO> getAccommodationUnavailabilitiesDTO(@PathVariable Long id, Authentication auth) {
		logger.debug("GET /accommodation/" + id + "/unavailabilities");
		
		Accommodation accommodation = accommodationService.findById(id);
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + id + " not found");
		
		if (accommodation.getApprovalTimestamp() != null && accommodation.getHidingTimestamp() != null) {
			// accommodation deleted
			throw new IdNotFoundException("Accommodation not found");
		} else {
			if(!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodation.getOwnerId())) {
				throw new ForbiddenException("Only owners can edit their accommodation");
			}
		}
		
		return bookingService.findUnavailabilitiesDTO(id);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/availabilities/{accommodation_id}")
	public Map<LocalDate, Double> getAvailabilities(@PathVariable (name = "accommodation_id") Long accommodationId,
												@RequestParam(name = "check_in") String checkIn,
												@RequestParam(name = "check_out") String checkOut) {
		return avService.findAvailableDatesByMonth(accommodationId, checkIn, checkOut);
	}
	
	
	
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value="/accommodation")
	public Accommodation createAccommodationAPI(@RequestBody Accommodation accommodation, Authentication auth) {
		logger.debug("POST /accommodation");
		System.out.println("Accommodation received: " + accommodation);

		return accommodationService.insertAccommodation(accommodation);
	}
	
	
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/address")
	public Accommodation setAccommodationAddress(@RequestBody Accommodation newOne, 
			@PathVariable Long id, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/address");
		
		if(newOne.getOwnerId() == null || newOne.getId() == null) {
			logger.error("Accommodation ID and Owner ID must be provided");
			throw new IdNotFoundException("Accommodation ID and Owner ID must be provided");
		}
		
		if(!id.equals(newOne.getId()))
			throw new InvalidJSONException("Accommodation id in request body doesn't match id in path");

		AuthorizationUtility.checkIsAdminOrMe(auth, newOne.getOwnerId());
		
		return accommodationService.setAccommodationAddress(newOne);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/services")
	public Accommodation setAccommodationServices(@PathVariable Long id,
			@RequestBody List<Long> serviceIds, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/services");
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		return accommodationService.setAccommodationServices(id, serviceIds, userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/availabilities")
	public Accommodation setAccommodationAvailabilities(@PathVariable Long id, 
			@RequestBody List<Availability> availabilities, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/availabilities");
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		return accommodationService.setAccommodationAvailabilities(id, availabilities, userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/unavailabilities")
	public Accommodation setAccommodationUnavailabilities(@PathVariable Long id, 
			@RequestBody List<Booking> unavailabilities, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/unavailabilities");
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		return accommodationService.setAccommodationUnavailabilities(id, unavailabilities, userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/accommodation/{id}")
	public Accommodation setAccommodationInfo(@RequestBody Accommodation newOne, 
			@PathVariable Long id, Authentication auth) {
		
		if(newOne.getOwnerId() == null || newOne.getId() == null) {
			System.out.println("Stampo Errore in questione" + newOne);
			logger.error("Accommodation ID and Owner ID must be provided");
			throw new IdNotFoundException("Accommodation ID and Owner ID must be provided");
		}
		
		if(!id.equals(newOne.getId()))
			throw new InvalidJSONException("Accommodation id in request body doesn't match id in path");

		AuthorizationUtility.checkIsAdminOrMe(auth, newOne.getOwnerId());

		return accommodationService.setAccommodationInfo(newOne);
	}

//	@PreAuthorize("hasAuthority('USER')")
//	@DeleteMapping(value="/delete_accommodation/{id}")
//	public Accommodation deleteAccommodationAPI(@PathVariable Long id, Authentication auth) {		
//		Accommodation toDelete = accommodationService.findById(id);
//
//		if(toDelete == null) {
//			logger.error("Accommodation ID does not exist");
//			throw new IdNotFoundException("Accommodation ID does not exist");
//		}
//		else {
//			
//			
//			if(accommodationService.hasNoBookings(toDelete)) {
//				
////				if(!currentUsr.equals(toDelete.getOwnerId()) && !user.getIsAdmin()) throw new ForbiddenException("Privileges requirements not satisfied: abort...");
////				else {
////					accommodationService.delete(toDelete);
////					return toDelete;
////				}
//				
//				//accommodationService.delete(toDelete);
//				
//				return toDelete;
//			}
//			else {
//				AuthorizationUtility.checkIsAdminOrMe(auth, toDelete.getOwnerId());
////				if(!currentUsr.equals(toDelete.getOwnerId()) && !user.getIsAdmin()) throw new ForbiddenException("Privileges requirements not satisfied: abort...");
////				else {
////					toDelete.setHidingTimestamp(LocalDateTime.now());
////					accommodationService.save(toDelete);
////					return toDelete;
////				}
//				
//				toDelete.setHidingTimestamp(LocalDateTime.now());
//				//accommodationService.save(toDelete);
//				return toDelete;
//			}
//			
//		}
//	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value="/delete_accommodation/{id}")
	public Accommodation deleteAccommodationAPI(@PathVariable Long id, Authentication auth) {
		logger.debug("DELETE /delete_accommodation/" + id);
		Accommodation toDelete = accommodationService.findByIdAndHidingTimestampIsNull(id);

		if(toDelete == null) {
			throw new IdNotFoundException("Accommodation ID does not exist");
		}
		
		AuthorizationUtility.checkIsAdminOrMe(auth, toDelete.getOwnerId());
		
		return accommodationService.deleteAccommodation(id);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/latest_uploads")
	public List<AccommodationDTO> getLatestUploadsDTO(@RequestParam(value="check_in",required=false) String checkIn, 
			@RequestParam(value="check_out",required=false) String checkOut, 
			Authentication auth) {
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		List<AccommodationDTO> latestAccommodations = accommodationService.getLatestUploadsDTO(0, Constants.ACCOMMODATIONS_PAGE_SIZE, userId);
		
		LocalDate checkInDate = null;
		LocalDate checkOutDate = null;
		
		if(checkIn!=null && checkOut!=null) {
			checkInDate = JsonFormatter.parseStringIntoDate(checkIn);
			checkOutDate = JsonFormatter.parseStringIntoDate(checkOut);
		}
		
		//latestAccommodations = accommodationService.configurePriceRanges(latestAccommodations, checkInDate, checkOutDate);
		return latestAccommodations;
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/most_liked")
	public List<AccommodationDTO> getMostLikedAccommodationsDTO(Authentication auth) {
		logger.debug("GET /accommodation/most_liked");
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		return accommodationService.getMostLikedAccommodationsDTO(0, Constants.ACCOMMODATIONS_PAGE_SIZE, userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/accommodation/prices")
	public List<PriceDTO> configurePriceRanges(@RequestParam(value="ids") List<Long> ids, @RequestParam(value="check_in",required=false) String checkIn, 
			@RequestParam(value="check_out",required=false) String checkOut){
		
		LocalDate checkInDate = null;
		LocalDate checkOutDate = null;
		
		if(checkIn!=null && checkOut!=null) {
			checkInDate = JsonFormatter.parseStringIntoDate(checkIn);
			checkOutDate = JsonFormatter.parseStringIntoDate(checkOut);
		}
		System.out.println(ids);

		return accommodationService.configurePriceRanges(ids, checkInDate, checkOutDate);
	}
	
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/add-favourite/{user_id}/{accommodation_id}")
	public Accommodation addFavourite(@PathVariable(name="user_id") Long userId,
			@PathVariable(name="accommodation_id") Long accommodationId, Authentication auth) {
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		
		accommodationService.addFavourite(accommodationId, userId);
		
		//TODO decide what to return based on graphical view
		return accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/remove-favourite/{user_id}/{accommodation_id}")
	public Accommodation removeFavourite(@PathVariable(name="user_id") Long userId,
			@PathVariable(name="accommodation_id") Long accommodationId, Authentication auth) {
	
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		accommodationService.removeFavourite(accommodationId, userId);
		
		//TODO decide what to return based on graphical view
		return accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/favorites/{user_id}")
	public List<AccommodationDTO> showFavourites(@PathVariable(name="user_id") Long userId, Authentication auth) {
		// log
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		List<AccommodationDTO> favourites = accommodationService.getFavouritesDTO(userId);
		
		//favourites = accommodationService.configurePriceRanges(favourites);
		return favourites;
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value="/get_accommodations_to_approve") 
	public List<Accommodation> getAccommodationsToBeApproved(Authentication auth) {
		return accommodationService.getAccommodationsToBeApproved();
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value="/get_accommodationsdto_to_approve")
	public List<AccommodationDTO> getAccommodationsDTOToBeApproved(Authentication auth) {
		return accommodationService.getAccommodationsDTOToBeApproved();
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/my_accommodations/{userId}")
	public List<AccommodationDTO> getMyAccommodationsDTO(@PathVariable Long userId, Authentication auth) {
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		if(usrService.findById(userId) == null) {
			logger.error("The specified user does not exist");
			throw new IdNotFoundException("The specified user does not exist");
		}
		
		return accommodationService.getMyAccommodationsDTO(userId);
	}
	
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/pending_accommodations/{userId}")
	public List<AccommodationDTO> getPendingAccommodationsDTO(@PathVariable Long userId, Authentication auth) {
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		if(usrService.findById(userId) == null) {
			logger.error("The specified user does not exist");
			throw new IdNotFoundException("The specified user does not exist");
		}
		
		return accommodationService.getPendingAccommodationsDTO(userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/rejected_accommodations/{userId}")
	public List<AccommodationDTO> getRejectedAccommodationsDTO(@PathVariable Long userId, Authentication auth) {
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		if(usrService.findById(userId) == null) {
			logger.error("The specified user does not exist");
			throw new IdNotFoundException("The specified user does not exist");
		}
		
		return accommodationService.getRejectedAccommodationsDTO(userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/search")
	public List<AccommodationDTO> searchResults(
			@RequestParam(name = "destination",required=false) String destination,
			@RequestParam(name = "check-in") String checkIn, 
			@RequestParam(name = "check-out") String checkOut, 
			@RequestParam(name = "number_of_guests") Integer numberOfGuests,
			@RequestParam(name = "free_only") boolean freeOnly, 
			@RequestParam(name = "services") List<Long> serviceIds,
			@RequestParam(name = "order_by") String orderBy, 
			Authentication auth) {
		logger.debug("GET /search");
		
		// decode destination
		try {
			destination = URLDecoder.decode(destination, StandardCharsets.UTF_8.toString());
		} catch (UnsupportedEncodingException e) {
			throw new TheJBeansException("Error decoding destination string from search URL: " + destination);
		}

		// get check-in and check-out dates
		if(checkIn.isBlank()) {
			logger.error("The check-in date cannot be blank");
			throw new InvalidJSONException("The check-in date cannot be blank.");
		}
		if(checkOut.isBlank()) {
			logger.error("The check-out date cannot be blank");
			throw new InvalidJSONException("The check-out date cannot be blank.");
		}
		
		LocalDate checkInDate = JsonFormatter.parseStringIntoDate(checkIn);
		LocalDate checkOutDate = JsonFormatter.parseStringIntoDate(checkOut);
		
		// check params
		if(checkInDate.isAfter(checkOutDate) || checkInDate.isEqual(checkOutDate)) {
			logger.error("The check-out date must be after the check in date.");
			logger.trace("Invalid dates: check-in = " + checkInDate + ", check-out = " + checkOutDate);
			throw new InvalidJSONException("The check-out date must be after the check in date.");
		}

		if(numberOfGuests <= 0) {
			logger.error("The number of guest must be a number greater than 0.");
			logger.trace("Invalid number of guests = " + numberOfGuests);
			throw new ForbiddenException("The number of guest must be a number greater than zero.");
		}
		
		logger.trace("Searching accommodations with params: dest = " + destination + 
				", check-in = " + checkInDate + ", check-out = " + checkOutDate + 
				", number of guests = " + numberOfGuests + ", freeOnly = " + freeOnly + ", services = " + serviceIds + ", order by " + orderBy);
		
		List<AccommodationDTO> resList = new ArrayList<AccommodationDTO>();
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		if(freeOnly) {
			resList = accommodationService.findByUserInputFreeDTO(destination, checkInDate, checkOutDate, numberOfGuests, serviceIds, orderBy, userId);
		}
		else {
			resList = accommodationService.findByUserInputDTO(destination, checkInDate, checkOutDate, numberOfGuests, serviceIds, orderBy, userId);
		}
		
		return resList;
	}
	
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/accommodation_info/{accommodationId}")
	public ResponseEntity<Map<String, Object>> getAccomodationDetails(Authentication auth,@PathVariable(name = "accommodationId") Long accommodationId) {
		UserDTO user = (UserDTO) auth.getPrincipal();
		
		Accommodation accommodation = accommodationService.findById(accommodationId);
		
		Map<String, Object> res = new HashMap<>();
		
		res.put("isAdmin", AuthorizationUtility.hasAdminRole(auth));
		res.put("isOwner", user.getId().equals(accommodation.getOwnerId()));
		
		if(accommodation.getApprovalTimestamp() != null) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd, hh:mm");
			String approval = accommodation.getApprovalTimestamp().format(formatter);
			res.put("approval", approval);
			
			List<Review> reviews = accommodationService.getAccommodationReviews(accommodationId);
			res.put("reviews", reviews);
			
			boolean hasPendingBooking = bookingService.hasPendingBooking(user.getId(), accommodationId);
			res.put("hasPendingBooking", hasPendingBooking);
			
			Long pendingId = bookingService.pendingBooking(user.getId(), accommodationId);
			if(pendingId != null)
				res.put("bookingId", pendingId);
		}
		
		boolean isFavourite = accommodationService.isFavourite(accommodationId, user.getId());
		res.put("isFavourite", isFavourite);
		
		return ok(res);
	}
	
	@PreAuthorize("hasAuthority('ADMIN')")
	@PatchMapping(value = "/approve_accommodation/{accommodation_id}")
	public Accommodation approveHouse( @PathVariable (name="accommodation_id")Long accommodationId) {
		
		return accommodationService.approveAccommodation(accommodationId);
	}
	
}
