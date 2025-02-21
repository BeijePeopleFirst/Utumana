package ws.peoplefirst.utumana.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ws.peoplefirst.utumana.dto.AddressDTO;
import ws.peoplefirst.utumana.dto.GeneralAccommodationInfoDTO;
import ws.peoplefirst.utumana.exception.IdNotFoundException;
import ws.peoplefirst.utumana.model.AccommodationDraft;
import ws.peoplefirst.utumana.model.AvailabilityDraft;
import ws.peoplefirst.utumana.model.PhotoDraft;
import ws.peoplefirst.utumana.repository.AccommodationDraftRepository;

@Service
public class AccommodationDraftService {

    @Autowired
    private AccommodationDraftRepository accommodationDraftRepository;

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

    public Set<ws.peoplefirst.utumana.model.Service> getAccommodationDraftServicesById(Long id) {
        return getAccommodationDraftById(id).getServices();
    }

    public AddressDTO getAccommodationDraftAddressInfoById(Long id) {
        AccommodationDraft draft = getAccommodationDraftById(id);
        return new AddressDTO(draft.getStreet(), draft.getStreetNumber(), draft.getCity(), draft.getProvince(), draft.getCap(), draft.getCountry());
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
        System.out.println("Street: " + address.getStreet());
        System.out.println("City: " + address.getCity());
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
    public AccommodationDraft saveAvailabilities(Long draftId, List<AvailabilityDraft> availabilities) {
        AccommodationDraft draft = getDraftById(draftId);
        draft.setAvailabilities(availabilities);
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
