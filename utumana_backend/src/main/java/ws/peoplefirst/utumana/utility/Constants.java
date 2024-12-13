package ws.peoplefirst.utumana.utility;

import java.time.format.DateTimeFormatter;

public class Constants {
	public static final int ACCOMMODATIONS_PAGE_SIZE = 8;
	public static final int MAX_PASSWORD_CHARACTERS = 30;
	public static final int MIN_PASSWORD_CHARACTERS = 8;
	public static final int MIN_PASSWORD_UPPER_CHARACTERS = 1;
	public static final int MIN_PASSWORD_LOWER_CHARACTERS = 1;
	public static final int MIN_PASSWORD_DIGIT_CHARACTERS = 1;
	public static final int MIN_PASSWORD_SYMBOL_CHARACTERS = 1;
	
	
	public static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
	
	public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
	public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE;

}
