package ws.peoplefirst.utumana.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.repository.ReviewRepository;
import ws.peoplefirst.utumana.repository.UserRepository;

@Service
public class ReviewService {
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private ReviewRepository reviewRepository;

	@Autowired
	private UserRepository userRepository;
	
	public Review getReviewById(Long id) {
		return reviewRepository.findById(id).orElse(null);
	}
	
	public void createAndSaveReview(Review review) {
		if(review == null)
			throw new TheJBeansException("Trying to save a null review");
		
		Booking booking = bookingRepository.findByIdAndIsUnavailabilityIsFalse(review.getBookingId());
		
		if(booking == null)
			throw new IdNotFoundException("Booking id associated with review is null");
		
		if(booking.getReview() != null)	
			throw new ForbiddenException("It is forbidden to rewrite a review");
		
		if(!isReviewOK(review))
			throw new InvalidJSONException("Invalid review");
		
		if(review.getComfort() != null && review.getConvenience() != null && review.getPosition() != null)
			review.setOverallRating((review.getPosition() + review.getConvenience( ) + review.getComfort()) / 3);
		
		review.setApprovalTimestamp((String)null);
		review = reviewRepository.save(review);
		
		booking.setReview(review);
		bookingRepository.save(booking);
	}
	
	public boolean isReviewOK(Review review) {	
		// set blank fields to null
		if(review.getTitle() != null && review.getTitle().isBlank())	review.setTitle(null);
		if(review.getDescription() != null && review.getDescription().isBlank())	review.setDescription(null);
		
		// check that there is either a description or a complete star rating
		if(review.getDescription() == null && (review.getComfort() == null || review.getConvenience() == null || review.getPosition() == null))
			return false;
		
		// check that each star rating is between 0.0 and 5.0
		if(	(review.getComfort() != null && (review.getComfort() > 5.0 || review.getComfort() < 0.0)) ||
			(review.getConvenience() != null && (review.getConvenience() > 5.0 || review.getConvenience() < 0.0)) ||
			(review.getPosition() != null && (review.getPosition() > 5.0 || review.getPosition() < 0.0)))
			return false;
		return true;
	}
	
	public void deleteReview(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId).orElse(null);
		if(booking == null)	throw new IdNotFoundException("Cannot delete review because its booking doesn't exist");
		Review review = booking.getReview();
		booking.setReview(null);
		bookingRepository.save(booking);
		reviewRepository.delete(review);
	}
	
	public Review acceptReview(Review review) {
		if(review != null) {
			review.setApprovalTimestamp(LocalDateTime.now());
			return reviewRepository.save(review);
		} else {
			throw new NullPointerException("Review is null");
		}
	}

	public Review findByBookingId(Long id) {
		return reviewRepository.findByBookingId(id);
	}	
		
	public List<Review> getUserReview(Long userId) {
		return userRepository.findUserReviews(userId);
	}
}
