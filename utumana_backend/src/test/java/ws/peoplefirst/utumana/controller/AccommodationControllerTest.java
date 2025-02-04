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
import org.springframework.security.test.context.support.WithMockUser;
import ws.peoplefirst.utumana.dto.UnavailabilityDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Service;
import ws.peoplefirst.utumana.repository.AccommodationRepository;
import ws.peoplefirst.utumana.service.AccommodationService;
import ws.peoplefirst.utumana.service.AvailabilityService;
import ws.peoplefirst.utumana.service.BookingService;

import java.util.HashMap;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
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
    private Authentication authentication;

    /**
     *      Reusable methods
     */

    private Accommodation getAccomodation(){
        return new Accommodation();
    }

    private Availability getAvailability(){
        return new Availability();
    }

    private Service getService(){
        return new Service();
    }

    private UnavailabilityDTO getUnavailabilityDTO(){
        return new UnavailabilityDTO();
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
                .thenReturn(getPage(List.of(getAccomodation())));
        assertDoesNotThrow(() -> accommodationController.getAllAccommodationsAPI(authentication, Pageable.unpaged()));
    }

    /**     GET - API: /accommodation/{id}
     *      MTEHOD: getSingleAccommodationAPI(...)
     */

    @Test
    void getSingleAccommodationAPI(){
        when(accommodationService.findById(anyLong())).thenReturn(getAccomodation());
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
        when(accommodationService.findById(anyLong())).thenReturn(getAccomodation());
        when(accommodationService.getAccommodationServices(anyLong())).thenReturn(Set.of(getService()));
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
        when(accommodationService.findById(anyLong())).thenReturn(getAccomodation());
        when(availabilityService.findByAccommodationId(anyLong(),any())).thenReturn(getPage(List.of(getAvailability())));
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
        when(accommodationService.findById(anyLong())).thenReturn(getAccomodation());
        when(bookingService.findUnavailabilitiesDTO(anyLong())).thenReturn(List.of(getUnavailabilityDTO()));
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
        when(accommodationService.insertAccommodation(any())).thenReturn(getAccomodation());
        assertDoesNotThrow(() -> accommodationController.createAccommodationAPI(getAccomodation(), authentication));
    }

    /**     PATCH - API: /accommodation/{id}/address
     *      MTEHOD: setAccommodationAddress(...)
     */

    @Mock
    private UserDTO userDTO;

    @Test
    void setAccommodationAddress(){
        Accommodation mockAccomodation = getAccomodation();
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        when(accommodationService.setAccommodationAddress(any())).thenReturn(getAccomodation());
        when(authentication.getPrincipal()).thenReturn(userDTO);
        assertDoesNotThrow(() -> accommodationController.setAccommodationAddress(mockAccomodation, 0L, authentication));
    }

    @Test
    void setAccommodationAddressKoIds(){
        assertThrows(IdNotFoundException.class, () -> accommodationController.setAccommodationAddress(getAccomodation(), 0L, authentication));
    }

    @Test
    void setAccommodationAddressKoDifferentId(){
        Accommodation mockAccomodation = getAccomodation();
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        assertThrows(InvalidJSONException.class, () -> accommodationController.setAccommodationAddress(mockAccomodation, 1L, authentication));
    }

    @Test
    void setAccommodationAddressKoRole(){
        Accommodation mockAccomodation = getAccomodation();
        mockAccomodation.setOwnerId(0L);
        mockAccomodation.setId(0L);
        UserDTO mockUserDto = new UserDTO(1L, "","","");
        when(authentication.getPrincipal()).thenReturn(mockUserDto);
        assertThrows(ForbiddenException.class, () -> accommodationController.setAccommodationAddress(mockAccomodation, 0L, authentication));
    }


}
