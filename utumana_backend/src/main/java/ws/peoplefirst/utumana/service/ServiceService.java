package ws.peoplefirst.utumana.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.repository.ServiceRepository;


@Service
public class ServiceService {
	@Autowired
	private ServiceRepository serviceRepository;
	
	
	public Set<ws.peoplefirst.utumana.model.Service> getAllServices(){
		return new HashSet<ws.peoplefirst.utumana.model.Service>(serviceRepository.findAll());
	}


	public ws.peoplefirst.utumana.model.Service findServiceById(Long id) {
		return serviceRepository.findById(id).orElse(null);
	}
	
	public List<ws.peoplefirst.utumana.model.Service> searchByTitle(String title) {
		return serviceRepository.findByTitleIgnoreCaseContaining(title);
	}


	public Set<ws.peoplefirst.utumana.model.Service> getServicesByIds(List<Long> ids) {
		return serviceRepository.findByIdIn(ids);
	}
	
}
