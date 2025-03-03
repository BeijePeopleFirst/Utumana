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
import ws.peoplefirst.utumana.model.AvailabilityDraft;
import ws.peoplefirst.utumana.model.Booking;
import ws.peoplefirst.utumana.model.Photo;
import ws.peoplefirst.utumana.model.PhotoDraft;
import ws.peoplefirst.utumana.model.UnavailabilityDraft;
import ws.peoplefirst.utumana.model.User;
import ws.peoplefirst.utumana.repository.AccommodationDraftRepository;
import ws.peoplefirst.utumana.repository.AccommodationRepository;
import ws.peoplefirst.utumana.repository.BookingRepository;
import ws.peoplefirst.utumana.repository.PhotoRepository;
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
    private PhotoRepository photoRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AccommodationService accommodationService;

    @Autowired
    private S3Service s3Service;


    @Transactional
    public Accommodation publishDraft(Long draftId) {
        AccommodationDraft draft = draftRepository.findById(draftId).orElseThrow(() -> new EntityNotFoundException("Draft not found"));

        validateDraftForPublication(draft);
        System.out.println("Draft validated");

        Accommodation accommodation = convertDraftToAccommodation(draft);
        System.out.println("Created accommodation");

        draftRepository.deleteById(draftId);
        System.out.println("Deleted draft");

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
        
        accommodation = accommodationRepository.save(accommodation);
        System.out.println("Saved accommodation with basic info");
        
        if (draft.getServices() != null) {
            accommodation.setServices(new HashSet<>(draft.getServices()));
        }

        System.out.println("Added services");
        
        if (draft.getPhotos() != null) {
            List<Photo> photos = new ArrayList<>();
            for(PhotoDraft photoDraft : draft.getPhotos()){
                Photo photo = new Photo();
                BeanUtils.copyProperties(photoDraft, photo, "id", "accommodationDraft");
                photo.setAccommodation(accommodation);
                photo = photoRepository.save(photo);

                // move photo file in s3 from images/drafts/{draftId}/ to images/accommodations/{accommodationId}/
                String fileExtension = photoDraft.getPhotoUrl().split("\\.")[1];
                String newPhotoUrl = "images/accommodations/" + accommodation.getId().toString() + "/" + photo.getId().toString() + "." + fileExtension;
                s3Service.moveFile(photoDraft.getPhotoUrl(), newPhotoUrl);

                photo.setPhotoUrl(newPhotoUrl);
                photos.add(photo);

                if(photoDraft.getPhotoOrder() == 0){
                    accommodation.setMainPhotoUrl(newPhotoUrl);
                }
            }
            System.out.println("Photos: " + photos);
            accommodation.setPhotos(photos);
            System.out.println("Added photos");
        }
        
        if (draft.getAvailabilities() != null) {
            List<Availability> availabilities = new ArrayList<>();
            for(AvailabilityDraft availabilityDraft : draft.getAvailabilities()){
                Availability availability = new Availability();
                BeanUtils.copyProperties(availabilityDraft, availability, "id", "accommodationDraft");
                availability.setAccommodation(accommodation);
                availabilities.add(availability);
            }
            accommodationService.checkAvailabilites(availabilities);
            accommodation.setAvailabilities(availabilities);
            System.out.println("Added availabilities");
        }

        if (draft.getUnavailabilities() != null) {
            List<Booking> unavailabilities = new ArrayList<>();
            for(UnavailabilityDraft unavailabilityDraft : draft.getUnavailabilities()){
                Booking unavailability = new Booking();
                BeanUtils.copyProperties(unavailabilityDraft, unavailability, "id", "accommodationDraft");
                unavailability.setAccommodation(accommodation);
                unavailability.setUser(owner);
                unavailability.setTimestamp(LocalDateTime.now());
                unavailability.setStatus(BookingStatus.ACCEPTED);
                unavailability.setIsUnavailability(true);
                unavailabilities.add(unavailability);
            }
            accommodationService.checkUnavailabilities(unavailabilities);
            for(Booking booking : unavailabilities){
                bookingRepository.save(booking);
            }
            System.out.println("Added unavailabilities");
        }
        
        return accommodationRepository.save(accommodation);
    }
}
