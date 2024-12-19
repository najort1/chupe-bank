package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.repository.CartaoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class CartaoService {

    private final CartaoRepository cartaoRepository;
    private final PasswordEncoder passwordEncoder;

    public CartaoService(CartaoRepository cartaoRepository, PasswordEncoder passwordEncoder) {
        this.cartaoRepository = cartaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Cartao> buscarCartoesComTentativas() {
        return cartaoRepository.findByTentativasGreaterThan(0);
    }

    public void salvar(Cartao cartao) {
        cartaoRepository.save(cartao);
    }

    public Cartao buscarPorUsuario(UUID id) {
        return cartaoRepository.findByContaBancariaId(id).orElse(null);
    }

    public Cartao capturarCartaoId(UUID id) {
        return cartaoRepository.findById(id).orElse(null);
    }


    public void bloquearCartao(UUID cartaoId) {
        cartaoRepository.findById(cartaoId).ifPresent(cartao -> {
            cartao.setBloqueado(true);
            cartaoRepository.save(cartao);
        });
    }

    public void desbloquearCartao(String numeroConta) {
        cartaoRepository.findByContaBancariaNumeroConta(numeroConta).ifPresent(cartao -> {
            cartao.setBloqueado(false);
            cartaoRepository.save(cartao);
        });
    }

    public void alterarSenha(String numeroConta, String senha) {
        cartaoRepository.findByContaBancariaNumeroConta(numeroConta).ifPresent(cartao -> {
            cartao.setSenha(passwordEncoder.encode(senha));
            cartaoRepository.save(cartao);
        });
    }

    public List<Cartao> listarCartoes(String numeroConta) {
        return cartaoRepository.findAllByContaBancariaNumeroConta(numeroConta);
    }

    public void criarCartao(Cartao cartao) {
        Cartao newCard = new Cartao();
        newCard.setId(UUID.randomUUID()); // Define o UUID manualmente
        newCard.setContaBancaria(cartao.getContaBancaria());
        newCard.setNumero(gerarNumeroCartao());
        newCard.setSenha(passwordEncoder.encode(newCard.getNumero().substring(newCard.getNumero().length() - 4)));
        newCard.setDataValidade(gerarDataValidade());
        newCard.setCvv(gerarCvv());
        newCard.setBloqueado(false);
        newCard.setTentativas(0);
        newCard.setLimite(1000.0);
        cartaoRepository.save(newCard);
    }

    public String gerarNumeroCartao() {
        return "54920529" + String.format("%08d", (int) (Math.random() * 100000000));
    }

    public Date gerarDataValidade() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, 3); // Adiciona 3 anos à data atual
        return calendar.getTime();
    }

    public Integer gerarCvv() {
        return (int) (Math.random() * 1000);
    }

}