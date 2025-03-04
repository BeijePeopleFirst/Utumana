package ws.peoplefirst.utumana.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.dto.PriceDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.AccommodationRepository;
import ws.peoplefirst.utumana.repository.AvailabilityRepository;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.repository.ServiceRepository;
import ws.peoplefirst.utumana.repository.UserRepository;
import ws.peoplefirst.utumana.utility.BookingStatus;

@Service
public class AccommodationService {
	
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private AccommodationRepository accommodationRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private AvailabilityRepository availabilityRepository;
	
	@Autowired
	private ServiceRepository serviceRepository;
	
	@Autowired
	private AvailabilityService availabilityService;
	
	@Autowired
	private ServiceService serviceService;
	
	public boolean approveAccommodation(Long accommodationId) {
		Accommodation accommodation = findById(accommodationId);
		
		if(accommodation != null) {
			accommodation.setApprovalTimestamp(LocalDateTime.now());
			accommodationRepository.save(accommodation);
			return true;
		}else {
			return false;
		}
	}

	public List<AccommodationDTO> getLatestUploadsDTO(int limit, Long userId) {
		Pageable pageable = PageRequest.of(0, limit);
		List<AccommodationDTO> results = accommodationRepository.getLatestUploadsDTO(pageable);
		
		// set is favourite
		for(AccommodationDTO accommodationDTO : results) {
			accommodationDTO.setIsFavourite(isFavourite(accommodationDTO.getId(), userId));
		}
		return results;
	}
	

	public Accommodation findById(Long accommodationId) {
		Accommodation accommodation= accommodationRepository.findByIdAndHidingTimestampIsNull(accommodationId);
		if(accommodation==null) {
			logger.error("accommodation not found");
			throw new IdNotFoundException("accommodation not found");
		}
		return accommodation;
	}
	
	public List<Accommodation> getAllAccommodations() {
		return accommodationRepository.findAll();
	}
	
	public List<Accommodation> getAccommodationsToBeApproved() {
		return accommodationRepository.getAccommodationsToBeApproved();
	}

	public List<AccommodationDTO> getAccommodationsDTOToBeApproved() {		
		List<AccommodationDTO> res = accommodationRepository.getAccommodationDTOToBeApproved();
		
		return res;
	}

	public List<AccommodationDTO> getMyAccommodationsDTO(Long loggedUserId) {
		List<AccommodationDTO> res = accommodationRepository.findByOwnerIdDTO(loggedUserId);
		for(AccommodationDTO accommodationDTO : res) {
			accommodationDTO.setIsFavourite(isFavourite(accommodationDTO.getId(), loggedUserId));
		}
		
		return res;
	}
	
	
	
	public Set<ws.peoplefirst.utumana.model.Service> getAccommodationServices(Long id){		
		return serviceRepository.findByAccommodationId(id);
	}
	
	public List<Review> getAccommodationReviews(Long accommodationId) {
		return bookingRepository.getApprovedAccommodationReviews(accommodationId);
	}
	
	public List<AccommodationDTO> getFavouritesDTO(Long userId) {
		if(userId!=null) {			
			List<AccommodationDTO> results = accommodationRepository.getFavouritesDTO(userId);
			
			for(AccommodationDTO accommodationDTO : results) {
				accommodationDTO.setIsFavourite(true);
			}
			return results;
		}
		logger.error("user not found");
		throw new IdNotFoundException("user not found");
	}
	

	
	public boolean isFavourite(Long accommodationId, Long userId) {
		return accommodationRepository.isFavourite(accommodationId, userId) == 1 ? true : false;
	}
	
	
	public void addFavourite(Long accommodationId, Long userId) {
		if(isFavourite(accommodationId, userId))
			return;
		
		User user = userRepository.getUserWithFavourites(userId);
		Accommodation newFavouriteAccommodation = findById(accommodationId);
		
		List<Accommodation> favourites = user.getFavourites();
		favourites.add(newFavouriteAccommodation);
		
		userRepository.save(user);
	}
	
	public void removeFavourite(Long accommodationId, Long userId) {
		if(!isFavourite(accommodationId, userId))
			return;
		
		User user = userRepository.getUserWithFavourites(userId);		
		List<Accommodation> favourites = user.getFavourites();
		
		int i = -1;
		for(i=0; i < favourites.size(); i++) {
			if(favourites.get(i).getId().equals(accommodationId)) {
				break;
			}
		}
		favourites.remove(i);
		
		userRepository.save(user);
	}
	
