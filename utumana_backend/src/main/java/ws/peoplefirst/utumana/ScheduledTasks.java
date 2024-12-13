package ws.peoplefirst.utumana;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.service.BookingService;
import ws.peoplefirst.utumana.utility.BookingStatus;


@Component
@EnableScheduling
public class ScheduledTasks {

	@Autowired
	private BookingService bookingService;
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Scheduled(fixedDelay = 86400000)
	public void updateBookingStatus(){
		
		List<Booking> expiredBooking = bookingService.getExpiredBookings();
		
		List<Booking> startedBooking = bookingService.getStartedBookings();
		
		for (Booking b: startedBooking){
			b.setStatus(BookingStatus.DOING);
			bookingRepository.save(b);
		}
		
		for (Booking b: expiredBooking){
			b.setStatus(BookingStatus.DONE);
			bookingRepository.save(b);
		}
		
	}
	
}
