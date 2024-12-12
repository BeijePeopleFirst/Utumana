package ws.peoplefirst.utumana.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

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
		
		review.setOverallRating((review.getPosition() + review.getConvenience( ) + review.getComfort()) / 3);
		
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
		if(review.getComfort() > 5.0 || review.getComfort() < 0.0 ||
				review.getConvenience() > 5.0 || review.getConvenience() < 0.0 ||
				review.getPosition() > 5.0 || review.getPosition() < 0.0)
			return false;
		return true;
	}
	
	
	public Double calculateOverallRating(Model model,Review review) throws IllegalArgumentException{
		boolean isTitleOK = review.getTitle()!=null && !review.getTitle().isBlank();
		
		if(!isTitleOK) {
			model.addAttribute("titleerror","the title cannot be blank.");
		}
		
		boolean isPositionOK = review.getPosition()!=null;
		if(!isPositionOK) {
			model.addAttribute("positionerror","you must choose a grade for position.");
		}
		
		boolean isConvenienceOK=review.getConvenience()!=null;
		if(!isConvenienceOK) {
			model.addAttribute("convenienceerror","you must choose a grade for convenience.");
		}
		
		boolean isComfortOK=review.getComfort()!=null;
		if(!isComfortOK) {
			model.addAttribute("comforterror","you must choose a grade for comfort.");
		}
	
		if(isTitleOK && isPositionOK && isConvenienceOK && isComfortOK) {
			return (review.getPosition()+review.getConvenience()+review.getComfort())/3;
		}else {
			throw new IllegalArgumentException("missing some review values");
		}
	}
	
	public void deleteReview(Review review) {
		if(review != null) {
			reviewRepository.delete(review);
		} else {
			throw new NullPointerException("Review is null");
		}
	}
	
	public void deleteReview(Long id) {
		if(id != null)
			reviewRepository.deleteById(id);
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
		
	public List<ReviewDTO> getUserReview(Long userId) {
		return userRepository.findUserReviews(userId);
	}
}
