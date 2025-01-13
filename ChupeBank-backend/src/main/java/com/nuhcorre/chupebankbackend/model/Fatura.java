package com.nuhcorre.chupebankbackend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "fatura")
public class Fatura {

    @Id
    private UUID id;

    @Column(name = "valor")
    private Double valor;

    @Column(name = "pago")
    private Boolean pago;

    @Column(name = "data_vencimento")
    private java.time.LocalDateTime dataVencimento;

    @Column(name = "data_pagamento")
    private java.time.LocalDateTime dataPagamento;


    @ManyToOne
    @JoinColumn(name = "cartao_id")
    private Cartao cartao;

}
