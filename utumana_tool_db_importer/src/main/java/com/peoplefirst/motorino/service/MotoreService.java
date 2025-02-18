package com.peoplefirst.motorino.service;

import com.peoplefirst.motorino.destinazione.model.UserDestinazioneEntity;
import com.peoplefirst.motorino.origine.model.UserOrigineEntity;
import com.peoplefirst.motorino.destinazione.repository.UserDestinazioneRepository;
import com.peoplefirst.motorino.origine.repository.UserOrigineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * @author Mattia Pagani
 * This service is the main component of the application, it has the algorithm that check and updates the two databases
 */

@Service
public class MotoreService {

    /**
     * The repository used by the database that we want to take data from
     */
    @Autowired
    private UserOrigineRepository userOrigineRepository;

    /**
     * The repository used by the database that we want to add/update data in
     */
    @Autowired
    private UserDestinazioneRepository userDestinazioneRepository;
    /**
     * Test method used to create an user hardcoded, inside the origin db
     * @param counter Simple counter used to create different users
     */
    public void inserisciOrigine(int counter) {
        UserOrigineEntity user = new UserOrigineEntity();
        user.setFirst_name("Name" + counter);
        user.setLast_name("Surname" + counter);
        user.setGender("O");
        user.setEmail("mail@mail.com" + counter);
        user.setPassword("password" + counter);
        user.setSecondary_email(null);
        user.setPhone("1234567890" + counter);
        user.setPhone_personal("0987654321" + counter);
        user.setFiscal_code("CODICEFISCALE" + counter);
        user.setBirth_date(Timestamp.valueOf(LocalDateTime.now()));
        user.setBirth_place(1);
        user.setNationality("IT" + counter);
        user.setHr_referent(0);
        user.setCommercial_referent(1);
        user.setArchive_date(Timestamp.valueOf(LocalDateTime.now()));
        user.setNote("NOTE" + counter);
        user.setPic_url("P" + counter);
        user.setRole("ROLE" + counter);
        user.setHire_date(Timestamp.valueOf(LocalDateTime.now()));
        user.setPic_on_site(true);
        user.setThumbnail_url("URL" + counter);
        userOrigineRepository.save(user);
    }

    /**
     * Test method used to create an user hardcoded, inside the destination db
     * @param counter Simple counter used to create different users
     */
    public void inserisciDestinazione(int counter) {
        UserDestinazioneEntity user = new UserDestinazioneEntity();
        user.setName("NAME" + counter);
        user.setSurname("SURNAME" + counter);
        user.setEmail("EMAIL" + counter);
        user.setPassword("PASSWORD" + counter);
        user.set_admin(true);
        user.setBio("BIO" + counter);
        user.setProfile_picture_url("PIC" + counter);
        user.setRating(1.0);
        user.setArchived_timestamp(null);
        userDestinazioneRepository.save(user);
    }

    /**
     * Central method of the application.
     * It starts by retrieving from both DBs all the users they contain.
     * It then cycles the origin one, meanwhile it cycles the destination one to check that both users in that moment are the same
     * (meaning the user is already existing in the destination db as opposed to a new user)
     * based on certain conditions (for now email), if they are it then checks if all the other fields of those users are equal,
     * if they are not it updates the user in the destination db with the data from the user in the origin db.
     * If they are equals it just skips it and remove it from the destination list to not elaborate it again.
     * If the user is not present in the destination list (the first check was false), the origin users will be inserted in the destination db directly.
     */
    public String updateDestinationDatabase() {
        List<UserOrigineEntity> userOrigineEntityList = (List<UserOrigineEntity>) userOrigineRepository.findAll();
        List<UserDestinazioneEntity> userDestinazioneEntityList = (List<UserDestinazioneEntity>) userDestinazioneRepository.findAll();

        for (UserOrigineEntity userOrigine : userOrigineEntityList) {
            UserDestinazioneEntity userPresente = null;

            for (UserDestinazioneEntity userDestinazione : userDestinazioneEntityList) {
                if (userDestinazione.getEmail().equals(userOrigine.getEmail())) {   //SE UTENTE PRESENTE IN DB DESTINAZIONE
                    if (!userDestinazione.equals(userOrigine)) { //CHECK CHE NON SONO UGUALI
                        //SE NON UGUALI --> UPDATE A DB
                        userDestinazione.updateUser(userOrigine);
                        userDestinazioneRepository.save(userDestinazione);
                    }

                    //SALVO USER IN VARIABILE PER NON RIELABORARLO
                    userPresente = userDestinazione;
                    break;
                }
            }

            if (userPresente == null) userDestinazioneRepository.save(new UserDestinazioneEntity(userOrigine)); //SE NON PRESENTE --> INSERT
            else userDestinazioneEntityList.remove(userPresente);   //SE PRESENTE --> REMOVE DALLA LISTA
        }

        if (!userDestinazioneEntityList.isEmpty()) {    //CHECK CHE NON CI SIANO PIU' UTENTI IN DESTINAZIONE
            for (UserDestinazioneEntity userDestinazione : userDestinazioneEntityList) {
                userDestinazioneRepository.delete(userDestinazione);    //SE PRESENTI --> RIMUOVERLI A DB
            }
        }

        return "Update Completato";
    }
}
