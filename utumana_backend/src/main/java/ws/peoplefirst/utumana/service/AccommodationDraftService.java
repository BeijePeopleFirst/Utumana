package ws.peoplefirst.utumana.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ws.peoplefirst.utumana.dto.AddressDTO;
import ws.peoplefirst.utumana.dto.GeneralAccommodationInfoDTO;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.AccommodationDraft;
import ws.peoplefirst.utumana.model.Availability;
import ws.peoplefirst.utumana.model.AvailabilityDraft;
import ws.peoplefirst.utumana.model.PhotoDraft;
import ws.peoplefirst.utumana.model.UnavailabilityDraft;
import ws.peoplefirst.utumana.repository.AccommodationDraftRepository;
import ws.peoplefirst.utumana.repository.AvailabilityDraftRepository;
import ws.peoplefirst.utumana.repository.PhotoDraftRepository;
import ws.peoplefirst.utumana.repository.UnavailabilityDraftRepository;

@Service
public class AccommodationDraftService {

    private final Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AccommodationDraftRepository accommodationDraftRepository;

    @Autowired
    private AvailabilityDraftRepository availabilityDraftRepository;

    @Autowired
    private UnavailabilityDraftRepository unavailabilityDraftRepository;

    @Autowired
    private PhotoDraftRepository photoDraftRepository;


    public List<AccommodationDraft> getAccommodationDraftByOwnerId(Long ownerId) {
        return accommodationDraftRepository.findByOwnerId(ownerId);
    }

    public AccommodationDraft getAccommodationDraftById(Long id) {
        return accommodationDraftRepository.findById(id).orElseThrow(() -> new IdNotFoundException("Draft not found"));
    }

    public String getAccommodationDraftMainPhotoById(Long id) {
        return getAccommodationDraftById(id).getMainPhotoUrl();
    }

    public List<PhotoDraft> getAccommodationDraftPhotosById(Long id) {
        return getAccommodationDraftById(id).getPhotos();
    }

    public List<AvailabilityDraft> getAccommodationDraftAvailabilitiesById(Long id) {
        return getAccommodationDraftById(id).getAvailabilities();
    }

    public List<UnavailabilityDraft> getAccommodationDraftUnavailabilitiesById(Long id){
        return getAccommodationDraftById(id).getUnavailabilities();
    }

    public Set<ws.peoplefirst.utumana.model.Service> getAccommodationDraftServicesById(Long id) {
        return getAccommodationDraftById(id).getServices();
    }

    public AddressDTO getAccommodationDraftAddressInfoById(Long id) {
        AccommodationDraft draft = getAccommodationDraftById(id);
        return new AddressDTO(draft.getStreet(), draft.getStreetNumber(), draft.getCity(), draft.getCap(), draft.getProvince(), draft.getCountry(), draft.getAddressNotes());
    }

    public  GeneralAccommodationInfoDTO getAccommodationDraftAccommodationInfoById(Long id) {
        AccommodationDraft draft = getAccommodationDraftById(id);
        return new GeneralAccommodationInfoDTO(draft.getTitle(), draft.getDescription(), draft.getBeds(), draft.getRooms());
    }


    public void deleteById(Long id) {
        accommodationDraftRepository.deleteById(id);
    }

