package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;


@Table(name = "extrato")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Extrato {

    @Id
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "conta_bancaria_id", nullable = false)
    private Conta_Bancaria contaBancaria;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private String tipoTransacao;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private Double saldoAposTransacao;

    @Column(nullable = false)
    private String descricao;

}