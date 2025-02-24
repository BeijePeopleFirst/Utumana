package com.peoplefirst.motorino.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.peoplefirst.motorino.datasource.OrigineDataSourceConfig;
import com.peoplefirst.motorino.destinazione.model.UserDestinazioneEntity;
import com.peoplefirst.motorino.origine.model.UserOrigineEntity;
import com.peoplefirst.motorino.destinazione.repository.UserDestinazioneRepository;
import com.peoplefirst.motorino.origine.repository.UserOrigineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

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
    @Autowired
    private OrigineDataSourceConfig origineDataSourceConfig;
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
//    public String updateDestinationDatabase() {
//        List<UserOrigineEntity> userOrigineEntityList = (List<UserOrigineEntity>) userOrigineRepository.findAll();
//        List<UserDestinazioneEntity> userDestinazioneEntityList = (List<UserDestinazioneEntity>) userDestinazioneRepository.findAll();
//
//        for (UserOrigineEntity userOrigine : userOrigineEntityList) {
//            UserDestinazioneEntity userPresente = null;
//
//            for (UserDestinazioneEntity userDestinazione : userDestinazioneEntityList) {
//                if (userDestinazione.getEmail().equals(userOrigine.getEmail())) {   //SE UTENTE PRESENTE IN DB DESTINAZIONE
//                    if (!userDestinazione.equals(userOrigine)) { //CHECK CHE NON SONO UGUALI
//                        //SE NON UGUALI --> UPDATE A DB
//                        userDestinazione.updateUser(userOrigine);
//                        userDestinazioneRepository.save(userDestinazione);
//                    }
//
//                    //SALVO USER IN VARIABILE PER NON RIELABORARLO
//                    userPresente = userDestinazione;
//                    break;
//                }
//            }
//
//            if (Objects.isNull(userPresente)) userDestinazioneRepository.save(new UserDestinazioneEntity(userOrigine)); //SE NON PRESENTE --> INSERT
//            else userDestinazioneEntityList.remove(userPresente);   //SE PRESENTE --> REMOVE DALLA LISTA
//        }
//
//        if (!userDestinazioneEntityList.isEmpty()) {    //CHECK CHE NON CI SIANO PIU' UTENTI IN DESTINAZIONE
//            userDestinazioneRepository.deleteAll(userDestinazioneEntityList);
//        }
//
//        return "Update Completato";
//    }


    public void updateDestinationDatabase(MultipartFile mappingFile) throws SQLException, IOException {
        try (Connection sourceConn = origineDataSourceConfig.getConnection()) {
            String mappingJson = new String(mappingFile.getBytes(), StandardCharsets.UTF_8);
            Map<String, String> fieldMapping = new ObjectMapper().readValue(mappingJson, new TypeReference<>() {});

            String sql = "SELECT * FROM user"; // Migliorabile con query parametrizzate, se necessario.

            // Ottieni tutti gli utenti già presenti nel DB di destinazione
            List<UserDestinazioneEntity> userDestinazioneEntityList = (List<UserDestinazioneEntity>) userDestinazioneRepository.findAll();
            Map<String, UserDestinazioneEntity> userMap = userDestinazioneEntityList.stream()
                    .collect(Collectors.toMap(UserDestinazioneEntity::getEmail, Function.identity()));

            try (Statement stmt = sourceConn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {

                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (rs.next()) {
                    UserDestinazioneEntity userOrigine = new UserDestinazioneEntity();

                    for (int i = 1; i <= columnCount; i++) {
                        String sourceColumn = metaData.getColumnName(i);
                        Object value = rs.getObject(i);

                        String mappedField = fieldMapping.get(sourceColumn);
                        if (mappedField != null) {
                            setFieldIfExists(userOrigine, mappedField, value);
                        }
                    }

                    // Verifica se l'utente è già presente nel database di destinazione
                    UserDestinazioneEntity userDestinazione = userMap.get(userOrigine.getEmail());
                    if (userDestinazione != null) {
                        // Se l'utente è presente, aggiorna
                        userOrigine.setId(userDestinazione.getId());
                        userDestinazioneRepository.save(userOrigine);
                        userMap.remove(userOrigine.getEmail()); // Rimuovi dalla lista per evitare duplicati
                    } else {
                        // Se l'utente non è presente, inserisci
                        userDestinazioneRepository.save(userOrigine);
                    }
                }
            }

            // Elimina gli utenti che non sono stati aggiornati (non sono stati trovati nel DB di origine)
            if (!userMap.isEmpty()) {
                userDestinazioneRepository.deleteAll(userMap.values());
            }
        }
    }

    private void setFieldIfExists(Object obj, String fieldName, Object value) {
        try {
            Field field = UserDestinazioneEntity.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignora il campo se non esiste nella destinazione
            e.printStackTrace();
        }
    }

}
