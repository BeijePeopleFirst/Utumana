package ws.peoplefirst.utumana.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.repository.AccommodationRepository;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccommodationServiceTest {

    @InjectMocks
    private AccommodationService accommodationService;

    @Mock
    private AccommodationRepository accommodationRepository;

    private Accommodation getAccomodation() {
        return new Accommodation();
    }

    @Test
    void approveAccommodation() {
        when(accommodationRepository.findByIdAndHidingTimestampIsNull(anyLong())).thenReturn(getAccomodation());
        assertDoesNotThrow(() -> accommodationService.approveAccommodation(0L));
    }

    @Test
    void approveAccommodationKoFindById() {
        when(accommodationRepository.findByIdAndHidingTimestampIsNull(0L)).thenReturn(null);
        assertThrows(IdNotFoundException.class, () -> accommodationService.approveAccommodation(0L));
    }

}
