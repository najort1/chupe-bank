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

    public void registrarTransacao(UUID contaBancariaId, String tipoTransacao, Double valor, Double saldoAposTransacao, String descricao, UUID contaDestinoId) {
        Conta_Bancaria contaBancaria = conta_BancariaRepository.findById(contaBancariaId).orElseThrow(() -> new IllegalArgumentException("Conta bancária não encontrada"));
        Extrato extrato = new Extrato();
        extrato.setId(UUID.randomUUID()); // Definindo o ID manualmente
        extrato.setContaBancaria(contaBancaria);
        extrato.setDataHora(LocalDateTime.now());
        extrato.setTipoTransacao(tipoTransacao);
        extrato.setValor(valor);
        extrato.setSaldoAposTransacao(saldoAposTransacao);
        extrato.setDescricao(descricao);

        if(tipoTransacao.equals("TRANSFERENCIA")) {
            Conta_Bancaria contaDestino = conta_BancariaRepository.findById(contaDestinoId).orElseThrow(() -> new IllegalArgumentException("Conta destino não encontrada"));
            Extrato extratoDestino = new Extrato();
            extratoDestino.setId(UUID.randomUUID());
            extratoDestino.setContaBancaria(contaDestino);
            extratoDestino.setDataHora(LocalDateTime.now());
            extratoDestino.setTipoTransacao("RECEBIMENTO"); // Corrigido aqui
            extratoDestino.setValor(valor);
            extratoDestino.setSaldoAposTransacao(contaDestino.getSaldo() + valor);
            extratoDestino.setDescricao("Recebimento de transferência de " + contaBancaria.getUsuario().getNome());
            extratoRepository.save(extratoDestino);
        }

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
