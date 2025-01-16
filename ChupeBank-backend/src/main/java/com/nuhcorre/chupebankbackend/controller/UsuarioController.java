package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final AuthenticationService authenticationService;
    private final Conta_BancariaService contaBancariaService;
    private final CartaoService cartaoService;
    private final ExtratoService extratoService;
    private final ChatService chatService;

    public UsuarioController(AuthenticationService authenticationService, Conta_BancariaService contaBancariaService, CartaoService cartaoService, ExtratoService extratoService, ChatService chatService) {
        this.authenticationService = authenticationService;
        this.contaBancariaService = contaBancariaService;
        this.cartaoService = cartaoService;
        this.extratoService = extratoService;
        this.chatService = chatService;

    }

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletarUsuario() {
        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        if (usuarioAutenticado != null) {
            try {
                UUID usuarioId = usuarioAutenticado.getId();
                extratoService.deletarTodoExtrato(usuarioId);
                cartaoService.deletarCartoesPorUsuarioId(usuarioId);
                contaBancariaService.deletarConta(usuarioId);
                chatService.deletarTudo(usuarioId);
                authenticationService.deletarUsuario(usuarioId);
                return ResponseEntity.ok("Usuário deletado com sucesso");
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Erro ao deletar o usuário: " + e.getMessage());
            }
        }
        return ResponseEntity.status(401).body("Usuário não autenticado");
    }

    @PostMapping("/mudar")
    public ResponseEntity<?> tornarAtendente() {
        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        if (usuarioAutenticado != null) {

            Boolean isAtendente = authenticationService.validaAtendente(usuarioAutenticado.getId());

            if (isAtendente) {
                authenticationService.transformarCliente(usuarioAutenticado.getId());
                return ResponseEntity.ok("Usuário agora é um cliente");
            }

            try {
                authenticationService.transformarAtendente(usuarioAutenticado.getId());
                return ResponseEntity.ok("Usuário agora é um atendente");
            } catch (Exception e) {
                log.error("e: ", e);
                return ResponseEntity.status(500).body("Erro ao tornar o usuário um atendente: " + e.getMessage());
            }
        }
        return ResponseEntity.status(401).body("Usuário não autenticado");
    }

    @GetMapping("/valida-atendente")
    public ResponseEntity<Boolean> validaAtendente() {
        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        if (usuarioAutenticado != null) {
            return ResponseEntity.ok(authenticationService.validaAtendente(usuarioAutenticado.getId()));
        }
        return ResponseEntity.status(401).body(false);
    }

}