package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface Conta_BancariaRepository extends JpaRepository<Conta_Bancaria, UUID> {

  Optional<Conta_Bancaria> findByUsuarioId(UUID usuarioId);
  Optional<Conta_Bancaria> findByUsuarioCpf(String cpf);
  Optional<Conta_Bancaria> findByUsuarioEmail(String email);
  Optional<Conta_Bancaria> findByNumeroConta(String numeroConta);

}