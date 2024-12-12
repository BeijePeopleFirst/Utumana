package ws.peoplefirst.utumana.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.repository.PhotoRepository;

@Service
public class PhotoService {
	
	@Autowired
	private PhotoRepository photoRepository;

	public List<Photo> findByAccommodation(Accommodation base) {
		return photoRepository.findByAccommodation(base);
	}

	@Transactional
	public void save(Photo p) {
		photoRepository.save(p);
		
	}

}
