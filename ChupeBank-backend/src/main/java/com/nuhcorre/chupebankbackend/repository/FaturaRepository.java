package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FaturaRepository extends JpaRepository<Fatura, UUID> {


    List<Fatura> findByCartaoId(UUID cartaoId);
    Fatura findFirstByCartaoIdOrderByDataVencimentoDesc(UUID cartaoId);

}