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
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.PriceDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ErrorMessage;
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

@Tag(name = "Accommodations", description="APIs for Accommodation section")
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
	
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodations were retrieved Successfully")
	})
	@Operation(summary = "Get all Accommodations")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation was retrieved Successfully"),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: entity Hidden or illegal ID provided", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation by ID only if it is not hidden")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation was retrieved Successfully"),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: entity not Hidden or illegal ID provided", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation by ID only if it is rejected (which means hidden accommodation)")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s ID, title, description, number of beds and number of rooms were retrieved successfully"),
	    @ApiResponse(responseCode = "403", description = "The user who tried to get the Accommodation Informations was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: illegal ID provided or accommodation was deleted (which means that it was hidden)", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation informations (ID, title, description, number of beds, number of rooms) by Accommodation ID")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s ID, country, cap, street, street_number, city, province and address_notes were retrieved successfully"),
	    @ApiResponse(responseCode = "403", description = "The user who tried to get the Accommodation Informations was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: illegal ID provided or accommodation was deleted (which means that it was hidden)", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation address informations (Accommodation ID, country, cap, street, street_number, city, province and address_notes) by Accommodation ID")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s services were retrieved successfully"),
	    @ApiResponse(responseCode = "403", description = "The user who tried to get the Accommodation services was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: illegal ID provided or accommodation was deleted (which means that it was hidden)", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation service list by Accommodation ID: it gets all the services which are possessed by the accomodation")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s availabilities were retrieved successfully"),
	    @ApiResponse(responseCode = "403", description = "The user who tried to get the Accommodation availabilities was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: illegal ID provided or accommodation was deleted (which means that it was hidden)", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation availabilities list by Accommodation ID: it gets all the availabilities which are possessed by the accomodation")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s unavailabilities DTOs were retrieved successfully"),
	    @ApiResponse(responseCode = "403", description = "The user who tried to get the Accommodation unavailabilities was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation Not Found: illegal ID provided or accommodation was deleted (which means that it was hidden)", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation UnavailabilitiesDTO list by Accommodation ID: it gets all the unavailabilities (DTO) which are possessed by the accomodation")
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
	
	//Need to decide if the control that verifies the accommodation was hidden is needed -> TODO
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation' s availabilities in the provided time interval were retrieved successfully"),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID does not exist", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "Get single Accommodation availabilities list by Accommodation ID in a fixed period of time (the returned result will consider the accepted bookings as well")
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/availabilities/{accommodation_id}")
	public Map<LocalDate, Double> getAvailabilities(@PathVariable (name = "accommodation_id") Long accommodationId,
												@RequestParam(name = "check_in") String checkIn,
												@RequestParam(name = "check_out") String checkOut) {
		
		Accommodation acc = this.accommodationService.findById(accommodationId);
		if(acc == null) throw new IdNotFoundException("Accommodation with id " + accommodationId + " not found");
		
		return avService.findAvailableDatesByMonth(accommodationId, checkIn, checkOut);
	}
	
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation successfully created"),
	    @ApiResponse(responseCode = "400", description = "Some accommodation fields/properties that were provided were not valid fields (for example it was provided a number were there must be letters only", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "This API creates a new Accommodation and stores it into the Database")
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping(value="/accommodation")
	public Accommodation createAccommodationAPI(@RequestBody Accommodation accommodation, Authentication auth) {
		logger.debug("POST /accommodation");
		System.out.println("Accommodation received: " + accommodation);

		return accommodationService.insertAccommodation(accommodation);
	}
	
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation successfully updated"),
	    @ApiResponse(responseCode = "400", description = "Some accommodation fields/properties that were provided were not valid fields (for example it was provided a number were there must be letters only", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "403", description = "The user who tried to change the Accommodation' s address was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID and/or accommodation owner id were/was not provided", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "This API updates the specified Accommodation' s address informations inside the Database")
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
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation successfully updated"),
	    @ApiResponse(responseCode = "400", description = "The user is not logged", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "403", description = "The user who tried to change the Accommodation' s services was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID not valid", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "This API updates the specified Accommodation' s services inside the Database")
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/services")
	public Accommodation setAccommodationServices(@PathVariable Long id,
			@RequestBody List<Long> serviceIds, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/services");
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		return accommodationService.setAccommodationServices(id, serviceIds, userId);
	}
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation successfully updated"),
	    @ApiResponse(responseCode = "400", description = "The user is not logged", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "403", description = "The user who tried to change the Accommodation' s availabilities was not the owner: only the owners of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID not valid", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	})
	@Operation(summary = "This API updates the specified Accommodation' s availabilities inside the Database")
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/accommodation/{id}/availabilities")
	public Accommodation setAccommodationAvailabilities(@PathVariable Long id, 
			@RequestBody List<Availability> availabilities, Authentication auth) {
		logger.debug("PATCH /accommodation/" + id + "/availabilities");
		
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		
		return accommodationService.setAccommodationAvailabilities(id, availabilities, userId);
	}

