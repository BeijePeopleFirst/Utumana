package com.peoplefirst.motorino.controller;

import com.peoplefirst.motorino.service.MotoreService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    /**
     * API principale dell'applicatiovo. Serve ad avviare l'operazione di update tra i due DB.
     * @return Semplice stringa di avvenuta operazione
     */
    @Operation(summary="Start the Motore synchronization")
    @PostMapping("/start")
    public String motoreStart() {
        return motoreService.updateDestinationDatabase();
    }

    /**
     * API di test raggiungibile all'url: ip/motore/inserisci/origine/{counter}
     * Serve ad inserire un utente autogenerato nel DB di origine
     * @param counter Integer che serve per diversificare gli utenti inseriti
     */
    @Operation(summary="TEST: insert user origine")
    @PostMapping("/inserisci/origine/{counter}")
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
