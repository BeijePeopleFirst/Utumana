package ws.peoplefirst.utumana.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Service;
import ws.peoplefirst.utumana.service.ServiceService;

@RestController
@RequestMapping("/api")
public class ServiceController {
	Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private ServiceService serviceService;
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/services")
	public Set<Service> getAllServices(Authentication auth,
			@RequestParam(required = false) List<Long> ids){
		if(ids == null || ids.isEmpty()) {
			return serviceService.getAllServices();
		} else {
			return serviceService.getServicesByIds(ids);
		}
	}
	
	@PreAuthorize("hasAuthority('USER')")
	@GetMapping("/services/search")
	public List<Service> searchServicesByTitle(Authentication auth,
			@RequestParam String title){
		try {
			title = URLDecoder.decode(title, StandardCharsets.UTF_8.toString());
		} catch (UnsupportedEncodingException e) {
			throw new TheJBeansException("Error decoding title string from search URL: " + title);
		}
		
		return serviceService.searchByTitle(title);
	}
}
