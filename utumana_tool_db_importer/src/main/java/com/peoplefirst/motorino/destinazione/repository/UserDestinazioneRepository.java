package com.peoplefirst.motorino.destinazione.repository;

import com.peoplefirst.motorino.destinazione.model.UserDestinazioneEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDestinazioneRepository extends CrudRepository<UserDestinazioneEntity, Long> {
}
