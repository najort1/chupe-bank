package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "conta_bancaria")
public class Conta_Bancaria {

    public Conta_Bancaria() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Double getSaldo() {
        return saldo;
    }

    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }

    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Cartao> getCartoes() {
        return cartoes;
    }

    public void setCartoes(List<Cartao> cartoes) {
        this.cartoes = cartoes;
    }

    public Conta_Bancaria(UUID id, Double saldo, String numeroConta, String agencia, Usuario usuario, List<Cartao> cartoes) {
        this.id = id;
        this.saldo = saldo;
        this.numeroConta = numeroConta;
        this.agencia = agencia;
        this.usuario = usuario;
        this.cartoes = cartoes;
    }

    @Id
    private UUID id;

    @Column(name = "saldo")
    private Double saldo;

    @Column(name = "numero_conta")
    private String numeroConta;

    @Column(name = "agencia")
    private String agencia;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "contaBancaria")
    private List<Cartao> cartoes;




}
