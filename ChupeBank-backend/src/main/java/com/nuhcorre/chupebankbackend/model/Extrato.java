package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "extrato")
public class Extrato {

    public Extrato() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Conta_Bancaria getContaBancaria() {
        return contaBancaria;
    }

    public void setContaBancaria(Conta_Bancaria contaBancaria) {
        this.contaBancaria = contaBancaria;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getTipoTransacao() {
        return tipoTransacao;
    }

    public void setTipoTransacao(String tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Double getSaldoAposTransacao() {
        return saldoAposTransacao;
    }

    public void setSaldoAposTransacao(Double saldoAposTransacao) {
        this.saldoAposTransacao = saldoAposTransacao;
    }

    public Extrato(UUID id, Conta_Bancaria contaBancaria, LocalDateTime dataHora, String tipoTransacao, Double valor, Double saldoAposTransacao, String descricao) {
        this.id = id;
        this.contaBancaria = contaBancaria;
        this.dataHora = dataHora;
        this.tipoTransacao = tipoTransacao;
        this.valor = valor;
        this.saldoAposTransacao = saldoAposTransacao;
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
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