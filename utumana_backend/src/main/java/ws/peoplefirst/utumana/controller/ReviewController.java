package ws.peoplefirst.utumana.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.service.ReviewService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

@RestController
@RequestMapping("/api")
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
	@Autowired
	private BookingService bookingService;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review/{id}")
	public Review getReviewDetails(@PathVariable Long id, Authentication auth) {
		log.debug("\"GET /review/"  + id + "\"");
		
		Review review = reviewService.getReviewById(id);
		
		if(review == null)
			throw new IdNotFoundException("Review with id " + id + " not found");
		
		if(review.getApprovalTimestamp() == null && !loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can read reviews yet to be approved");
		
		return review;
	}
	
	private boolean loggedUserIsBookingHost(Authentication auth, Long bookingId) {
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		Booking booking = bookingService.findById(bookingId);
		
		if(booking == null)
			throw new IdNotFoundException("Cannot find the booking with id " + bookingId + " associated with review");
		
		return userId.equals(booking.getAccommodation().getOwnerId()); 
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping("/review")
	public Review insertReview(@RequestBody Review review, Authentication auth) {
		log.debug("POST /review/" + review);
		
		if(!loggedUserIsBookingGuest(auth, review.getBookingId())) {
			log.warn("Only the guest can write a review");
			throw new ForbiddenException("Only the guest can write a review");
		}
		reviewService.createAndSaveReview(review);
		
		return review;
	}
	
	private boolean loggedUserIsBookingGuest(Authentication auth, Long bookingId) {
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		Booking booking = bookingService.findById(bookingId);
		
		if(booking == null)
			throw new IdNotFoundException("Cannot find the booking with id " + bookingId + " associated with review");
		
		return userId.equals(booking.getUser().getId());
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping("/review/{id}")
	public Review acceptReview(@PathVariable Long id, Authentication auth) {
		log.debug("PATCH /review/" + id);
		
		Review review = reviewService.getReviewById(id);
		
		if (review == null) throw new IdNotFoundException("No review with id " + id);
		
		if(!loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can accept a review to their accommodation");
		
		log.debug("review pre: " + review);
		review = reviewService.acceptReview(review);
		log.debug("review after: " + review);
		
		return review;
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping("/review/{id}")
	public String rejectReview(@PathVariable Long id, Authentication auth) {
		log.debug("DELETE /review/" + id);
		Review review = reviewService.getReviewById(id);
		
		if(review == null) throw new IdNotFoundException("No review with id " + id);
		
		if(!loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can reject a review to their accommodation");
		
		reviewService.deleteReview(review);
		
		return "Review successfully rejected";	
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review/user/{userId}")
	public List<ReviewDTO> getAllUserReview(@PathVariable Long userId, Authentication auth) {
		log.debug("DELETE /review/user/" + userId);
		return reviewService.getUserReview(userId);
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review_by_booking_id/{id}")
	public Review findByBookingID(Authentication auth, @PathVariable(name="id") Long id) {
		return reviewService.findByBookingId(id);
	}

}
