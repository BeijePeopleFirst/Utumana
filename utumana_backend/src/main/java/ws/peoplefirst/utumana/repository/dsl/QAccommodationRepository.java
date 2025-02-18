package ws.peoplefirst.utumana.repository.dsl;

import ws.peoplefirst.utumana.criteria.SearchAccomodationCriteria;
import ws.peoplefirst.utumana.dto.AccommodationDTO;

import java.util.List;

public interface QAccommodationRepository {

    List<AccommodationDTO> searchAccomodation(SearchAccomodationCriteria searchAccomodationCriteria);

}
