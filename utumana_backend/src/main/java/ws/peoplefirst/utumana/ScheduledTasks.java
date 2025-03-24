package ws.peoplefirst.utumana;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ws.peoplefirst.utumana.model.AccommodationDraft;
import ws.peoplefirst.utumana.model.AdminPerformedOperation;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.repository.AccommodationDraftRepository;
import ws.peoplefirst.utumana.repository.AdminPerformedOperationRepository;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.service.AccommodationDraftService;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.utility.BookingStatus;


@Component
@EnableScheduling
public class ScheduledTasks {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private AccommodationDraftService accommodationDraftService;
	
	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private AccommodationDraftRepository accommodationDraftRepository;

	@Autowired
	private AdminPerformedOperationRepository adminPerformedOperationRepository;
	
	
	@Scheduled(fixedDelay = 86400000)	// 24h
	public void updateBookingStatus(){
		
		List<Booking> expiredBooking = bookingRepository.findExpiredBookings(LocalDateTime.now());
		
		List<Booking> startedBooking = bookingRepository.findStartedBookings(LocalDateTime.now());
		
		for (Booking b: startedBooking){
			b.setStatus(BookingStatus.DOING);
			bookingRepository.save(b);
		}
		
		for (Booking b: expiredBooking){
			b.setStatus(BookingStatus.DONE);
			bookingRepository.save(b);
		}
	}
	
	/** Delete accommodation drafts modified for the last time more than 6 months ago. */
	@Scheduled(fixedDelay = 86400000)	// 24h
	@Transactional
	public void deleteOldAccommodationDrafts(){
		LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
		List<AccommodationDraft> drafts = accommodationDraftRepository.findByLastModifiedTimestampBefore(sixMonthsAgo);
		for(AccommodationDraft draft : drafts){
			accommodationDraftService.delete(draft);
		}
		log.info("Deleted drafts modified for the last time more than 6 months ago: " + drafts);
	}

	/** Delete admins' action count modified for the last time more than 3 months ago. */
	@Scheduled(fixedDelay = 86400000)	// 24h
	@Transactional
	public void deleteOldAdminActivityCount(){
		LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);

		List<AdminPerformedOperation> list = this.adminPerformedOperationRepository.findAll();
		List<AdminPerformedOperation> removed = new ArrayList<AdminPerformedOperation>();

		for(AdminPerformedOperation op: list) {
			if(op.getLatestUpdate().isBefore(threeMonthsAgo) || op.getLatestUpdate().isEqual(threeMonthsAgo)) {
				this.adminPerformedOperationRepository.delete(op);
				removed.add(op);
			}
		}
		
		log.info("Deleted admins' action count modified for the last time more than 3 months ago: " + removed);
	}
}
