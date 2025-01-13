package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

  @Query("SELECT c FROM Chat c WHERE c.usuario1.id = :idUsuario OR c.usuario2.id = :idUsuario")
  List<Chat> findAllByUsuario1OrUsuario2(UUID idUsuario);

  @Transactional
  @Modifying
  @Query("UPDATE Chat c SET c.ultimaMensagem = :ultimaConversa WHERE c.roomHash = :roomHash")
  void setUltimaConversaByRoomHash(String roomHash, String ultimaConversa);


  Optional<Chat> findByRoomHash(String roomHash);

}