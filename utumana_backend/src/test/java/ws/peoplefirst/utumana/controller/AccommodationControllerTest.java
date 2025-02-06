package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.dto.PriceDTO;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.*;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.service.AccommodationService;
import ws.peoplefirst.utumana.service.AvailabilityService;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.service.UserService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AccommodationControllerTest {

    @InjectMocks
    private AccommodationController accommodationController;

    @Mock
    private AccommodationService accommodationService;

    @Mock
    private AvailabilityService availabilityService;

    @Mock
    private BookingService bookingService;

    @Mock
    private UserService usrService;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDTO userDTO;

    /**
     *      Reusable methods
     */

    private <T> T getInstance(Class<T> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile creare una nuova istanza di " + clazz, e);
        }
    }

    private <T> Page<T> getPage(List<T> pageValues){
        return new PageImpl<T>(pageValues);
    }


    /**     GET - API: /accommodations
     *      MTEHOD: getAllAccommodationsAPI(...)
     */

    @Test
    void getAllAccommodationsAPI(){
        when(accommodationService.getAllAccommodations(any(Pageable.class)))
                .thenReturn(getPage(List.of(getInstance(Accommodation.class))));
        assertDoesNotThrow(() -> accommodationController.getAllAccommodationsAPI(authentication, Pageable.unpaged()));
    }

    /**     GET - API: /accommodation/{id}
     *      MTEHOD: getSingleAccommodationAPI(...)
     */

    @Test
    void getSingleAccommodationAPI(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        assertDoesNotThrow(() -> accommodationController.getSingleAccommodationAPI(0L, authentication));
    }

    @Test
    void getSingleAccommodationAPIKo(){
        when(accommodationService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.getSingleAccommodationAPI(0L, authentication));
    }

    /**     GET - API: /accommodation/{id}/services
     *      MTEHOD: getAccommodationServices(...)
     */

    @Test
    void getAccommodationServices(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        when(accommodationService.getAccommodationServices(anyLong())).thenReturn(Set.of(getInstance(Service.class)));
        assertDoesNotThrow(() -> accommodationController.getAccommodationServices(0L, authentication));
    }

    @Test
    void getAccommodationServicesKo(){
        when(accommodationService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.getAccommodationServices(0L, authentication));
    }

    /**     GET - API: /accommodation/{id}/availabilities
     *      MTEHOD: getAccommodationAvailabilities(...)
     */

    @Test
    void getAccommodationAvailabilities(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        when(availabilityService.findByAccommodationId(anyLong(),any())).thenReturn(getPage(List.of(getInstance(Availability.class))));
        assertDoesNotThrow(() -> accommodationController.getAccommodationAvailabilities(0L, authentication, Pageable.unpaged()));
    }

    @Test
    void getAccommodationAvailabilitiesKo(){
        when(accommodationService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.getAccommodationAvailabilities(0L, authentication, Pageable.unpaged()));
    }

    /**     GET - API: /accommodation/{id}/unavailabilities
     *      MTEHOD: getAccommodationUnavailabilitiesDTO(...)
     */

    @Test
    void getAccommodationUnavailabilitiesDTO(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        when(bookingService.findUnavailabilitiesDTO(anyLong())).thenReturn(List.of(getInstance(UnavailabilityDTO.class)));
        assertDoesNotThrow(() -> accommodationController.getAccommodationUnavailabilitiesDTO(0L, authentication));
    }

    @Test
    void getAccommodationUnavailabilitiesDTOKo(){
        when(accommodationService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.getAccommodationUnavailabilitiesDTO(0L, authentication));
    }

    /**     GET - API: /availabilities/{accommodation_id}
     *      MTEHOD: getAvailabilities(...)
     */

    @Test
    void getAvailabilities(){
        when(availabilityService.findAvailableDatesByMonth(anyLong(),anyString(),anyString())).thenReturn(new HashMap<>());
        assertDoesNotThrow(() -> accommodationController.getAvailabilities(0L, "",""));
    }

    /**     POST - API: /accommodation
     *      MTEHOD: createAccommodationAPI(...)
     */

    @Test
    void createAccommodationAPI(){
        when(accommodationService.insertAccommodation(any())).thenReturn(getInstance(Accommodation.class));
        assertDoesNotThrow(() -> accommodationController.createAccommodationAPI(getInstance(Accommodation.class), authentication));
    }

    /**     PATCH - API: /accommodation/{id}/address
     *      MTEHOD: setAccommodationAddress(...)
     */

    @Test
    void setAccommodationAddress(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        when(accommodationService.setAccommodationAddress(any())).thenReturn(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationAddress(mockAccomodation, 0L, authentication));
    }

    @Test
    void setAccommodationAddressKoIds(){
        assertThrows(IdNotFoundException.class, () -> accommodationController.setAccommodationAddress(getInstance(Accommodation.class), 0L, authentication));
    }

    @Test
    void setAccommodationAddressKoDifferentId(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        assertThrows(InvalidJSONException.class, () -> accommodationController.setAccommodationAddress(mockAccomodation, 1L, authentication));
    }

    @Test
    void setAccommodationAddressKoRole(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        UserDTO mockUserDto = new UserDTO(1L, "","","");
        when(authentication.getPrincipal()).thenReturn(mockUserDto);
        assertThrows(ForbiddenException.class, () -> accommodationController.setAccommodationAddress(mockAccomodation, 0L, authentication));
    }

    /**     PATCH - API: /accommodation/{id}/services
     *      MTEHOD: setAccommodationServices(...)
     */

    @Test
    void setAccommodationServices(){
        when(accommodationService.setAccommodationServices(anyLong(), anyList(),anyLong())).thenReturn(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationServices(0L, List.of(), authentication));
    }

    @Test
    void setAccommodationServicesKo(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> accommodationController.setAccommodationServices(0L, List.of(), authentication));
    }

    /**     PATCH - API: /accommodation/{id}/availabilities
     *      MTEHOD: setAccommodationAvailabilities(...)
     */

    @Test
    void setAccommodationAvailabilities(){
        when(accommodationService.setAccommodationAvailabilities(anyLong(), anyList(),anyLong())).thenReturn(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationAvailabilities(0L, List.of(), authentication));
    }

    @Test
    void setAccommodationAvailabilitiesKo(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> accommodationController.setAccommodationAvailabilities(0L, List.of(), authentication));
    }

    /**     PATCH - API: /accommodation/{id}/unavailabilities
     *      MTEHOD: setAccommodationUnavailabilities(...)
     */

    @Test
    void setAccommodationUnavailabilities(){
        when(accommodationService.setAccommodationUnavailabilities(anyLong(), anyList(),anyLong())).thenReturn(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationUnavailabilities(0L, List.of(), authentication));
    }

    @Test
    void setAccommodationUnavailabilitiesKo(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> accommodationController.setAccommodationUnavailabilities(0L, List.of(), authentication));
    }

    /**     PATCH - API: /accommodation/{id}/unavailabilities
     *      MTEHOD: setAccommodationUnavailabilities(...)
     */

    @Test
    void setAccommodationInfo(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        when(accommodationService.setAccommodationInfo(mockAccomodation)).thenReturn(mockAccomodation);
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationInfo(mockAccomodation, 0L, authentication));
    }

    @Test
    void setAccommodationInfoKoIdsNull(){
        assertThrows(IdNotFoundException.class, () -> accommodationController.setAccommodationInfo(getInstance(Accommodation.class), 0L, authentication));
    }

    @Test
    void setAccommodationInfoKoIdsDifferent(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(1L);
        assertThrows(InvalidJSONException.class, () -> accommodationController.setAccommodationInfo(mockAccomodation, 0L, authentication));
    }

    @Test
    void setAccommodationInfoKoAuth(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.setAccommodationInfo(mockAccomodation, 0L, authentication));
    }

    /**     DELETE - API: /delete_accommodation/{id}
     *      MTEHOD: deleteAccommodationAPI(...)
     */

    @Test
    void deleteAccommodationAPINoBookings(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        when(accommodationService.hasNoBookings(any())).thenReturn(true);
        assertDoesNotThrow(() -> accommodationController.deleteAccommodationAPI(0L, authentication));
    }

    @Test
    void deleteAccommodationAPIBookings(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        when(accommodationService.findById(anyLong())).thenReturn(mockAccomodation);
        when(accommodationService.hasNoBookings(any())).thenReturn(false);
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.deleteAccommodationAPI(0L, authentication));
    }

    @Test
    void deleteAccommodationAPIKoNotFound(){
        when(accommodationService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.deleteAccommodationAPI(0L, authentication));
    }

    @Test
    void deleteAccommodationAPIKoAuth(){
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.deleteAccommodationAPI(0L, authentication));
    }

    /**     GET - API: /get_latest_uploads
     *      MTEHOD: getLatestUploadsDTO(...)
     */

    @Test
    void getLatestUploadsDTONoCICO(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.getLatestUploadsDTO(anyInt(), anyLong())).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.getLatestUploadsDTO(null, null, authentication));
    }

    @Test
    void getLatestUploadsDTOYesCICO(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.getLatestUploadsDTO(anyInt(), anyLong())).thenReturn(List.of(getInstance(AccommodationDTO.class)));
