package ws.peoplefirst.utumana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.PopularOperation;
import ws.peoplefirst.utumana.repository.PopularOperationRepository;
import ws.peoplefirst.utumana.utility.PopularOperationTitle;

@Service
public class PopularOperationService {

    @Autowired
    private PopularOperationRepository popularOperationRepository;


    public PopularOperation findByTitle(PopularOperationTitle title) {
        return this.popularOperationRepository.findByTitle(title).orElseThrow(() -> new InvalidJSONException("Operation not found for the admin"));
    }
    
}
