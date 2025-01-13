package com.nuhcorre.chupebankbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
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
    @Column(name = "senha")
    private String senha;
    @Column(name = "bloqueado")
    private Boolean bloqueado;
    @Column(name = "tentativas")
    private Integer tentativas;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    @JsonBackReference
    private Conta_Bancaria contaBancaria;


}