	private Sort getSortFromOrderByParam(String orderBy) {
		String orderField = orderBy.trim().split("-")[0];
		if(orderField.equals("minPrice")) orderField = "approvalTimestamp";
		
		String orderDirection = orderBy.trim().split("-")[1];
		if(orderDirection == null || (!orderDirection.equalsIgnoreCase("asc") && !orderDirection.equalsIgnoreCase("desc")))
			throw new TheJBeansException("Error: unknown order direction for accommodations: " + orderDirection);
		
		return orderDirection.equals("asc") ? Sort.by(Sort.Direction.ASC, orderField) : Sort.by(Sort.Direction.DESC, orderField);
	}
	
	public List<AccommodationDTO> findByUserInputDTO(String destination, LocalDate checkInDate, LocalDate checkOutDate,
			Integer numberOfGuests, List<Long> serviceIds, String orderBy, Long userId) {
		Sort sort = getSortFromOrderByParam(orderBy);
		
		System.out.println("service ids = " + serviceIds);
		List<AccommodationDTO> results;
		if(serviceIds.size() == 0) {
			results = accommodationRepository.findByUserInputDTO(destination, checkInDate, checkOutDate, numberOfGuests, sort);
		} else {
			results = accommodationRepository.findByUserInputDTOWithServices(destination, checkInDate, checkOutDate, numberOfGuests, serviceIds, (long) serviceIds.size(), sort);
		}
		
		for(AccommodationDTO accommodationDTO : results) {
			accommodationDTO.setIsFavourite(isFavourite(accommodationDTO.getId(), userId));
		}
		
		return results;
	}
	
	public List<AccommodationDTO> findByUserInputFreeDTO(String destination, LocalDate checkInDate, LocalDate checkOutDate, 
			Integer numberOfGuests, List<Long> serviceIds, String orderBy, Long userId) {
		Sort sort = getSortFromOrderByParam(orderBy);
		
		List<AccommodationDTO> results;
		if(serviceIds.size() == 0) {
			results = accommodationRepository.findByUserInputFreeDTO(destination, checkInDate, checkOutDate, numberOfGuests, sort);
		} else {
			results = new ArrayList<AccommodationDTO>();
			for(Accommodation result : accommodationRepository.findByUserInputFree(destination, checkInDate, checkOutDate, numberOfGuests, sort)) {
				if(result.getServices().stream().map(ws.peoplefirst.utumana.model.Service::getId).collect(Collectors.toList()).containsAll(serviceIds)) {
					results.add(new AccommodationDTO(result.getId(), result.getTitle(), result.getCity(), result.getMainPhotoUrl(), result.getCountry()));
				}
			}
		}
		
		for(AccommodationDTO accommodationDTO : results) {
			accommodationDTO.setIsFavourite(isFavourite(accommodationDTO.getId(), userId));
		}
		
		
		return results;
	}

	public Accommodation insertAccommodation(Accommodation accommodation) {
		// to be sure
		accommodation.setId(null);
		accommodation.setApprovalTimestamp(null);
		accommodation.setHidingTimestamp(null);
		
		checkAccommodationBeforeInsert(accommodation);
	
		// set coordinates TODO
		
		// save accommodation
		return accommodationRepository.save(accommodation);
	}
	
	public Accommodation setAccommodationServices(Long accommodationId, List<Long> serviceIds, Long userId) {
		Accommodation accommodation = findById(accommodationId);
		
		if(accommodation.getOwnerId() != userId)
			throw new TheJBeansException("Error: logged user must be the accommodation's owner to modify its services");
		
		Set<ws.peoplefirst.utumana.model.Service> services = serviceService.getServicesByIds(serviceIds);
		accommodation.setServices(services);
		return accommodationRepository.save(accommodation);
	}
	
	public Accommodation setAccommodationAvailabilities(Long accommodationId, List<Availability> availabilities, Long userId) {
		Accommodation accommodation = findById(accommodationId);
		
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + accommodationId  +" not found");
		if(accommodation.getOwnerId() != userId)
			throw new TheJBeansException("Error: logged user must be the accommodation's owner to modify its availabilities");
		checkAvailabilites(availabilities);
		
		System.out.println(availabilities);
		List<Availability> savedAvailabilities = new ArrayList<Availability>();
		Availability saved;
		for(Availability availability : availabilities) {
			availability.setAccommodationId(accommodationId);
			availability.setAccommodation(accommodation);
			saved = availability;
			if(availability.getId() == null) {
				saved = availabilityRepository.save(availability);
			}
			savedAvailabilities.add(saved);
		}
		
