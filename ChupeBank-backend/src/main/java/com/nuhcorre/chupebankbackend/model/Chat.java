package com.nuhcorre.chupebankbackend.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@Entity
@RequiredArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario1")
    private Usuario usuario1;

    @ManyToOne
    @JoinColumn(name = "id_usuario2")
    private Usuario usuario2;

    @Column(nullable = false)
    private String roomHash;

    private String ultimaMensagem;

    private String titulo;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;



}