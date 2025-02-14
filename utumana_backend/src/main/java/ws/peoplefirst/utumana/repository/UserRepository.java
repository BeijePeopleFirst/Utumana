package ws.peoplefirst.utumana.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ws.peoplefirst.utumana.dto.ReviewDTO;
import ws.peoplefirst.utumana.dto.UserDTO;
import ws.peoplefirst.utumana.model.BadgeAward;
import ws.peoplefirst.utumana.model.Review;
import ws.peoplefirst.utumana.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{

	public User findUserByEmailAndPasswordAndArchivedTimestampIsNull(String email, String password);
	
	public User findUserByEmail(String email);
	
	 @Query("SELECT DISTINCT u FROM User u WHERE u.id <> :userId AND u.email = :email")
	public User findUserByEmailExceptMe(@Param(value="email")String email,@Param(value="userId")Long userId);
	
	@Query("SELECT new ws.peoplefirst.utumana.dto.ReviewDTO(b.review.id, b.review.title, b.review.description, b.review.overallRating, b.review.approvalTimestamp) FROM Booking AS b "
			+ "where b.accommodation.ownerId = :id AND b.accommodation.hidingTimestamp IS NULL")
	public List<ReviewDTO> findUserReviewsDTO(@Param(value="id")Long id);
	
	@Query("SELECT b.review FROM Booking AS b "
			+ "where b.accommodation.ownerId = :id AND b.accommodation.hidingTimestamp IS NULL ORDER BY b.review.approvalTimestamp DESC")
	public List<Review> findUserReviews(@Param(value="id")Long id);
	
	@Query(value = "SELECT u FROM User as u LEFT JOIN FETCH u.favourites WHERE u.id = :userId")
	public User getUserWithFavourites(@Param(value="userId") Long userId);
	
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.badges WHERE u.id = :userId")
    Optional<User> findByIdWithBadges(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT u FROM User u WHERE u.id <> :userId AND u.archivedTimestamp is null")
    public List<User> findAllUserExceptMe(@Param("userId") Long userId);

    @Query("SELECT new ws.peoplefirst.utumana.dto.UserDTO(u.id, u.name, u.surname, u.email) FROM User as u WHERE u.archivedTimestamp is null")
	public List<UserDTO> findAllDTO();
    
    @Query("SELECT new ws.peoplefirst.utumana.dto.UserDTO(u.id, u.name, u.surname, u.email) FROM User as u WHERE u.archivedTimestamp is not null")
    public List<UserDTO> findAllArchivedUsers();

    @Query("SELECT b FROM BadgeAward AS b LEFT JOIN FETCH b.user WHERE b.user.id = :userId ORDER BY b.awardDate DESC, b.badge.score DESC")
    public List<BadgeAward> findAllUserBadges(@Param("userId") Long userId);

}
