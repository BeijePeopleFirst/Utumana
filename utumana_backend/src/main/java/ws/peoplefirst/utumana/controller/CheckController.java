package ws.peoplefirst.utumana.controller;

import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CheckController {
	private Logger log = LoggerFactory.getLogger(this.getClass());

	@PreAuthorize("permitAll()")
	@RequestMapping(value = "/check", method = RequestMethod.GET)
	public @ResponseBody String check() throws UnknownHostException {

		log.debug("GET /check");
		
		
		return "Utumana PROJECT";
	}
	
}
