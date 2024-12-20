package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.DTO.responses.ExtratoResponseDTO;
import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Extrato;
import com.nuhcorre.chupebankbackend.repository.Conta_BancariaRepository;
import com.nuhcorre.chupebankbackend.repository.ExtratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExtratoService {


    private final ExtratoRepository extratoRepository;
    private final Conta_BancariaRepository conta_BancariaRepository;

    public ExtratoService(ExtratoRepository extratoRepository, Conta_BancariaRepository conta_BancariaRepository) {
        this.extratoRepository = extratoRepository;
        this.conta_BancariaRepository = conta_BancariaRepository;
    }

    public void registrarTransacao(UUID contaBancariaId, String tipoTransacao, Double valor, Double saldoAposTransacao, String descricao) {
        Conta_Bancaria contaBancaria = conta_BancariaRepository.findById(contaBancariaId).orElseThrow(() -> new IllegalArgumentException("Conta bancária não encontrada"));
        Extrato extrato = new Extrato();
        extrato.setContaBancaria(contaBancaria);
        extrato.setDataHora(LocalDateTime.now());
        extrato.setTipoTransacao(tipoTransacao);
        extrato.setValor(valor);
        extrato.setSaldoAposTransacao(saldoAposTransacao);
        extrato.setDescricao(descricao);
        System.out.println("Descrição: " + descricao); // Adicione este log para depuração
        extratoRepository.save(extrato);
    }

    public Extrato buscarUltimoExtrato(UUID contaBancariaId) {
        return extratoRepository.findFirstByContaBancariaIdOrderByDataHoraDesc(contaBancariaId);
    }

    public void deletarTodoExtrato(UUID usuarioId) {
        List<Extrato> extratos = extratoRepository.findByContaBancariaUsuarioId(usuarioId);
        extratoRepository.deleteAll(extratos);
    }

    public List<Extrato> buscarExtrato(UUID contaBancariaId) {
        return extratoRepository.findByContaBancariaId(contaBancariaId);
    }

    public Page<ExtratoResponseDTO> buscarPorUsuario(UUID usuarioId, Pageable pageable, String tipo) {
        Page<Extrato> extratos;
        if (tipo != null && !tipo.isEmpty()) {
            extratos = extratoRepository.findByContaBancariaUsuarioIdAndTipoTransacao(usuarioId, tipo, pageable);
        } else {
            extratos = extratoRepository.findByContaBancariaUsuarioId(usuarioId, pageable);
        }
        return extratos.map(extrato -> new ExtratoResponseDTO(
                extrato.getId(),
                extrato.getTipoTransacao(),
                extrato.getValor(),
                extrato.getSaldoAposTransacao(),
                extrato.getDescricao(),
                extrato.getDataHora()
        ));
    }


}
