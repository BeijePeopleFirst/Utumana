package com.peoplefirst.motorino.destinazione.model;

import com.peoplefirst.motorino.origine.model.UserOrigineEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * Entity dell'user del db di destinazione
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "user",schema = "user")
public class UserDestinazioneEntity implements Serializable {

    /**
     * Costruttore custom per creare un userDestinazione basandosi su un userOrigine
     * @param userOrigine User da usare come base
     */
    public UserDestinazioneEntity(UserOrigineEntity userOrigine) {
        this.updateUser(userOrigine);
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private Boolean is_admin;
    private String bio;
    private String profile_picture_url;
    private Double rating;
    private LocalDateTime archived_timestamp;

    /**
     * Mapping per creazione/update dell'user di destinazione basandosi su un user di origine
     * @param userOrigine User da usare come base
     */
    //TODO UPDATE MAPPINGS
    public void updateUser(UserOrigineEntity userOrigine) {
        name = userOrigine.getFirst_name();
        surname = userOrigine.getLast_name();
        email = userOrigine.getEmail();
        password = userOrigine.getPassword();
        is_admin = false;                           //?????????????
        bio = userOrigine.getNote();          //?????????????
        profile_picture_url = userOrigine.getPic_url();
        rating = 0.0;                              //?????????????
        archived_timestamp = userOrigine.getArchive_date();
    }

    /**
     * Metodo Equals overridato per comparare UserDestinazione con UserOrigine in modo consono
     * @param o Oggetto con cui confrontare
     * @return True se i due oggetti sono uguali basati su dei check specifici, false altrimenti
     */
    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }

        if (!(o instanceof UserOrigineEntity u)) {
            return false;
        }

        //TODO MODIFICARE LE CONDIZIONI NECESSARIE PER FAR SI CHE SIANO UGUALI
        return name.equals(u.getFirst_name())
                && surname.equals(u.getLast_name())
                && email.equals(u.getEmail())
                && password.equals(u.getPassword())
                && bio.equals(u.getNote())
                && profile_picture_url.equals(u.getPic_url())
                && archived_timestamp.equals(u.getArchive_date());
    }
}
