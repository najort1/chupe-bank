package com.nuhcorre.chupebankbackend.controller;


import com.nuhcorre.chupebankbackend.model.Mensagem;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mensagem")
public class MensagemController {

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    @Autowired
    private MensagemService mensagemService;

    //sincronizacao

    @GetMapping("/sincronizacao")
    public ResponseEntity<List<Mensagem>> sincronizacao(){
        Usuario usuario = obterUsuarioAutenticado();
        if(usuario == null){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(mensagemService.sincronizacao(usuario.getId()));
    }
}
