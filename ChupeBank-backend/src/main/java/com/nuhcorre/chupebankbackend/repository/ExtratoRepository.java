package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Extrato;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExtratoRepository extends JpaRepository<Extrato, UUID> {
    List<Extrato> findByContaBancariaId(UUID contaBancariaId);
    Extrato findFirstByContaBancariaIdOrderByDataHoraDesc(UUID contaBancariaId);
    void deleteAllByContaBancariaId(UUID contaBancariaId);
    List<Extrato> findByContaBancariaUsuarioId(UUID usuarioId);



    Page<Extrato> findByContaBancariaUsuarioId(UUID usuarioId, Pageable pageable);
    Page<Extrato> findByContaBancariaUsuarioIdAndTipoTransacao(UUID usuarioId, String tipoTransacao, Pageable pageable);
}