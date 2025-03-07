package ws.peoplefirst.utumana.repository.dsl;

import org.springframework.data.domain.Page;

import ws.peoplefirst.utumana.criteria.AdminSearchCriteria;
import ws.peoplefirst.utumana.criteria.SearchAccomodationCriteria;
import ws.peoplefirst.utumana.dto.AccommodationDTO;

public interface QAccommodationRepository {

    Page<AccommodationDTO> searchAccomodation(SearchAccomodationCriteria searchAccomodationCriteria);

    Page<AccommodationDTO> adminSearch(AdminSearchCriteria adminSearchCriteria);

}
