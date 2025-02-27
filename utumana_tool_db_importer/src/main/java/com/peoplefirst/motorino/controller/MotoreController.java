package com.peoplefirst.motorino.controller;

import com.peoplefirst.motorino.datasource.OrigineDataSourceConfig;
import com.peoplefirst.motorino.service.MotoreService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * @author Mattia Pagani
 *
 * Controller principale dell'applicazione.
 * Raggiungibile all'url: ip/motore/<api>
 */
@Validated
@RestController
@RequestMapping("/motore")
public class MotoreController {

    /**
     * Service del motore
     */
    @Autowired
    private MotoreService motoreService;
    @Autowired
    private OrigineDataSourceConfig origineDataSourceConfig;

    /**
     * API principale dell'applicatiovo. Serve ad avviare l'operazione di update tra i due DB.
     * @return Semplice stringa di avvenuta operazione
     */
    @PostMapping("/import")
    public String importUsers(@RequestParam("mappingFile") MultipartFile mappingFile) {
        motoreService.updateDestinationDatabase(mappingFile);
        return "Ok";
    }

    /**
     * API di test raggiungibile all'url: ip/motore/inserisci/origine/{counter}
     * Serve ad inserire un utente autogenerato nel DB di origine
     * @param counter Integer che serve per diversificare gli utenti inseriti
     */
    @Operation(summary="TEST: insert user origine")
    @PostMapping("/inserisci/origine/{counter}")
    @Transactional(transactionManager = "origineTransactionManager")
    public void insericiOrigine(@PathVariable(value="counter") int counter) {
        motoreService.inserisciOrigine(counter);
    }

    /**
     * API di test raggiungibile all'url: ip/motore/inserisci/destinazione/{counter}
     * Serve ad inserire un utente autogenerato nel DB di destinazione
     * @param counter Integer che serve per diversificare gli utenti inseriti
     */
    @Operation(summary="TEST: insert user destinazione")
    @PostMapping("/inserisci/destinazione/{counter}")
    public void inserisciDestinazione(@PathVariable(value="counter") int counter) {
        motoreService.inserisciDestinazione(counter);
    }
}