//  TODO: individuare formato time corretto
        assertDoesNotThrow(() -> accommodationController.getLatestUploadsDTO("2025-01-01", "2025-01-01", authentication));
    }

    @Test
    void getLatestUploadsDTOKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> accommodationController.getLatestUploadsDTO(null, null, authentication));
    }

    @Test
    void getLatestUploadsDTOYesCICOKo(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.getLatestUploadsDTO(anyInt(), anyLong())).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertThrows(ForbiddenException.class, () -> accommodationController.getLatestUploadsDTO("01/01/2025", "01/01/2025", authentication));
    }

    /**     GET - API: /prices
     *      MTEHOD: configurePriceRanges(...)
     */

    @Test
    void configurePriceRangesNoCICO(){
        when(accommodationService.configurePriceRanges(anyList(), any(), any())).thenReturn(List.of(getInstance(PriceDTO.class)));
        assertDoesNotThrow(() -> accommodationController.configurePriceRanges(List.of(0L),null, null));
    }

    @Test
    void configurePriceRangesYesCICO(){
        when(accommodationService.configurePriceRanges(anyList(), any(), any())).thenReturn(List.of(getInstance(PriceDTO.class)));
        assertDoesNotThrow(() -> accommodationController.configurePriceRanges(List.of(0L),"2025-01-01", "2025-01-01"));
    }

    @Test
    void configurePriceRangesYesCICOKo(){
        assertThrows(ForbiddenException.class, () -> accommodationController.configurePriceRanges(List.of(0L),"01/01/2025", "01/01/2025"));
    }

    /**     PATCH - API: /add-favourite/{user_id}/{accommodation_id}
     *      MTEHOD: addFavourite(...)
     */

    @Test
    void addFavourite(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        doNothing().when(accommodationService).addFavourite(anyLong(), anyLong());
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        assertDoesNotThrow(() -> accommodationController.addFavourite(0L, 0L, authentication));
    }

    @Test
    void addFavouriteKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.addFavourite(0L, 0L, authentication));
    }

    /**     PATCH - API: /remove-favourite/{user_id}/{accommodation_id}
     *      MTEHOD: removeFavourite(...)
     */

    @Test
    void removeFavourite(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        doNothing().when(accommodationService).removeFavourite(anyLong(), anyLong());
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        assertDoesNotThrow(() -> accommodationController.removeFavourite(0L, 0L, authentication));
    }

    @Test
    void removeFavouriteKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.removeFavourite(0L, 0L, authentication));
    }

    /**     GET - API: /favorites/{user_id}
     *      MTEHOD: showFavourites(...)
     */

    @Test
    void showFavourites(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.getFavouritesDTO(anyLong())).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.showFavourites(0L, authentication));
    }

    @Test
    void showFavouritesKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.showFavourites(0L, authentication));
    }

    /**     GET - API: /get_accommodations_to_approve
     *      MTEHOD: getAccommodationsToBeApproved(...)
     */

    @Test
    void getAccommodationsToBeApproved(){
        when(accommodationService.getAccommodationsToBeApproved()).thenReturn(List.of(getInstance(Accommodation.class)));
        assertDoesNotThrow(() -> accommodationController.getAccommodationsToBeApproved(authentication));
    }

    /**     GET - API: /get_accommodationsdto_to_approve
     *      MTEHOD: getAccommodationsDTOToBeApproved(...)
     */

    @Test
    void getAccommodationsDTOToBeApproved(){
        when(accommodationService.getAccommodationsDTOToBeApproved()).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.getAccommodationsDTOToBeApproved(authentication));
    }

    /**     GET - API: /get_my_accommodations/{userId}
     *      MTEHOD: getMyAccommodationsDTO(...)
     */

    @Test
    void getMyAccommodationsDTO(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(usrService.findById(anyLong())).thenReturn(getInstance(User.class));
        when(accommodationService.getMyAccommodationsDTO(anyLong())).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.getMyAccommodationsDTO(0L, authentication));
    }

    @Test
    void getMyAccommodationsDTOKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> accommodationController.getMyAccommodationsDTO(0L, authentication));
    }

    @Test
    void getMyAccommodationsDTOKoUserNotFound(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(usrService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationController.getMyAccommodationsDTO(0L, authentication));
    }

    /**     GET - API: /search
     *      MTEHOD: searchResults(...)
     */

    private final String DESTINATION = "Rome";

    @Test
    void searchResultsFree(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.findByUserInputFreeDTO(anyString()
                ,any()
                ,any()
                ,anyInt()
                ,anyList()
                ,anyString()
                ,anyLong()
        )).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,"2026-01-01"
                ,1
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsNotFree(){
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.findByUserInputDTO(anyString()
                ,any()
                ,any()
                ,anyInt()
                ,anyList()
                ,anyString()
                ,anyLong()
        )).thenReturn(List.of(getInstance(AccommodationDTO.class)));
        assertDoesNotThrow(() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,"2026-01-01"
                ,1
                ,false
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoDestination(){
        assertThrows(NullPointerException.class, () -> accommodationController.searchResults(null
                ,"2025-01-01"
                ,"2025-01-01"
                ,1
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoCI(){
        assertThrows(InvalidJSONException.class, () -> accommodationController.searchResults(DESTINATION
                ,""
                ,"2025-01-01"
                ,0
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoCO(){
        assertThrows(InvalidJSONException.class,() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,""
                ,0
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoCOBeforeCI(){
        assertThrows(InvalidJSONException.class,() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,"2024-01-01"
                ,0
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoNG(){
        assertThrows(ForbiddenException.class,() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,"2026-01-01"
                ,0
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    @Test
    void searchResultsKoAuth(){
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class,() -> accommodationController.searchResults(DESTINATION
                ,"2025-01-01"
                ,"2026-01-01"
                ,1
                ,true
                ,List.of(0L)
                ,"id"
                ,authentication));
    }

    /**     GET - API: /accommodation_info/{accommodationId}
     *      MTEHOD: getAccomodationDetails(...)
     */

    @Test
    void getAccomodationDetails(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.findById(anyLong())).thenReturn(mockAccomodation);
        when(accommodationService.isFavourite(anyLong(), anyLong())).thenReturn(true);
        assertDoesNotThrow(() -> accommodationController.getAccomodationDetails(authentication, 0L));
    }

    @Test
    void getAccomodationDetailsApprovalTimestamp(){
        Accommodation mockAccomodation = getInstance(Accommodation.class);
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        mockAccomodation.setApprovalTimestamp(LocalDateTime.now());
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(accommodationService.findById(anyLong())).thenReturn(mockAccomodation);
        when(accommodationService.getAccommodationReviews(anyLong())).thenReturn(List.of(getInstance(Review.class)));
        when(bookingService.hasPendingBooking(anyLong(),anyLong())).thenReturn(true);
        when(bookingService.pendingBooking(anyLong(),anyLong())).thenReturn(0L);
        when(accommodationService.isFavourite(anyLong(), anyLong())).thenReturn(true);
        assertDoesNotThrow(() -> accommodationController.getAccomodationDetails(authentication, 0L));
    }

    /**     PATCH - API: /approve_accommodation/{accommodation_id}
     *      MTEHOD: approveHouse(...)
     */

    @Test
    void approveHouse(){
        when(accommodationService.approveAccommodation(anyLong())).thenReturn(true);
        when(accommodationService.findById(anyLong())).thenReturn(getInstance(Accommodation.class));
        assertDoesNotThrow(() -> accommodationController.approveHouse(0L));
    }

    @Test
    void approveHouseKoIdNotFound(){
        when(accommodationService.approveAccommodation(anyLong())).thenReturn(false);
        assertThrows(IdNotFoundException.class, () -> accommodationController.approveHouse(0L));
    }
}
