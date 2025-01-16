package com.nuhcorre.chupebankbackend.controller;


import com.nuhcorre.chupebankbackend.DTO.DarCartaoDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.AtendenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController
@RequestMapping("/atendente")
public class AtendenteController {

    private final AtendenteService atendenteService;

    public AtendenteController(AtendenteService atendenteService) {
        this.atendenteService = atendenteService;
    }

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    private ResponseEntity<String> verificarUsuarioAutenticado(Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não autenticado");
        }
        return null;
    }

    private ResponseEntity<String> verificarPermissaoAtendente(Usuario usuario) {
        if (usuario.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ATENDENTE"))) {
            return ResponseEntity.badRequest().body("Você não tem permissão para acessar esse recurso");
        }
        return null;
    }


    @PostMapping("/dar")
    public ResponseEntity<String> darCartao(@RequestBody DarCartaoDTO input) {

        Usuario usuario = obterUsuarioAutenticado();
        ResponseEntity<String> response = verificarUsuarioAutenticado(usuario);
        if (response != null) {
            return response;
        }

        response = verificarPermissaoAtendente(usuario);
        if (response != null) {
            return response;
        }

        atendenteService.darCartao(input.usuarioId());
        return ResponseEntity.ok("Cartão criado com sucesso");

    }



}