    @Transactional
    public AccommodationDraft saveAddressInfo(Long draftId, AddressDTO address) {
        AccommodationDraft draft = getDraftById(draftId);
        BeanUtils.copyProperties(address, draft);
        System.out.println("AddressDTO values:");
        System.out.println("Province: " + address.getProvince());
        System.out.println("Cap: " + address.getCap());
        System.out.println("Country: " + address.getCountry());
        
        System.out.println("draft: " + draft);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public AccommodationDraft saveAccommodationInfo(Long draftId, GeneralAccommodationInfoDTO info) {
        AccommodationDraft draft = getDraftById(draftId);
        BeanUtils.copyProperties(info, draft);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public AccommodationDraft saveMainPhoto(Long draftId, String mainPhotoUrl) {
        AccommodationDraft draft = getDraftById(draftId);
        draft.setMainPhotoUrl(mainPhotoUrl);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public AccommodationDraft savePhotos(Long draftId, List<PhotoDraft> photos) {
        AccommodationDraft draft = getDraftById(draftId);
        draft.setPhotos(photos);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public PhotoDraft uploadPhoto(Long draftId, MultipartFile photo, Integer order) {
        if(photo == null || photo.isEmpty()){
            throw new InvalidJSONException("Photo must not be null or empty");
        }
        AccommodationDraft draft = getDraftById(draftId);
        System.out.println("Photo file: " + photo.getOriginalFilename() + " " + photo.getContentType() + " " + photo.getSize());

        // save photo file in images/drafts/{draftId}/ 
        String fileExtension = photo.getContentType() != null ? photo.getContentType().split("/")[1] : ".jpg";
        String savedPhotoUrl = "images/drafts/" + draftId.toString() + "/" + order.toString() + "." + fileExtension;
        // TODO save photo file in s3

        // save PhotoDraft entity in db
        PhotoDraft photoDraft = new PhotoDraft();
        photoDraft.setPhotoUrl(savedPhotoUrl);
        photoDraft.setPhotoOrder(order);
        photoDraft.setAccommodationDraft(draft);
        
        List<PhotoDraft> photos = draft.getPhotos();
        photos.add(photoDraft);
        draft.setPhotos(photos);
        draft = accommodationDraftRepository.save(draft);

        // if order == 0 then set main photo url
        if(order == 0){
            draft.setMainPhotoUrl(savedPhotoUrl);
            accommodationDraftRepository.save(draft);
        }

        log.trace("Accommodation draft after photo upload: " + draft);
        
        return draft.getPhotos().get(draft.getPhotos().size() - 1);
    }

    @Transactional
    public void removePhoto(Long draftId, Long photoDraftId) {
        System.out.println("Removing photo draft with id " + photoDraftId);
        AccommodationDraft draft = getDraftById(draftId);
        if(draft == null){
            throw new IdNotFoundException("Draft with id " + draftId + " not found");
        }
        PhotoDraft photoDraft = photoDraftRepository.findById(photoDraftId).orElse(null);
        if(photoDraft == null){
            throw new IdNotFoundException("Photo draft with id " + photoDraftId + " not found");
        }

        List<PhotoDraft> photos = draft.getPhotos();
        String url, fileExtension;
        for(int i=0; i<photos.size(); i++){
            if(photos.get(i).getId() == photoDraftId){
                photos.remove(i);
            }
            if(photos.get(i).getPhotoOrder() > photoDraft.getPhotoOrder()){
                photos.get(i).setPhotoOrder(photos.get(i).getPhotoOrder() - 1);

                url = photos.get(i).getPhotoUrl();
                fileExtension = url.split("\\.")[1];
                url = url.replaceFirst("/[0-9]+\\." + fileExtension, "/" + photos.get(i).getPhotoOrder() + "." + fileExtension);
                photos.get(i).setPhotoUrl(url);

                // if new photo order == 0, update mainPhotoUrl
                if(photos.get(i).getPhotoOrder() == 0){
                    draft.setMainPhotoUrl(photos.get(i).getPhotoUrl());
                }

                // TODO update photo url in s3
            }
        }
        draft.setPhotos(photos);
        accommodationDraftRepository.save(draft);
        photoDraftRepository.deleteById(photoDraftId);
        // TODO delete file from s3
    }

    // this method makes no checks on availabilities validity: the check is done in frontend and at the moment of draft transformation into accommodation
    @Transactional
    public AccommodationDraft saveAvailabilities(Long draftId, List<AvailabilityDraft> availabilities) {       
        AccommodationDraft draft = getDraftById(draftId);
        if(availabilities.equals(draft.getAvailabilities())){
            return draft;
        }
        
        List<AvailabilityDraft> savedAvailabilities = new ArrayList<AvailabilityDraft>();
        AvailabilityDraft saved;
        for (AvailabilityDraft availability : availabilities) {
            availability.setAccommodationDraftId(draftId);
            availability.setAccommodationDraft(draft);
            saved = availability;
            if (availability.getId() == null) {
                saved = availabilityDraftRepository.save(availability);
            }
            savedAvailabilities.add(saved);
        }

        for (AvailabilityDraft oldAvailability : draft.getAvailabilities()) {
            if (!savedAvailabilities.contains(oldAvailability)) {
                availabilityDraftRepository.delete(oldAvailability);
            }
        }

        draft.setAvailabilities(availabilities);
        return accommodationDraftRepository.save(draft);
    }

    // this method makes no checks on unavailabilities validity: the check is done in frontend and at the moment of draft transformation into accommodation
    @Transactional
    public AccommodationDraft saveUnavailabilities(Long draftId, List<UnavailabilityDraft> unavailabilities){
        AccommodationDraft draft = getDraftById(draftId);
        if(unavailabilities.equals(draft.getUnavailabilities())){
            return draft;
        }

        List<UnavailabilityDraft> savedUnavailabilities = new ArrayList<UnavailabilityDraft>();
        UnavailabilityDraft saved;
        for (UnavailabilityDraft unavailability : unavailabilities) {
            unavailability.setAccommodationDraftId(draftId);
            unavailability.setAccommodationDraft(draft);
            saved = unavailability;
            if (unavailability.getId() == null) {
                saved = unavailabilityDraftRepository.save(unavailability);
            }
            savedUnavailabilities.add(saved);
        }

        for (UnavailabilityDraft oldUnavailability : draft.getUnavailabilities()) {
            if (!savedUnavailabilities.contains(oldUnavailability)) {
                unavailabilityDraftRepository.delete(oldUnavailability);
            }
        }

        draft.setUnavailabilities(unavailabilities);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public AccommodationDraft saveServices(Long draftId, Set<ws.peoplefirst.utumana.model.Service> services) {
        AccommodationDraft draft = getDraftById(draftId);
        draft.setServices(services);
        return accommodationDraftRepository.save(draft);
    }

    @Transactional
    public AccommodationDraft createNewDraft(Long owner_id) {
        AccommodationDraft draft = new AccommodationDraft();
        draft.setOwnerId(owner_id);
        return accommodationDraftRepository.save(draft);
    }


    private AccommodationDraft getDraftById(Long draftId) {
        return accommodationDraftRepository.findById(draftId).orElseThrow(() -> new IdNotFoundException("Draft not found"));
    }

}
