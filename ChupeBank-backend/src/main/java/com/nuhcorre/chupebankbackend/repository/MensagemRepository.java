package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    List<Mensagem> findAllByReceiverId(UUID receiverId);

    @Transactional
    void deleteAllByReceiverId(UUID receiverId);

}