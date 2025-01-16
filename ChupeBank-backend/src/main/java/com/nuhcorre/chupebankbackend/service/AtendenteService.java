package com.nuhcorre.chupebankbackend.service;


import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AtendenteService {

    private final CartaoService cartaoService;
    private final Conta_BancariaService contaBancariaService;
    private final UsuarioRepository usuarioRepository;


    public void darCartao(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        Cartao cartao = new Cartao();
        cartao.setContaBancaria(contaBancariaService.buscarConta(usuarioId));
        cartaoService.criarCartao(cartao);
    }

    public void bloquearCartao(UUID cartaoId) {
        cartaoService.bloquearCartao(cartaoId);
    }

    public void desbloquearCartao(String numeroConta) {
        cartaoService.desbloquearCartao(numeroConta);
    }

    public void aumentarLimite(UUID cartaoId, Double valor) {
        cartaoService.aumentarLimites(cartaoId, valor);
    }


}