// UNUSED METHOD: USE METHOD addUnavilability IN BOOK CONTROLLER
//	@PreAuthorize("hasAuthority('USER')")
//	@PatchMapping(value = "/accommodation/{id}/unavailabilities")
//	public Accommodation setAccommodationUnavailabilities(@PathVariable Long id, 
//			@RequestBody List<Booking> unavailabilities, Authentication auth) {
//		logger.debug("PATCH /accommodation/" + id + "/unavailabilities");
//		
//		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
//		
//		return accommodationService.setAccommodationUnavailabilities(id, unavailabilities, userId);
//	}
	
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "Accommodation successfully updated"),
	    @ApiResponse(responseCode = "400", description = "Invalid JSON was received due to missing fields or illegal ones", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "403", description = "The user who tried to change the Accommodation' s data was nor the owner nor an admin: only the owners and/or admins of the accommodation can edit its informations", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID not valid or owner id not specified", content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ErrorMessage.class)))
	    @ApiResponse(responseCode = "400", description = "Invalid JSON was received due to missing fields or illegal ones",
	    	content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=InvalidJSONException.class))),
	    @ApiResponse(responseCode = "403", description = "The user who tried to change the Accommodation' s data was nor the owner nor an admin: only the owners and/or admins of the accommodation can edit its informations",
	    	content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=ForbiddenException.class))),
	    @ApiResponse(responseCode = "404", description = "Accommodation ID not valid or owner id not specified",
    	content=@Content(mediaType = "application/json",
		schema=@Schema(implementation=IdNotFoundException.class))),
	})
	@Operation(summary = "This API updates the specified Accommodation' s tile, description, number of beds and number of rooms informations inside the Database")
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
	
	@Operation(summary = "Delete an accommodation with given id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Accommodation deleted successfully"),
        @ApiResponse(responseCode = "400", description = "If the user is not correctly logged in",
	    	content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=InvalidJSONException.class))),
        @ApiResponse(responseCode = "404", description = "If the given id does not match any accommodation",
	    	content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=InvalidJSONException.class))),
        @ApiResponse(responseCode = "403", description = "If you are not the logged user or an admin",
	    	content=@Content(mediaType = "application/json",
	    		schema=@Schema(implementation=InvalidJSONException.class))),
        @ApiResponse(responseCode = "403", description = "If you are deleting an accommodation with ongoing or future booking",
    		content=@Content(mediaType = "application/json",
    			schema=@Schema(implementation=InvalidJSONException.class))),
    })
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
	
	@Operation(summary = "Return the most recent added accommodation using AccommodationDTO")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the latest uploads are correctly taken"),
        @ApiResponse(responseCode = "400", description = "If the user is not correctly logged in"),
        @ApiResponse(responseCode = "403", description = "If the given check_in or check_out date has wrong format or null")
    })
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
	
	@Operation(summary = "Return the list of accommodation ordered by average review rating")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of most liked accommodation returned correctly"),
        @ApiResponse(responseCode = "400", description = "If the user is not correctly logged in")
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value="/accommodation/most_liked")
	public List<AccommodationDTO> getMostLikedAccommodationsDTO(Authentication auth) {
		logger.debug("GET /accommodation/most_liked");
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		return accommodationService.getMostLikedAccommodationsDTO(0, Constants.ACCOMMODATIONS_PAGE_SIZE, userId);
	}
	
	@Operation(summary = "Return the list of priceDTO for the given array of accommodation id for a given period if null controls all availabilities")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the prices are correctly set"),
        @ApiResponse(responseCode = "403", description = "If the given check_in or check_out date has wrong format"),
        @ApiResponse(responseCode = "400", description = "If the user is not correctly logged in")
    })
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

		return accommodationService.configurePriceRanges(ids, checkInDate, checkOutDate);
	}
	
	@Operation(summary = "Return the full accommodation that the user adds as favourites")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If a valid accommodation is added into logged user favourites"),
        @ApiResponse(responseCode = "403", description = "If you are not an admin or a logged user"),
        @ApiResponse(responseCode = "404", description = "If the accoomodation_id does not match any existing accommodation")
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/add-favourite/{user_id}/{accommodation_id}")
	public Accommodation addFavourite(@PathVariable(name="user_id") Long userId,
			@PathVariable(name="accommodation_id") Long accommodationId, Authentication auth) {
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		
		//TODO this method also calls findByIdAndHidingTimestampIsNull remove one
		accommodationService.addFavourite(accommodationId, userId);
		
		//TODO decide what to return based on graphical view
		return accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
	}
	
	@Operation(summary = "Return the full accommodation that the user removed from favourites")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If a valid accommodation is removed from the logged user favourites"),
        @ApiResponse(responseCode = "403", description = "If you are not an admin or a logged user"),
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping(value = "/remove-favourite/{user_id}/{accommodation_id}")
	public Accommodation removeFavourite(@PathVariable(name="user_id") Long userId,
			@PathVariable(name="accommodation_id") Long accommodationId, Authentication auth) {
	
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		accommodationService.removeFavourite(accommodationId, userId);
		
		//TODO decide what to return based on graphical view
		return accommodationService.findByIdAndHidingTimestampIsNull(accommodationId);
	}
	
	@Operation(summary = "Return the list of favourites (as DTOs) for given user_id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of favourites is correctly returned"),
        @ApiResponse(responseCode = "403", description = "If you are not an admin or a logged user"),
        @ApiResponse(responseCode = "404", description = "If the user_id does not match any existing user")
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping(value = "/favorites/{user_id}")
	public List<AccommodationDTO> showFavourites(@PathVariable(name="user_id") Long userId, Authentication auth) {
		// log
		
		AuthorizationUtility.checkIsAdminOrMe(auth, userId);
		List<AccommodationDTO> favourites = accommodationService.getFavouritesDTO(userId);
		
		//favourites = accommodationService.configurePriceRanges(favourites);
		return favourites;
	}
	
	@Operation(summary = "Return the list of accommodations to be approved by an admin")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list is correctly returned"),
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value="/get_accommodations_to_approve") 
	public List<Accommodation> getAccommodationsToBeApproved(Authentication auth) {
		return accommodationService.getAccommodationsToBeApproved();
	}
	
	@Operation(summary = "Return the list of accommodation to be approved by an admin (as DTOs)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list is correctly returned"),
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@GetMapping(value="/get_accommodationsdto_to_approve")
	public List<AccommodationDTO> getAccommodationsDTOToBeApproved(Authentication auth) {
		return accommodationService.getAccommodationsDTOToBeApproved();
	}
	
	@Operation(summary = "Return the list of accommodations posted by an user (as DTOs)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of my accommodations is correctly returned"),
        @ApiResponse(responseCode = "403", description = "If you are not the logged user or an admin"),
        @ApiResponse(responseCode = "404", description = "If the user_id does not match any existing user"),
    })
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
	
	@Operation(summary = "Return the list of accommodation that are not already accepted by an admin")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of pending accommodations is correctly returned"),
        @ApiResponse(responseCode = "403", description = "If you are not the logged user or an admin"),
        @ApiResponse(responseCode = "404", description = "If the user_id does not match any existing user"),
    })
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
	
	@Operation(summary = "Return the list of accommodation that were rejected by an admin")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of rejected accommodations is correctly returned"),
        @ApiResponse(responseCode = "403", description = "If you are not the logged user or an admin"),
        @ApiResponse(responseCode = "404", description = "If the user_id does not match any existing user"),
    })
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
	
	@Operation(summary = "Return the list of accommodation that match the search criteria")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of searched accommodations is correctly returned"),
        @ApiResponse(responseCode = "400", description = "If an error occurs decoding the query params"),
        @ApiResponse(responseCode = "400", description = "If check-in and check-out query params are blank"),
        @ApiResponse(responseCode = "403", description = "If check-in and check-out query params cannot be parsed into LocalDate"),
        @ApiResponse(responseCode = "400", description = "If check-in is after the check-out date"),
        @ApiResponse(responseCode = "403", description = "If the number of guests is less than 0")
    })
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
	
	@Operation(summary = "Return the full accommodation with utility fields such as : if the logged user is and admin or owner, hasPendingBooking,"
			+ " the id of the pending booking, a formatted approval timestamp, all the reviews ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the accomomodation is found"),
        @ApiResponse(responseCode = "404", description = "If there is not any accommodation with given id")
    })
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
	
	@Operation(summary = "Return the house that has been approved")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "If the list of searched accommodations is correctly returned"),
        @ApiResponse(responseCode = "404", description = "If the accommodation_id does not match any accommodation with null approval_timestamp")
    })
	@PreAuthorize("hasAuthority('ADMIN')")
	@PatchMapping(value = "/approve_accommodation/{accommodation_id}")
	public Accommodation approveHouse( @PathVariable (name="accommodation_id")Long accommodationId) {
		
		return accommodationService.approveAccommodation(accommodationId);
	}
	
}
