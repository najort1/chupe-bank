package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.responses.AllCardsResponseDTO;
import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.CartaoService;
import com.nuhcorre.chupebankbackend.service.Conta_BancariaService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cartao")
public class CartaoController {

    private final CartaoService cartaoService;
    private final Conta_BancariaService contaBancariaService;

    public CartaoController(CartaoService cartaoService, Conta_BancariaService contaBancariaService) {
        this.cartaoService = cartaoService;
        this.contaBancariaService = contaBancariaService;
    }

    @GetMapping("/todos")
    public List<AllCardsResponseDTO> getTodos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {
            Conta_Bancaria conta = contaBancariaService.buscarConta(usuario.getId());
            List<Cartao> cartoes = cartaoService.listarCartoes(conta.getNumeroConta());
            return cartoes.stream()
                    .map(cartao -> new AllCardsResponseDTO(
                            cartao.getId(),
                            "**** **** **** " + cartao.getNumero().substring(12),
                            usuario.getNome(),
                            "MasterCard",
                            "***",
                            cartao.getDataValidade().toString(),
                            cartao.getLimite()
                    ))
                    .collect(Collectors.toList());
        }
        return List.of();
    }

}
