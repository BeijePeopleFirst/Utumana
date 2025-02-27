package ws.peoplefirst.utumana.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.service.ReviewService;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReviewControllerTest {

    @InjectMocks
    private ReviewController reviewController;

    @Mock
    private ReviewService reviewService;
    @Mock
    private BookingService bookingService;

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


    /**
     * GET - API: /review/{id}
     * MTEHOD: getReviewDetails(...)
     */

    @Test
    void getReviewDetails() {
        Review review = getInstance(Review.class);
        review.setApprovalTimestamp("2024-11-06T15:39:45");
        when(reviewService.getReviewById(anyLong())).thenReturn(review);
        assertDoesNotThrow(() -> reviewController.getReviewDetails(anyLong(), authentication));
    }

    @Test
    void getReviewDetailsKoIdNotFound() {
        when(reviewService.getReviewById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> reviewController.getReviewDetails(anyLong(), authentication));
    }

    @Test
    void getReviewDetailsKoForbidden() {

        Long reviewId = 3L;
        Long bookingId = 200L;
        Long hostId = 10L;
        Long userId = 20L; // Utente NON è l'host

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        Booking mockBooking = new Booking();
        Accommodation mockAccommodation = new Accommodation();
        mockAccommodation.setOwnerId(hostId);
        mockBooking.setAccommodation(mockAccommodation);

        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");

        when(reviewService.getReviewById(reviewId)).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(mockBooking);

        assertThrows(ForbiddenException.class, () -> reviewController.getReviewDetails(reviewId, authentication));

    }

    @Test
    void getReviewDetailsKoBookingNotFoound() {

        Long reviewId = 3L;
        Long bookingId = 200L;
        Long userId = 20L;

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");

        when(reviewService.getReviewById(reviewId)).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(null);

        assertThrows(IdNotFoundException.class, () -> reviewController.getReviewDetails(reviewId, authentication));

    }

    /**
     * GET - API: /review_by_booking_id/{bookingId}
     * MTEHOD: findByBookingID(...)
     */

    @Test
    void findByBookingID(){
        Review mockReview = new Review();
        when(reviewService.findByBookingId(anyLong())).thenReturn(mockReview);
        assertDoesNotThrow(() -> reviewController.findByBookingID(authentication, anyLong()));
    }

    /**
     * GET - API: /review/user/{userId}
     * MTEHOD: getAllUserReview(...)
     */

    @Test
    void getAllUserReview() {
        when( reviewService.getUserReview(anyLong())).thenReturn(List.of(getInstance(Review.class)));
        assertDoesNotThrow(() -> reviewController.getAllUserReview(anyLong(), authentication));
    }

    /**
     * POST - API: /review
     * MTEHOD: insertReview(...)
     */

    @Test
    void insertReviewKoForbidden() {
        Review mockReview = getInstance(Review.class);
        mockReview.setBookingId(1L);

        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setUser(getInstance(User.class));

        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.findById(anyLong())).thenReturn(mockBooking);
        assertThrows(ForbiddenException.class, () -> reviewController.insertReview(mockReview, authentication));

    }

    @Test
    void insertReviewKoBookingNotFound() {
        Review mockReview = getInstance(Review.class);
        mockReview.setBookingId(1L);

        Booking mockBooking = getInstance(Booking.class);
        mockBooking.setUser(getInstance(User.class));

        when(authentication.getPrincipal()).thenReturn(userDTO);
        when(bookingService.findById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> reviewController.insertReview(mockReview, authentication));

    }

    @Test
    void insertReviewSuccess() {
        Review mockReview = getInstance(Review.class);
        mockReview.setBookingId(1L);

        Booking mockBooking = getInstance(Booking.class);
        User user = new User();
        user.setId(1L);
        mockBooking.setUser(user);

        UserDTO mockUser = new UserDTO(1L, "User", "Test", "user@example.com");

        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(anyLong())).thenReturn(mockBooking);
        doNothing().when(reviewService).createAndSaveReview(mockReview);
        assertDoesNotThrow( () -> reviewController.insertReview(mockReview, authentication));

    }

    /**
     * POST - API: /review/{id}
     * MTEHOD: insertReview(...)
     */

    @Test
    void acceptReview() {
        Long reviewId = 3L;
        Long bookingId = 200L;
        Long hostId = 10L;
        Long userId = 10L; // Utente è l'host

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        Booking mockBooking = new Booking();
        Accommodation mockAccommodation = new Accommodation();
        mockAccommodation.setOwnerId(hostId);
        mockBooking.setAccommodation(mockAccommodation);
        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");

        when(reviewService.getReviewById(anyLong())).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(mockBooking);
        assertDoesNotThrow( () -> reviewController.acceptReview(userId, authentication));
    }

    @Test
    void acceptReviewKoForbidden() {
        Long reviewId = 3L;
        Long bookingId = 200L;
        Long hostId = 10L;
        Long userId = 20L; // Utente NON è l'host

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        Booking mockBooking = new Booking();
        Accommodation mockAccommodation = new Accommodation();
        mockAccommodation.setOwnerId(hostId);
        mockBooking.setAccommodation(mockAccommodation);
        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");

        when(reviewService.getReviewById(anyLong())).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(mockBooking);
        assertThrows(ForbiddenException.class, () -> reviewController.acceptReview(userId, authentication));
    }


    @Test
    void acceptReviewKoIdNull() {
        when(reviewService.getReviewById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> reviewController.acceptReview(anyLong(), authentication));
    }

    /**
     * DELETE - API: /review/{id}
     * MTEHOD: rejectReview(...)
     */

    @Test
    void rejectReviewKoIdNull() {
        when(reviewService.getReviewById(anyLong())).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> reviewController.rejectReview(anyLong(), authentication));
    }

    @Test
    void rejectReviewKoForbidden() {
        Long reviewId = 3L;
        Long bookingId = 200L;
        Long hostId = 10L;
        Long userId = 20L; // Utente NON è l'host

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        Booking mockBooking = new Booking();
        Accommodation mockAccommodation = new Accommodation();
        mockAccommodation.setOwnerId(hostId);
        mockBooking.setAccommodation(mockAccommodation);
        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");
        when(reviewService.getReviewById(anyLong())).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(mockBooking);
        assertThrows(ForbiddenException.class, () -> reviewController.rejectReview(anyLong(), authentication));
    }

    @Test
    void rejectReviewSuccess() {
        Long reviewId = 3L;
        Long bookingId = 200L;
        Long hostId = 10L;
        Long userId = 10L; // Utente è l'host

        Review mockReview = new Review();
        mockReview.setId(reviewId);
        mockReview.setBookingId(bookingId);

        Booking mockBooking = new Booking();
        Accommodation mockAccommodation = new Accommodation();
        mockAccommodation.setOwnerId(hostId);
        mockBooking.setAccommodation(mockAccommodation);
        UserDTO mockUser = new UserDTO(userId, "User", "Test", "user@example.com");

        when(reviewService.getReviewById(anyLong())).thenReturn(mockReview);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        when(bookingService.findById(bookingId)).thenReturn(mockBooking);
        assertDoesNotThrow( () -> reviewController.rejectReview(anyLong(), authentication));
    }



}
