package ws.peoplefirst.utumana.controller;

import java.io.File;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ws.peoplefirst.utumana.dto.AddressDTO;
import ws.peoplefirst.utumana.dto.GeneralAccommodationInfoDTO;
import ws.peoplefirst.utumana.exception.ForbiddenException;
import ws.peoplefirst.utumana.exception.InvalidJSONException;
import ws.peoplefirst.utumana.model.Accommodation;
import ws.peoplefirst.utumana.model.AccommodationDraft;
import ws.peoplefirst.utumana.model.AvailabilityDraft;
import ws.peoplefirst.utumana.model.PhotoDraft;
import ws.peoplefirst.utumana.model.Service;
import ws.peoplefirst.utumana.model.UnavailabilityDraft;
import ws.peoplefirst.utumana.service.AccommodationDraftService;
import ws.peoplefirst.utumana.service.PublishDraftService;
import ws.peoplefirst.utumana.utility.AuthorizationUtility;

@RestController
@RequestMapping(value = "/api/accommodation-draft")
public class AccommodationDraftController {

    private final Logger log = LoggerFactory.getLogger(this.getClass());
    
    @Autowired
    private AccommodationDraftService accommodationDraftService;

    @Autowired
    private PublishDraftService publishDraftService;

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/owner/{ownerId}")
    public List<AccommodationDraft> getAccommodationDraftByOwnerId(@PathVariable("ownerId") Long ownerId, Authentication auth) {
			if (!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(ownerId)) {
				throw new ForbiddenException("Only owners can get their accommodation draft");
			}
        return accommodationDraftService.getAccommodationDraftByOwnerId(ownerId);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping(value = "/id/{id}")
    public AccommodationDraft getAccommodationDraftById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftById(draftId);
    }

    @GetMapping("address-info/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public AddressDTO getAccommodationDraftAddressInfoById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftAddressInfoById(draftId);
    }

    @GetMapping("accommodation-info/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public GeneralAccommodationInfoDTO getAccommodationDraftAccommodationInfoById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftAccommodationInfoById(draftId);
    }

    @GetMapping("photos/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public List<PhotoDraft> getAccommodationDraftPhotosById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftPhotosById(draftId);
    }

    @GetMapping("availabilities/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public List<AvailabilityDraft> getAccommodationDraftAvailabilitiesById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftAvailabilitiesById(draftId);
    }

    @GetMapping("unavailabilities/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public List<UnavailabilityDraft> getAccommodationDraftUnavailabilitiesById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftUnavailabilitiesById(draftId);
    }

    @GetMapping("services/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public Set<Service> getAccommodationDraftServicesById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftServicesById(draftId);
    }

    @GetMapping("main-photo/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public String getAccommodationDraftMainPhotoById(@PathVariable("id") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.getAccommodationDraftMainPhotoById(draftId);
    }

    @PostMapping("/new/{ownerId}")
    @PreAuthorize("hasAuthority('USER')")
    public Long createNewDraft(@PathVariable("ownerId") Long ownerId, Authentication auth) {
        if (!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(ownerId)) {
            throw new ForbiddenException("Only owners can get their accommodation draft");
        }
        return accommodationDraftService.createNewDraft(ownerId).getId();
    }

    @PostMapping("/save-address-info/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public AccommodationDraft saveAddressInfo(@PathVariable("draftId") Long draftId, @RequestBody AddressDTO address, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.saveAddressInfo(draftId, address);
    }

    @PostMapping("/save-accommodation-info/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public AccommodationDraft saveAccommodationInfo(@PathVariable("draftId") Long draftId, @RequestBody GeneralAccommodationInfoDTO info, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.saveAccommodationInfo(draftId, info);
    }

    // @PostMapping("/save-main-photo/{draftId}")
    // @PreAuthorize("hasAuthority('USER')")
    // public AccommodationDraft saveMainPhoto(@PathVariable("draftId") Long draftId,@RequestBody String mainPhotoUrl, Authentication auth) {
    //     authenticateCall(auth, draftId);
    //     return accommodationDraftService.saveMainPhoto(draftId, mainPhotoUrl);
    // }

