package ws.peoplefirst.utumana.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.TheJBeansException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.AccommodationDraft;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.AccommodationDraftRepository;
import ws.peoplefirst.utumana.repository.AccommodationRepository;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.repository.UserRepository;
import ws.peoplefirst.utumana.utility.BookingStatus;

@Service
public class PublishDraftService {

    @Autowired
    private AccommodationDraftRepository draftRepository;
    
    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AccommodationService accommodationService;


    @Transactional
    public Accommodation publishDraft(Long draftId) {
        AccommodationDraft draft = draftRepository.findById(draftId).orElseThrow(() -> new EntityNotFoundException("Draft not found"));

        validateDraftForPublication(draft);

        Accommodation accommodation = convertDraftToAccommodation(draft);

        accommodation = accommodationRepository.save(accommodation);

        draftRepository.deleteById(draftId);

        return accommodation;
    }
    
    private void validateDraftForPublication(AccommodationDraft draft) {
        List<String> errors = new ArrayList<>();
        
        if (draft.getTitle().isEmpty()) errors.add("title is mandatory");
        if (draft.getBeds() == null || draft.getBeds() <= 0) errors.add("beds must be positive");
        if (draft.getRooms() == null || draft.getRooms() <= 0) errors.add("rooms must be positive");
        if (draft.getCountry().isEmpty()) errors.add("country is mandatory");
        if (draft.getCap().isEmpty()) errors.add("cap is mandatory");
        if (draft.getMainPhotoUrl() == null) errors.add("main photo is mandatory");
        
        if (!errors.isEmpty()) {
            throw new TheJBeansException("The draft cannot be published: " + String.join(", ", errors));
        }
    }
    
    private Accommodation convertDraftToAccommodation(AccommodationDraft draft) {
        Accommodation accommodation = new Accommodation();
        
        BeanUtils.copyProperties(draft, accommodation, "id", "photos", "services", "availabilities");

        User owner = userRepository.findById(draft.getOwnerId()).orElse(null);
        if(owner == null){
            throw new IdNotFoundException("Owner associated with accommodation draft with id " + draft.getOwnerId() + " not found");
        }
        
        if (draft.getServices() != null) {
            accommodation.setServices(new HashSet<>(draft.getServices()));
        }
        
        if (draft.getPhotos() != null) {
            List<Photo> photos = draft.getPhotos().stream()
                .map(photoDraft -> {
                    Photo photo = new Photo();
                    BeanUtils.copyProperties(photoDraft, photo, "id", "accommodationDraft");
                    photo.setAccommodation(accommodation);
                    return photo;
                })
                .collect(Collectors.toList());
            accommodation.setPhotos(photos);
        }
        
        if (draft.getAvailabilities() != null) {
            List<Availability> availabilities = draft.getAvailabilities().stream()
                .map(availabilityDraft -> {
                    Availability availability = new Availability();
                    BeanUtils.copyProperties(availabilityDraft, availability, "id", "accommodationDraft");
                    availability.setAccommodation(accommodation);
                    return availability;
                })
                .collect(Collectors.toList());
            accommodationService.checkAvailabilites(availabilities);
            accommodation.setAvailabilities(availabilities);
        }

        if (draft.getUnavailabilities() != null) {
            List<Booking> unavailabilities = draft.getUnavailabilities().stream()
                .map(unavailabilityDraft -> {
                    Booking unavailability = new Booking();
                    BeanUtils.copyProperties(unavailabilityDraft, unavailability, "id", "accommodationDraft");
                    unavailability.setAccommodation(accommodation);
                    unavailability.setUser(owner);
                    unavailability.setTimestamp(LocalDateTime.now());
                    unavailability.setStatus(BookingStatus.ACCEPTED);
                    unavailability.setIsUnavailability(true);
                    return unavailability;
                })
                .collect(Collectors.toList());
            accommodationService.checkUnavailabilities(unavailabilities);
            for(Booking booking : unavailabilities){
                bookingRepository.save(booking);
            }
        }
        
        return accommodation;
    }
}
