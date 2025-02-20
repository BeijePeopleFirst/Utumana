package ws.peoplefirst.utumana;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@SpringBootTest(classes = PropertiesConfig.class)
class UtumanaApplicationTests {

	@Test
	void contextLoads() {
		assertDoesNotThrow(() -> UtumanaApplication.main(new String[]{}));
	}
}
