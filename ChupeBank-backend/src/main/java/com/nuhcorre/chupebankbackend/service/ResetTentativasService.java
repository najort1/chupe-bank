package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Cartao;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResetTentativasService
{

    private final CartaoService cartaoService;

    public ResetTentativasService(CartaoService cartaoService) {
        this.cartaoService = cartaoService;
    }

    @Scheduled(fixedRate = 1800000) // 30 minutos em milissegundos
    public void resetTentativas() {
        List<Cartao> cartoes = cartaoService.buscarCartoesComTentativas();
        for (Cartao cartao : cartoes) {
            cartao.setTentativas(0);
            cartaoService.salvar(cartao);
        }
    }

}
