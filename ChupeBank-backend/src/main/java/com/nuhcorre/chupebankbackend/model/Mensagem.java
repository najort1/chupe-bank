package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@Entity
@RequiredArgsConstructor
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID senderId;
    private UUID receiverId;
    private String content;
    private Timestamp timestamp;
    private String type;
    private String roomId;


    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

}
