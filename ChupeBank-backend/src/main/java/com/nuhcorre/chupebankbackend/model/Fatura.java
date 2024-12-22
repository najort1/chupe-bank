package com.nuhcorre.chupebankbackend.model;


import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

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

    public Fatura(UUID id, Double valor, Boolean pago, java.time.LocalDateTime dataVencimento, java.time.LocalDateTime dataPagamento, Cartao cartao) {
        this.id = id;
        this.valor = valor;
        this.pago = pago;
        this.dataVencimento = dataVencimento;
        this.dataPagamento = dataPagamento;
        this.cartao = cartao;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Boolean getPago() {
        return pago;
    }

    public void setPago(Boolean pago) {
        this.pago = pago;
    }

    public LocalDateTime getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDateTime dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public LocalDateTime getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDateTime dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public Cartao getCartao() {
        return cartao;
    }

    public void setCartao(Cartao cartao) {
        this.cartao = cartao;
    }
}