    // @PostMapping("/save-photos/{draftId}")
    // @PreAuthorize("hasAuthority('USER')")
    // public AccommodationDraft savePhotos(@PathVariable("draftId") Long draftId,@RequestBody List<PhotoDraft> photos, Authentication auth) {
    //     authenticateCall(auth, draftId);
    //     return accommodationDraftService.savePhotos(draftId, photos);
    // }

    @PostMapping("/add-photo/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public PhotoDraft uploadPhoto(@PathVariable("draftId") Long draftId, @RequestPart MultipartFile photo, @RequestPart String order, Authentication auth) {
        log.info("POST api/accommodation-draft/add-photo/" + draftId);
        authenticateCall(auth, draftId);
        Integer orderInt = null;
        try{
            orderInt = Integer.parseInt(order);
            if(orderInt < 0){
                throw new InvalidJSONException("Order must be a non negative number");
            }
        } catch (NumberFormatException e) {
            throw new InvalidJSONException("Order must be a number");
        }
        System.out.println("Uploading photo with order " + orderInt);
        return accommodationDraftService.uploadPhoto(draftId, photo, orderInt);
    }

    @DeleteMapping("/{draftId}/remove-photo/{photoDraftId}")
    @PreAuthorize("hasAuthority('USER')")
    public void removePhoto(@PathVariable("draftId") Long draftId, @PathVariable("photoDraftId") Long photoDraftId, Authentication auth) {
        log.info("DELETE api/accommodation-draft/" + draftId + "/remove-photo/" + photoDraftId);
        authenticateCall(auth, draftId);
        accommodationDraftService.removePhoto(draftId, photoDraftId);
    }

    @PostMapping("/save-availabilities/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public AccommodationDraft saveAvailabilities(@PathVariable("draftId") Long draftId, @RequestBody List<AvailabilityDraft> availabilities, Authentication auth) {
        log.debug("POST api/accommodation-draft/save-availabilities/" + draftId);
        log.trace("availabilities: " + availabilities);
        authenticateCall(auth, draftId);
        return accommodationDraftService.saveAvailabilities(draftId, availabilities);
    }

    @PostMapping("/save-unavailabilities/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public AccommodationDraft saveUnavailabilities(@PathVariable("draftId") Long draftId, @RequestBody List<UnavailabilityDraft> unavailabilities, Authentication auth) {
        log.debug("POST api/accommodation-draft/save-unavailabilities/" + draftId);
        log.trace("unavailabilities: " + unavailabilities);
        authenticateCall(auth, draftId);
        return accommodationDraftService.saveUnavailabilities(draftId, unavailabilities);
    }

    @PostMapping("/save-services/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public AccommodationDraft saveServices(@PathVariable("draftId") Long draftId, @RequestBody Set<ws.peoplefirst.utumana.model.Service> services, Authentication auth) {
        authenticateCall(auth, draftId);
        return accommodationDraftService.saveServices(draftId, services);
    }

    @PostMapping("/publish/{draftId}")
    @PreAuthorize("hasAuthority('USER')")
    public Accommodation publishDraft(@PathVariable("draftId") Long draftId, Authentication auth) {
        authenticateCall(auth, draftId);
        return publishDraftService.publishDraft(draftId);
    }

    @DeleteMapping("/id/{id}")
    @PreAuthorize("hasAuthority('USER')")
    public void deleteById(@PathVariable("id") Long id, Authentication auth) {
        authenticateCall(auth, id);
        accommodationDraftService.deleteById(id);
    }
    
    private void authenticateCall(Authentication auth, Long accommodationDraftId) {
        AccommodationDraft accommodationDraft = accommodationDraftService.getAccommodationDraftById(accommodationDraftId);
        if (!AuthorizationUtility.getUserFromAuthentication(auth).getId().equals(accommodationDraft.getOwnerId())) {
            throw new ForbiddenException("Only owners can delete their accommodation draft");
        }
    }
}
