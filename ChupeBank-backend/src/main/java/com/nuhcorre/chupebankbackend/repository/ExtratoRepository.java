package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Extrato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExtratoRepository extends JpaRepository<Extrato, UUID> {
    List<Extrato> findByContaBancariaId(UUID contaBancariaId);
}