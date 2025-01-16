package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.CartaoDTO;
import com.nuhcorre.chupebankbackend.DTO.ConsultaCartaoDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.AllCardsResponseDTO;
import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.CartaoService;
import com.nuhcorre.chupebankbackend.service.Conta_BancariaService;
import com.nuhcorre.chupebankbackend.util.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cartao")
public class CartaoController {

    private final CartaoService cartaoService;
    private final Conta_BancariaService contaBancariaService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private SecretKeySpec aesKey;

    @Autowired
    private IvParameterSpec aesIv;

    public CartaoController(CartaoService cartaoService, Conta_BancariaService contaBancariaService, PasswordEncoder passwordEncoder) {
        this.cartaoService = cartaoService;
        this.contaBancariaService = contaBancariaService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/id")
    public ResponseEntity<?> getCartaoId(@RequestBody ConsultaCartaoDTO consultaCartaoDTO) {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        Cartao cartao = cartaoService.capturarCartaoId(consultaCartaoDTO.id());
        if (!cartao.getContaBancaria().getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.badRequest().body("Cartão não pertence ao usuário");
        }

        return validarSenhaERetornarCartao(consultaCartaoDTO, cartao);
    }

    @GetMapping("/todos")
    public List<AllCardsResponseDTO> getTodos() {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return List.of();
        }

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

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    private ResponseEntity<?> validarSenhaERetornarCartao(ConsultaCartaoDTO consultaCartaoDTO, Cartao cartao) {
        try {
            var senhaDescriptografada = AESUtil.decrypt(consultaCartaoDTO.senha(), aesKey, aesIv);
            if (!passwordEncoder.matches(senhaDescriptografada, cartao.getSenha())) {

                if(cartao.getTentativas() >= 4) {
                    cartaoService.bloquearCartao(cartao.getId());
                    return ResponseEntity.badRequest().body("Cartão bloqueado");
                }

                int tentativasUsuario = cartao.getTentativas() + 1;
                cartao.setTentativas(tentativasUsuario);
                cartaoService.salvar(cartao);

                return ResponseEntity.badRequest().body("Senha incorreta você tem " + (5 - tentativasUsuario) + " tentativas restantes antes do bloqueio");
            }

            int cvv = cartao.getCvv();
            String cvvString = cvv + "";

            return ResponseEntity.ok(new CartaoDTO(
                    cartao.getId(),
                    AESUtil.encrypt(cartao.getNumero(), aesKey, aesIv),
                    cartao.getDataValidade(),
                    AESUtil.encrypt(cvvString, aesKey, aesIv),
                    cartao.getLimite(),
                    cartao.getBloqueado()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao descriptografar senha");
        }
    }


    @PostMapping("/trocar-senha")
    public ResponseEntity<?> trocarSenha(@RequestBody ConsultaCartaoDTO consultaCartaoDTO) {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        Cartao cartao = cartaoService.capturarCartaoId(consultaCartaoDTO.id());
        if (!cartao.getContaBancaria().getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.badRequest().body("Cartão não pertence ao usuário");
        }

        try {
            var senhaDescriptografada = AESUtil.decrypt(consultaCartaoDTO.senha(), aesKey, aesIv);
            System.out.println("senhaDescriptografada = " + senhaDescriptografada);

            if (!passwordEncoder.matches(senhaDescriptografada, cartao.getSenha())) {
                return ResponseEntity.badRequest().body("Senha incorreta");
            }

            var novaSenhDescriptografada = AESUtil.decrypt(consultaCartaoDTO.novaSenha(), aesKey, aesIv);

            cartaoService.alterarSenha(consultaCartaoDTO.id(), novaSenhDescriptografada);
            return ResponseEntity.ok("Senha alterada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao descriptografar senha " + e.getMessage());
        }
    }

}
