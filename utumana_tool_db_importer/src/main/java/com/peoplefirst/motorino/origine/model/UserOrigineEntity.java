package com.peoplefirst.motorino.origine.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Entity dell'user del db di destinazione
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(schema = "user")
public class UserOrigineEntity implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    private String first_name;
    private String last_name;
    private String gender;
    private String email;
    private String password;
    private String secondary_email;
    private String phone;
    private String phone_personal;
    private String fiscal_code;
    private Timestamp birth_date;
    private Integer birth_place;
    private String nationality;
    private Integer hr_referent;
    private Integer commercial_referent;
    private Timestamp archive_date;
    private String note;
    private String pic_url;
    private String role;
    private Timestamp hire_date;
    private boolean pic_on_site;
    private String thumbnail_url;
}
