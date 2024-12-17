package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "cartao")
public class Cartao {

    @Id
    private UUID id;

    @Column(name = "numero", length = 16)
    private String numero;
    @Column(name = "cvv", length = 4)
    private Integer cvv;
    @Column(name = "data_validade")
    private Date dataValidade;
    @Column(name = "limite")
    private Double limite;
    @Column(name = "senha", length = 4)
    private Integer senha;
    @Column(name = "bloqueado")
    private Boolean bloqueado;
    @Column(name = "tentativas")
    private Integer tentativas;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    private Conta_Bancaria contaBancaria;


    public Cartao(UUID id, String numero, Integer cvv, Date dataValidade, Double limite, Integer senha, Boolean bloqueado, Integer tentativas, Conta_Bancaria contaBancaria) {
        this.id = id;
        this.numero = numero;
        this.cvv = cvv;
        this.dataValidade = dataValidade;
        this.limite = limite;
        this.senha = senha;
        this.bloqueado = bloqueado;
        this.tentativas = tentativas;
        this.contaBancaria = contaBancaria;
    }

    public Cartao() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Integer getCvv() {
        return cvv;
    }

    public void setCvv(Integer cvv) {
        this.cvv = cvv;
    }

    public Date getDataValidade() {
        return dataValidade;
    }

    public void setDataValidade(Date dataValidade) {
        this.dataValidade = dataValidade;
    }

    public Double getLimite() {
        return limite;
    }

    public void setLimite(Double limite) {
        this.limite = limite;
    }

    public Integer getSenha() {
        return senha;
    }

    public void setSenha(Integer senha) {
        this.senha = senha;
    }

    public Boolean getBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(Boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public Conta_Bancaria getContaBancaria() {
        return contaBancaria;
    }

    public void setContaBancaria(Conta_Bancaria contaBancaria) {
        this.contaBancaria = contaBancaria;
    }

    public Integer getTentativas() {
        return tentativas;
    }

    public void setTentativas(Integer tentativas) {
        this.tentativas = tentativas;
    }
}