		for(Availability oldAvailability : accommodation.getAvailabilities()) {
			if(!savedAvailabilities.contains(oldAvailability)) {
				availabilityRepository.delete(oldAvailability);
			}
		}
		
		accommodation.setAvailabilities(savedAvailabilities);
		
		return accommodationRepository.save(accommodation);
	}
	
	public Accommodation setAccommodationUnavailabilities(Long accommodationId, List<Booking> unavailabilities, Long userId) {
		Accommodation accommodation = findById(accommodationId);
		
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + accommodationId  +" not found");
		if(accommodation.getOwnerId() != userId)
			throw new TheJBeansException("Error: logged user must be the accommodation's owner to modify its unavailabilities");
		
		checkUnavailabilities(unavailabilities);
		
		User owner = userRepository.findById(userId).get();
		for(Booking unavailability : unavailabilities) {
			unavailability.setAccommodation(accommodation);
			unavailability.setUser(owner);
			unavailability.setTimestamp(LocalDateTime.now());
			unavailability.setStatus(BookingStatus.ACCEPTED);
			unavailability.setIsUnavailability(true);
			bookingRepository.save(unavailability);
		}
		
		List<Long> unavailabilitiesIds = unavailabilities.stream().map(Booking::getId).collect(Collectors.toList());
		for(Booking oldUnavailability : bookingRepository.findByAccommodationIdAndIsUnavailabilityIsTrue(accommodationId)) {
			if(!unavailabilitiesIds.contains(oldUnavailability.getId())) {
				bookingRepository.delete(oldUnavailability);
			}
		}
		
		return accommodation;
	}
	
	// update info (no images)
	public Accommodation setAccommodationInfo(Accommodation newOne) {
		if(newOne.getId() == null)
			throw new InvalidJSONException("Accommodation id is null");
		
		checkAccommodationInfo(newOne);
		
		Accommodation accommodation = findById(newOne.getId());
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + newOne.getId()  +" not found");
		if(!accommodation.getOwnerId().equals(newOne.getOwnerId())) {
			throw new ForbiddenException("Unauthorized operation: the accommodation's owner does not match the logged user");
		}
		
		accommodation.setApprovalTimestamp(null);
		
		accommodation.setTitle(newOne.getTitle());
		accommodation.setDescription(newOne.getDescription());
		accommodation.setBeds(newOne.getBeds());
		accommodation.setRooms(newOne.getRooms());
		
		return accommodationRepository.save(accommodation);
	}
	
	public Accommodation setAccommodationAddress(Accommodation newOne) {
		if(newOne.getId() == null)
			throw new InvalidJSONException("Accommodation id is null");
		
		checkAddress(newOne);
		
		Accommodation accommodation = findById(newOne.getId());
		if(accommodation == null)
			throw new IdNotFoundException("Accommodation with id " + newOne.getId()  +" not found");
		if(!accommodation.getOwnerId().equals(newOne.getOwnerId())) {
			throw new ForbiddenException("Unauthorized operation: the accommodation's owner does not match the logged user");
		}
		
		accommodation.setCountry(newOne.getCountry());
		accommodation.setCap(newOne.getCap());
		accommodation.setStreet(newOne.getStreet());
		accommodation.setStreetNumber(newOne.getStreetNumber());
		accommodation.setCity(newOne.getCity());
		accommodation.setProvince(newOne.getProvince());
		accommodation.setAddressNotes(newOne.getAddressNotes());
		
		// recalculate coordinates and set them
		// TODO
		
		return accommodationRepository.save(accommodation);
	}
	
	
	
	private void checkAccommodationBeforeInsert(Accommodation accommodation) {
		// owner id == logged user id (checked in controller)
		
		boolean allFieldsOK = true;
		StringBuilder errorMessage = new StringBuilder();
		
		// intro
		if(!checkTitle(accommodation.getTitle())) {
			allFieldsOK = false;
			errorMessage.append("Invalid title. ");
		}
		if(!checkBeds(accommodation.getBeds())) {
			allFieldsOK = false;
			errorMessage.append("Invalid number of beds. ");
		}
		if(!checkRooms(accommodation.getRooms())) {
			allFieldsOK = false;
			errorMessage.append("Invalid number of rooms. ");
		}
//		//uncomment when photos upload is implemented
//		if(!checkMainPhotoUrl(accommodation.getMainPhotoUrl())) {
//			allFieldsOK = false;
//			errorMessage.append("Invalid main photo url. ");
//		}
		
		// address
		if(!checkCountry(accommodation.getCountry())) {
			allFieldsOK = false;
			errorMessage.append("Invalid country in address. ");
		}
		if(!checkCap(accommodation.getCap())) {
			allFieldsOK = false;
			errorMessage.append("Invalid CAP in address. ");
		}
		if(!checkStreet(accommodation.getStreet())) {
			allFieldsOK = false;
			errorMessage.append("Invalid street in address. ");
		}
		if(!checkStreetNum(accommodation.getStreetNumber())) {
			allFieldsOK = false;
			errorMessage.append("Invalid street number in address. ");
		}
		if(!checkCity(accommodation.getCity())) {
			allFieldsOK = false;
			errorMessage.append("Invalid city in address. ");
		}
		if(!checkProvince(accommodation.getProvince())) {
			allFieldsOK = false;
			errorMessage.append("Invalid province in address. ");
		}
		if(accommodation.getAddressNotes() != null && accommodation.getAddressNotes().isBlank()) {
			allFieldsOK = false;
			errorMessage.append("Invalid address notes in address. ");
		}
		
		if(!allFieldsOK) {
			throw new InvalidJSONException(errorMessage.toString());
		}
	}

	private void checkAccommodationInfo(Accommodation accommodation) {
		boolean ok = checkTitle(accommodation.getTitle()) && checkBeds(accommodation.getBeds()) && checkRooms(accommodation.getRooms());
		if(!ok)
			throw new InvalidJSONException("Invalid accommodation info");
	}
	private boolean checkTitle(String title) {
		return title != null;
	}
	private boolean checkBeds(Integer beds) {
		return beds != null && beds > 0;
	}
	private boolean checkRooms(Integer rooms) {
		return rooms != null && rooms >= 0;
	}
	//0 usage
	private boolean checkMainPhotoUrl(String mainPhotoUrl) {
		return mainPhotoUrl != null;
	}

	private void checkAddress(Accommodation accommodation) {
		boolean ok = 	checkCountry(accommodation.getCountry()) && checkCap(accommodation.getCap()) &&
						checkStreet(accommodation.getStreet()) && checkStreetNum(accommodation.getStreetNumber()) &&
						checkCity(accommodation.getCity()) && checkProvince(accommodation.getProvince());
		if(!ok)
			throw new InvalidJSONException("Invalid accommodation address");
	}
	private boolean checkCountry(String country) {
		return country != null && containsOnlyLettersAndSpaces(country);
	}
	private boolean checkCap(String cap) {
		return cap != null && cap.matches("[0-9]{5}");
	}
	private boolean checkStreet(String street) {
		return street == null || !street.isBlank();
	}
	private boolean checkStreetNum(String streetNumber) {
		return streetNumber == null || streetNumber.matches("[0-9]+[/]?[a-zA-Z]?");	// 1, 1a, 1/a, 12, 12a, 12/a, ...
	}
	private boolean checkCity(String city) {
		return city == null || containsOnlyLettersAndSpaces(city);
	}
	private boolean checkProvince(String province) {
		return province == null || containsOnlyLettersAndSpaces(province);
	}
	
	private void checkAvailabilites(List<Availability> availabilities) {
		if(availabilities.size() <= 1)
			return;
		
		Availability a;
		LocalDate start, end;
		for(int i=0; i<availabilities.size(); i++) {
			a = availabilities.get(i);
			start = a.getStartDate();
			end = a.getEndDate();
			if(start == null || end == null || a.getPricePerNight() == null ||
				!end.isAfter(start) || 
				 a.getPricePerNight() < 0) {
				
				throw new InvalidJSONException("Invalid availability: " + a);
			}
			
			// check if it overlaps with the others
			for(int j=0; j<availabilities.size() && j != i; j++){
				if(
					(!availabilities.get(j).getStartDate().isAfter(start) && start.isBefore(availabilities.get(j).getEndDate()))	// a's start is in the middle of availability j
				||	(availabilities.get(j).getStartDate().isBefore(end) && !end.isAfter(availabilities.get(j).getEndDate()))		// a's end is in the middle of availability j
				||	(!start.isAfter(availabilities.get(j).getStartDate()) && !availabilities.get(j).getEndDate().isAfter(end))		// a contains availability j
				){
					throw new InvalidJSONException("Invalid availabilities: there are overlapping periods");
				}
			}
			
		}
	}
	
	private void checkUnavailabilities(List<Booking> unavailabilities) {
		if(unavailabilities.size() <= 1)
			return;
		
		Booking unav;
		LocalDateTime start, end;
		for(int i=0; i<unavailabilities.size(); i++) {
			unav = unavailabilities.get(i);
			start = unav.getCheckIn();
			end = unav.getCheckOut();
			if(start == null || end == null || !end.isAfter(start)) {
				
				throw new InvalidJSONException("Invalid availability: " + unav);
			}
			
			// check if it overlaps with the others
			for(int j=0; j<unavailabilities.size() && j != i; j++){
				if(
					(!unavailabilities.get(j).getCheckIn().isAfter(start) && start.isBefore(unavailabilities.get(j).getCheckOut()))	// a's start is in the middle of availability j
				||	(unavailabilities.get(j).getCheckIn().isBefore(end) && !end.isAfter(unavailabilities.get(j).getCheckOut()))		// a's end is in the middle of availability j
				||	(!start.isAfter(unavailabilities.get(j).getCheckIn()) && !unavailabilities.get(j).getCheckOut().isAfter(end))	// a contains availability j
				){
					throw new InvalidJSONException("Invalid unavailabilities: there are overlapping periods");
				}
			}
			
		}
	}

	private boolean checkPhotos(List<Photo> photos, String mainPhotoUrl) {
		if(photos == null || mainPhotoUrl == null) return false;
		
		boolean accept = false;
		
		for(Photo p : photos)
			if(p.getPhotoUrl().equals(mainPhotoUrl)) accept = true;
		
		return accept;
	}

	private boolean checkCoordinates(String coordinates) {
		if(coordinates != null) {
			for(int i = 0; i < coordinates.length(); i++)
				if(coordinates.charAt(i) < '0' || coordinates.charAt(i) > '9' && 
						(coordinates.charAt(i) != '\'' && coordinates.charAt(i) != '\u00B0')) {	// '\u00B0' = degree sign
					
					return false;
				}
		}
		return true;
	}

	private boolean containsOnlyLettersAndSpaces(String s) {
		char c;
		boolean allSpaces = true;
		for(int i = 0; i < s.length(); i++) {
			c = s.charAt(i);
			if(allSpaces && Character.isLetter(c)) {
				allSpaces = false;
			}
			if(!Character.isLetter(c) && c != ' ') {	
				return false;
			}
		}
		return !allSpaces;
	}
	


	public boolean hasNoBookings(Accommodation toDelete) {
		List<Booking> bookings = bookingRepository.findByAccommodationAndIsUnavailabilityIsFalse(toDelete);
		
		if(bookings == null || bookings.size() == 0) return true;
		else return false;
	}

	
	public List<PriceDTO> configurePriceRanges(List<Long> accommodationsIds, LocalDate checkIn,
			LocalDate checkOut) {
		
		if(checkIn == null || checkOut == null)
			return configurePriceRanges(accommodationsIds);
		
		double min, max, price;
		
		List<PriceDTO> returnedList=new ArrayList<PriceDTO>();
		List<Availability> availabilities;
		PriceDTO priceDTO = null;
		for(Long accommodationId : accommodationsIds) {
			priceDTO = new PriceDTO();
			
			availabilities = availabilityService.findAvailabilities(accommodationId, checkIn, checkOut);
			priceDTO.setAccommodationId(accommodationId);
			
			if(availabilities == null) {
				priceDTO.setMinPrice(null);
				priceDTO.setMaxPrice(null);
			} else {
				max = 0;
				min = -1;
				for(Availability availability : availabilities) {
					price = availability.getPricePerNight();
					if (Double.compare(min, -1) == 0)
						min = price;
					if(price > max) {
						max = price;
					}else if (price  < min) {
						min = price;
					}
				}
				if (Double.compare(min, -1) == 0)
					min = 0;
				
				priceDTO.setMinPrice(min);
				priceDTO.setMaxPrice(max);
				returnedList.add(priceDTO);
			}
		}
		
		return returnedList;
	}
	
	public List<PriceDTO> configurePriceRanges(List<Long> accommodationsIds){
		Double price;
		List<PriceDTO> returnedList=new ArrayList<PriceDTO>();
		PriceDTO priceDTO = null;
		for(Long accommodationId : accommodationsIds) {
			priceDTO = new PriceDTO();
			priceDTO.setAccommodationId(accommodationId);
			price = availabilityRepository.getMinPricePerNight(accommodationId);
			priceDTO.setMinPrice(price);
			
			price = availabilityRepository.getMaxPricePerNight(accommodationId);
			priceDTO.setMaxPrice(price);
			returnedList.add(priceDTO);
		}
		
		return returnedList;
	}
}
