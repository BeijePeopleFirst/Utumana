package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.AccommodationDTO;
import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.DBException;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.service.AvailabilityService;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.utility.BookingStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @InjectMocks
    private BookingController bookingController;

    @Mock
    private BookingService bookingService;

    @Mock
    private AvailabilityService availabilityService;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDTO userDTO;

    /**
     * Reusable methods
     */

    private <T> T getInstance(Class<T> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Impossibile creare una nuova istanza di " + clazz, e);
        }
    }

    private BookingDTO getBookingDTO() {
        return new BookingDTO(0L
                , 0.0
                , BookingStatus.ACCEPTED
                , LocalDateTime.now()
                , LocalDateTime.now()
                , 0L
                , getInstance(AccommodationDTO.class)
        );
    }

    /**
     * GET - API: /myBookingGuest
     * MTEHOD: openBookingGuest(...)
     */

    @Test
    void openBookingGuest() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.findAllBookingsDTOById(anyLong(), any())).thenReturn(getInstance(ArrayList.class));
        assertDoesNotThrow(() -> bookingController.openBookingGuest(authentication, null));
    }

    @Test
    void openBookingGuestKoAuth() {
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> bookingController.openBookingGuest(authentication, null));
    }

    /**
     * GET - API: /myBookingHost
     * MTEHOD: openBookingHost(...)
     */

    @Test
    void openBookingHost() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.findAllHostBookingsDTO(anyLong())).thenReturn(getInstance(ArrayList.class));
        assertDoesNotThrow(() -> bookingController.openBookingHost(authentication));
    }

    @Test
    void openBookingHostKoAuth() {
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> bookingController.openBookingHost(authentication));
    }

    /**
     * PATCH - API: /manage_booking/{booking_id}/approve
     * MTEHOD: manageBookingAppove(...)
     */

    @Test
    void manageBookingAppove() {
        when(bookingService.hostActionOnBooking(anyLong(), any())).thenReturn(getInstance(Booking.class));
        assertDoesNotThrow(() -> bookingController.manageBookingAppove(authentication, 0L));
    }

    /**
     * PATCH - API: /manage_booking/{booking_id}/reject
     * MTEHOD: manageBookingReject(...)
     */

    @Test
    void manageBookingReject() {
        when(bookingService.hostActionOnBooking(anyLong(), any())).thenReturn(getInstance(Booking.class));
        assertDoesNotThrow(() -> bookingController.manageBookingReject(authentication, 0L));
    }

    /**
     * DELETE - API: /delete_booking/{booking_id}
     * MTEHOD: deleteBooking(...)
     */

    @Test
    void deleteBooking() {
        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setAccommodation(getInstance(Accommodation.class));
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.deleteBookingFromId(anyLong(), anyLong())).thenReturn(mockBooking);
        assertDoesNotThrow(() -> bookingController.deleteBooking(authentication, 0L));
    }

    @Test
    void deleteBookingKoAuth() {
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(TheJBeansException.class, () -> bookingController.deleteBooking(authentication, 0L));
    }

    @Test
    void deleteBookingKoNotFound() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.deleteBookingFromId(anyLong(), anyLong())).thenReturn(null);
        assertThrows(DBException.class, () -> bookingController.deleteBooking(authentication, 0L));
    }

    /**
     * POST - API: /book/{accommodation_id}
     * MTEHOD: bookAccommodation(...)
     */

    @Test
    void bookAccommodation() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.checkDate(anyString(), anyString())).thenReturn(getInstance(HashMap.class));
        when(bookingService.isBookingPresentAlreadyOrOverlapping(anyLong(), anyLong(), any(), any())).thenReturn(false);
        when(availabilityService.findAvailabilities(anyLong(), anyString(), anyString())).thenReturn(List.of(getInstance(Availability.class)));
        when(availabilityService.calculatePrice(anyList(), any(), any())).thenReturn(0.0);
        when(bookingService.bookAndReturnBooking(anyLong(), anyLong(), any(), any(), anyDouble())).thenReturn(getBookingDTO());
        assertDoesNotThrow(() -> bookingController.bookAccommodation(authentication, 0L, "2025-01-01", "2026-01-01"));
    }

    @Test
    void bookAccommodationKoBookingPresentAlreadyOrOverlapping() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.checkDate(anyString(), anyString())).thenReturn(getInstance(HashMap.class));
        when(bookingService.isBookingPresentAlreadyOrOverlapping(anyLong(), anyLong(), any(), any())).thenReturn(true);
        assertThrows(ForbiddenException.class, () -> bookingController.bookAccommodation(authentication, 0L, "2025-01-01", "2026-01-01"));
    }

    @Test
    void bookAccommodationKoAvailability() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.checkDate(anyString(), anyString())).thenReturn(getInstance(HashMap.class));
        when(bookingService.isBookingPresentAlreadyOrOverlapping(anyLong(), anyLong(), any(), any())).thenReturn(false);
        when(availabilityService.findAvailabilities(anyLong(), anyString(), anyString())).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> bookingController.bookAccommodation(authentication, 0L, "2025-01-01", "2026-01-01"));
    }

    @Test
    void bookAccommodationKoBookingDTO() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.checkDate(anyString(), anyString())).thenReturn(getInstance(HashMap.class));
        when(bookingService.isBookingPresentAlreadyOrOverlapping(anyLong(), anyLong(), any(), any())).thenReturn(false);
        when(availabilityService.findAvailabilities(anyLong(), anyString(), anyString())).thenReturn(List.of(getInstance(Availability.class)));
        when(availabilityService.calculatePrice(anyList(), any(), any())).thenReturn(0.0);
        when(bookingService.bookAndReturnBooking(anyLong(), anyLong(), any(), any(), anyDouble())).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> bookingController.bookAccommodation(authentication, 0L, "2025-01-01", "2026-01-01"));
    }

    /**
     * GET - API: /unavailabilities/{accommodation_id}
     * MTEHOD: getUnavailabilityList(...)
     */

    @Test
    void getUnavailabilityList() {
        when(bookingService.findUnavailabilities(anyLong())).thenReturn(List.of(getBookingDTO()));
        assertDoesNotThrow(() -> bookingController.getUnavailabilityList(authentication, 0L));
    }

    /**
     * GET - API: /add_unavailability
     * MTEHOD: addUnavilability(...)
     */

    @Test
    void addUnavilability() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.addUnAvailabilities(anyLong(), any())).thenReturn(getInstance(Booking.class));
        assertDoesNotThrow(() -> bookingController.addUnavilability(authentication, getInstance(Availability.class)));
    }

    /**
     * DELETE - API: /delete_unavailability/{booking_id}
     * MTEHOD: deleteUnavilability(...)
     */

    @Test
    void deleteUnavilability() {
        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.deleteUnAvailabilities(anyLong(), anyLong())).thenReturn(getInstance(Booking.class));
        assertDoesNotThrow(() -> bookingController.deleteUnavilability(authentication, 0L));
    }

    /**
     * GET - API: /booking/{id}
     * MTEHOD: getSingleDONEBookingById(...)
     */

    @Test
    void getSingleDONEBookingById() {
        when(bookingService.findByIdIfDONE(anyLong())).thenReturn(getInstance(Booking.class));
        assertDoesNotThrow(() -> bookingController.getSingleDONEBookingById(0L, authentication));
    }

    /**
     * PATCH - API: /booking_assign_review/{id}
     * MTEHOD: assignReviewToBooking(...)
     */

    @Test
    void assignReviewToBooking() {
        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setId(0L);
        mockBooking.setUserId(0L);
        when(bookingService.findByIdIfDONE(anyLong())).thenReturn(mockBooking);
        when(authentication.getPrincipal()).thenReturn(userDTO);
        doNothing().when(bookingService).save(any());
        assertDoesNotThrow(() -> bookingController.assignReviewToBooking(0L, mockBooking, authentication));
    }

    @Test
    void assignReviewToBookingKoDifferentId() {
        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setId(1L);
        when(bookingService.findByIdIfDONE(anyLong())).thenReturn(mockBooking);
        assertThrows(InvalidJSONException.class, () -> bookingController.assignReviewToBooking(0L, getInstance(Booking.class), authentication));
    }

    @Test
    void assignReviewToBookingKoDifferentUserId() {
        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setUserId(1L);
        when(bookingService.findByIdIfDONE(anyLong())).thenReturn(mockBooking);
        assertThrows(ForbiddenException.class, () -> bookingController.assignReviewToBooking(0L, getInstance(Booking.class), authentication));
    }

    @Test
    void assignReviewToBookingKoAuth() {
        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setId(0L);
        mockBooking.setUserId(0L);
        when(bookingService.findByIdIfDONE(anyLong())).thenReturn(mockBooking);
        when(authentication.getPrincipal()).thenReturn(null);
        assertThrows(ForbiddenException.class, () -> bookingController.assignReviewToBooking(0L, mockBooking, authentication));
    }
}