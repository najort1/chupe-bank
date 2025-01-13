package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "conta_bancaria")
public class Conta_Bancaria {


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
