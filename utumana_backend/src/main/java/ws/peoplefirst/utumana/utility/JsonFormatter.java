package ws.peoplefirst.utumana.utility;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import ws.peoplefirst.utumana.dto.BookingDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.model.Booking;

public class JsonFormatter {
	public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
	
	public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE;
	
	
	public static String parseDateTime(LocalDateTime date) {
		if(date!=null) {
			try {
				return date.format(DATE_TIME_FORMATTER);
			}catch(DateTimeParseException e) {
				throw new ForbiddenException("wrong date format");
			}
			
		}else {
			//throw new ForbiddenException("date not present");
			return null;
		}
	}
	
	public static String parseDate(LocalDate date) {
		if(date!=null) {
			try {
				return date.format(DATE_FORMATTER);
			}catch(DateTimeParseException e) {
				throw new ForbiddenException("wrong date format");
			}
			
		}else {
			throw new ForbiddenException("date not present");
		}
	}
	
	public static LocalDate parseStringIntoDate(String date) {
		if(date!=null) {	
			try {				
				return LocalDate.parse(date, DATE_FORMATTER);
			}catch(DateTimeParseException e){
				throw new ForbiddenException("wrong date format");
			}
		}else {
			throw new ForbiddenException("date is null");
		}
	}
	
	public static LocalDateTime parseStringIntoDateTime(String date) {
		if(date!=null) {		
			try {				
				return LocalDateTime.parse(date, DATE_TIME_FORMATTER);	// FROM TIMESTAMP
			}catch(DateTimeParseException e){
				try {				
					return LocalDateTime.of(LocalDate.parse(date, DATE_FORMATTER), LocalTime.of(0, 0)); // FROM STRING DATE
				}catch(DateTimeParseException e1){
					throw new ForbiddenException("wrong date format");
				}
			}
		}else {
			throw new ForbiddenException("date is null");
		}
	}
	
	public static BookingDTO fromBookingToBookingDTO(Booking booking) {
		return new BookingDTO(booking.getAccommodation().getMainPhotoUrl(),booking.getAccommodation().getTitle(),
				booking.getPrice(),booking.getStatus(),booking.getAccommodation().getId(),booking.getCheckIn(),booking.getCheckOut());
	}
	
}
