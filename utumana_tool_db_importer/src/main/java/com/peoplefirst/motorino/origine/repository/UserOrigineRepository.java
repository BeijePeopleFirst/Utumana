package com.peoplefirst.motorino.origine.repository;

import com.peoplefirst.motorino.origine.model.UserOrigineEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserOrigineRepository extends CrudRepository<UserOrigineEntity, Integer> {
}
