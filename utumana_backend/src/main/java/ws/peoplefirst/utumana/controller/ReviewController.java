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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@Tag(name = "Reviews", description = "Endpoints for reviews operations")
public class ReviewController {
	@Autowired
	private ReviewService reviewService;
	
	@Autowired
	private BookingService bookingService;
	
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Operation(summary = "Get review by review ID", description = "Get review info by id", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review info returned successfully.",
                    content = @Content(schema = @Schema(implementation = Review.class))),
            @ApiResponse(responseCode = "403", description = "Review with given id exists but it is not public, because the host hasn't approved it yet.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Review with given id does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review/{id}")
	public Review getReviewDetails(@Parameter(description = "id of the review", example = "1") @PathVariable Long id, Authentication auth) {
		log.debug("GET /review/"  + id);
		
		Review review = reviewService.getReviewById(id);
		
		if(review == null)
			throw new IdNotFoundException("Review with id " + id + " not found");
		
		if(review.getApprovalTimestamp() == null && !loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can read reviews yet to be approved");
		
		return review;
	}
	
	/** Returns true if logged user is the owner of the accommodation associated with the booking with given bookingId.
	 *  Otherwise, returns false. */
	private boolean loggedUserIsBookingHost(Authentication auth, Long bookingId) {
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		Booking booking = bookingService.findById(bookingId);
		
		if(booking == null)
			throw new IdNotFoundException("Cannot find the booking with id " + bookingId + " associated with review");
		
		return userId.equals(booking.getAccommodation().getOwnerId()); 
	}
	
	@Operation(summary = "Create a review", description = "Create a new review. The review is saved but not published until the owner of the accommodation reviewed approves it."
			+ "The review's overall rating is calculated based on the other star ratings (comfort, convenience and position).", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review saved successfully. The saved review is returned (approval timestamp is null).",
                    content = @Content(schema = @Schema(implementation = Review.class), 
            		examples = @ExampleObject(value = "{ \"id\": 1, \"bookingId\": 1, "
        		      		+ "\"title\": \"Wonderful house in the city\", "
        		      		+ "\"description\": \"The house was cozy and the owner Mario made us feel at home since the beginning. Close to the subway in the city center.\", "
        		      		+ "\"overallRating\": 4.33, "
        		      		+ "\"comfort\": 4.0, \"convenience\": 4.0, \"position\": 5.0 }"))),
            @ApiResponse(responseCode = "400", description = "The review is invalid and cannot be saved. A review is invalid if:\n"
            		+ "- it is null\n- both the desciption and all the star ratings are blank\n- one or more non-null star ratings are not between 0.0 and 5.0", content = @Content),
            @ApiResponse(responseCode = "403", description = "The review cannot be saved, either because the user is not the associated booking's guest or because a review associated "
            		+ "with that booking already exists. A review can be written only by the guest of a past booking. Only one review per booking is allowed.", content = @Content),
            @ApiResponse(responseCode = "404", description = "The review cannot be saved. The booking with id = bookingId associated with this review doesn't exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PostMapping("/review")
	public Review insertReview(
			@io.swagger.v3.oas.annotations.parameters.RequestBody(
		      description = "Review to be saved", required = true,
		      content = @Content(mediaType = "application/json",
		      schema = @Schema(implementation = Review.class),
		      examples = @ExampleObject(value = "{ \"bookingId\": 1, "
		      		+ "\"title\": \"Wonderful house in the city\", "
		      		+ "\"description\": \"The house was cozy and the owner Mario made us feel at home since the beginning. Close to the subway in the city center.\","
		      		+ "\"comfort\": 4.0, \"convenience\": 4.0, \"position\": 5.0 }")))
			@RequestBody Review review, 
			Authentication auth) {
		log.debug("POST /review/" + review);
		
		if(!loggedUserIsBookingGuest(auth, review.getBookingId())) {
			log.warn("Only the guest can write a review");
			throw new ForbiddenException("Only the guest can write a review");
		}
		reviewService.createAndSaveReview(review);
		
		return review;
	}
	
	/** Returns true if logged user is the guest who made the the booking with given bookingId.
	 *  Otherwise, returns false. 
	 *  Throws IdNotFoundException if the booking doesn't exist. */
	private boolean loggedUserIsBookingGuest(Authentication auth, Long bookingId) {
		Long userId = AuthorizationUtility.getUserFromAuthentication(auth).getId();
		Booking booking = bookingService.findById(bookingId);
		
		if(booking == null)
			throw new IdNotFoundException("Cannot find the booking with id " + bookingId + " associated with review");
		
		return userId.equals(booking.getUser().getId());
	}
	
	@Operation(summary = "Accept a review", description = "Accept a review. A review accepted by the owner of the accommodation will become visible to all users.", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review accepted successfully. The updated review is returned.",
                    content = @Content(schema = @Schema(implementation = Review.class))),
            @ApiResponse(responseCode = "403", description = "The user cannot accept this review. A review can only be accepted by the owner of the accommodation.", content = @Content),
            @ApiResponse(responseCode = "404", description = "Review with given id does not exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@PatchMapping("/review/{id}")
	public Review acceptReview(@Parameter(description = "id of the review", example = "1") @PathVariable Long id, Authentication auth) {
		log.debug("PATCH /review/" + id);
		
		Review review = reviewService.getReviewById(id);
		
		if (review == null) throw new IdNotFoundException("No review with id " + id);
		
		if(!loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can accept a review to their accommodation");
		
		review = reviewService.acceptReview(review);
		
		return review;
	}
	
	@Operation(summary = "Reject a review", description = "Reject a review. A review rejected by the owner of the accommodation will be deleted.", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review deleted successfully. The return value is true.",
                    content = @Content(schema = @Schema(implementation = Boolean.class), examples = @ExampleObject(value = "{ true }"))),
            @ApiResponse(responseCode = "403", description = "The user cannot reject this review. A review can only be rejected by the owner of the accommodation.", content = @Content),
            @ApiResponse(responseCode = "404", description = "The review cannot be deleted. Either the review does not exist or its associated booking doesn't exist.", content = @Content)
    })
	@PreAuthorize("hasAuthority('USER')")
	@DeleteMapping("/review/{id}")
	public Boolean rejectReview(@Parameter(description = "id of the review", example = "1") @PathVariable Long id, Authentication auth) {
		log.debug("DELETE /review/" + id);
		Review review = reviewService.getReviewById(id);
		
		if(review == null) throw new IdNotFoundException("No review with id " + id);
		
		if(!loggedUserIsBookingHost(auth, review.getBookingId()))
			throw new ForbiddenException("Only the host can reject a review to their accommodation");
		
		reviewService.deleteReview(review.getBookingId());
		
		return true;	
	}
	
	@Operation(summary = "Get all the reviews received by the user", 
			description = "Get all the reviews received by all of the accommodations owned by the user. The results also include reviews yet to be accepted.", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews returned successfully. If the user with given userId doesn't exist, an empty list is returned.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Review.class))))
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review/user/{userId}")
	public List<Review> getAllUserReview(@Parameter(description = "id of the user", example = "14") @PathVariable Long userId, Authentication auth) {
		log.debug("GET /review/user/" + userId);
		return reviewService.getUserReview(userId);
	}
	
	@Operation(summary = "Get review by booking ID", description = "Get the review associated with given booking ID.", tags = { "Reviews" })
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review returned successfully. If the booking with given id doesn't exist or it isn't associated with any reviews, it returns null.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Review.class))))
    })
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/review_by_booking_id/{bookingId}")
	public Review findByBookingID(Authentication auth, @Parameter(description = "id of the booking", example = "1") @PathVariable(name="bookingId") Long bookingId) {
		return reviewService.findByBookingId(bookingId);
	}

}
