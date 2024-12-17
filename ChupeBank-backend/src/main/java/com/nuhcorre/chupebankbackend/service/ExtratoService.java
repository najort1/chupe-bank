package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Extrato;
import com.nuhcorre.chupebankbackend.repository.Conta_BancariaRepository;
import com.nuhcorre.chupebankbackend.repository.ExtratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

    public List<Extrato> buscarExtrato(UUID contaBancariaId) {
        return extratoRepository.findByContaBancariaId(contaBancariaId);
    }


}
