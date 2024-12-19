package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartaoRepository extends JpaRepository<Cartao, UUID> {

    Optional<Cartao> findByContaBancariaNumeroConta(String numeroConta);
    List<Cartao> findAllByContaBancariaNumeroConta(String numeroConta);
    Optional<Cartao> findByContaBancariaId(UUID contaBancariaId);
    List<Cartao> findAllByContaBancariaId(UUID contaBancariaId);
    List<Cartao> findByTentativasGreaterThan(int tentativas);

}