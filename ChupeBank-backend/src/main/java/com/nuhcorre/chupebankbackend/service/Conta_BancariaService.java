package com.nuhcorre.chupebankbackend.service;


import com.nuhcorre.chupebankbackend.DTO.TransferirDTO;
import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.Conta_BancariaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.nuhcorre.chupebankbackend.enums.TipoChave;

import java.util.UUID;

@Service
public class Conta_BancariaService {
    private final Conta_BancariaRepository conta_bancariaRepository;
    private final ExtratoService extratoService;

    public Conta_BancariaService(Conta_BancariaRepository conta_bancariaRepository, ExtratoService extratoService) {
        this.extratoService = extratoService;
        this.conta_bancariaRepository = conta_bancariaRepository;
    }

    public Conta_Bancaria criarConta(Usuario usuario) {
        Conta_Bancaria conta = new Conta_Bancaria();
        conta.setId(UUID.randomUUID());
        conta.setSaldo(1000.0);
        conta.setNumeroConta(generateAccountNumber());
        conta.setAgencia("0001");
        conta.setUsuario(usuario);
        return conta_bancariaRepository.save(conta);
    }

    public Conta_Bancaria buscarConta(UUID usuarioId) {
        return conta_bancariaRepository.findByUsuarioId(usuarioId).orElseThrow();
    }

    private String generateAccountNumber() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    public Conta_Bancaria buscarContaPorNumero(String numeroConta) {
        return conta_bancariaRepository.findByNumeroConta(numeroConta).orElseThrow();
    }

    public void depositar(UUID usuarioId, Double valor) {
        conta_bancariaRepository.findByUsuarioId(usuarioId).ifPresent(conta -> {
            conta.setSaldo(conta.getSaldo() + valor);
            conta_bancariaRepository.save(conta);
            extratoService.registrarTransacao(conta.getId(), "DEPOSITO", valor, conta.getSaldo(), "Depósito de dinheiro");
        });
    }

    public void sacar(UUID usuarioId, Double valor) {
        conta_bancariaRepository.findByUsuarioId(usuarioId).ifPresent(conta -> {
            conta.setSaldo(conta.getSaldo() - valor);
            conta_bancariaRepository.save(conta);
            extratoService.registrarTransacao(conta.getId(), "SAQUE", valor, conta.getSaldo(), "Saque de dinheiro");
        });
    }

    public void transferir(UUID usuarioId, TransferirDTO transferirDTO) {
        conta_bancariaRepository.findByUsuarioId(usuarioId).ifPresent(conta -> {
            conta.setSaldo(conta.getSaldo() - transferirDTO.valor());
            conta_bancariaRepository.save(conta);
            extratoService.registrarTransacao(conta.getId(), "TRANSFERENCIA", transferirDTO.valor(), conta.getSaldo(), "Transferência de dinheiro para " + transferirDTO.chave());
        });

        switch (transferirDTO.tipoChave()){
            case CPF:
                conta_bancariaRepository.findByUsuarioCpf(transferirDTO.chave()).ifPresent(conta -> {
                    conta.setSaldo(conta.getSaldo() + transferirDTO.valor());
                    conta_bancariaRepository.save(conta);
                });
                break;
            case EMAIL:
                conta_bancariaRepository.findByUsuarioEmail(transferirDTO.chave()).ifPresent(conta -> {
                    conta.setSaldo(conta.getSaldo() + transferirDTO.valor());
                    conta_bancariaRepository.save(conta);
                });
                break;
            case NUMERO_CONTA:
                conta_bancariaRepository.findByNumeroConta(transferirDTO.chave()).ifPresent(conta -> {
                    conta.setSaldo(conta.getSaldo() + transferirDTO.valor());
                    conta_bancariaRepository.save(conta);
                });
                break;

            default:
                break;
        }

    }

}
