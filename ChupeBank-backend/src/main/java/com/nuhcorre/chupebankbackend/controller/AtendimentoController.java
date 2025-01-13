package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.CriarAtendimentoDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.ListaAtendimentosDTO;
import com.nuhcorre.chupebankbackend.model.Chat;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import com.nuhcorre.chupebankbackend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/atendimento")
public class AtendimentoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    @Autowired
    private ChatService chatService;

    @PostMapping("/criar")
    public ResponseEntity<String> criarCanalAtendimento(@RequestBody CriarAtendimentoDTO input) {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não autenticado");
        }
        String roomHash = chatService.criarCanalAtendimento(usuario.getId(), input.titulo(),input.descricao());
        return ResponseEntity.ok(roomHash);
    }

    @PostMapping("/entrar/{roomHash}")
    public ResponseEntity<String> entrarCanalAtendimento(@PathVariable String roomHash) {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não autenticado");
        }

        if(usuario.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ATENDENTE"))) {
            return ResponseEntity.badRequest().body("Você não tem permissão para acessar esse recurso");
        }

        if(chatService.atendenteJaEntrou(usuario.getId(), roomHash)) {
            return ResponseEntity.badRequest().body("Atendente já entrou nesse atendimento");
        }

        String roomHashRetornado = chatService.entrarCanalAtendimento(usuario.getId(), roomHash);
        return ResponseEntity.ok(roomHashRetornado);
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarAtendimentosUsuario() {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não autenticado");
        }
        List<Chat> chats = chatService.listarAtendimentosUsuario(usuario.getId());
        List<ListaAtendimentosDTO> chatDTOs = chats.stream()
                .map(chat -> new ListaAtendimentosDTO(
                        chat.getId(),
                        chat.getUsuario1().getId(),
                        chat.getUsuario2() != null ? chat.getUsuario2().getId() : null,
                        chat.getRoomHash(),
                        chat.getTitulo(),
                        chat.getDescricao(),
                        usuarioRepository.findById(chat.getUsuario1().getId()).get().getNome(),

                        chat.getUltimaMensagem()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(chatDTOs);
    }

    @GetMapping("/listar-todos")
    public ResponseEntity<?> listarTodosAtendimentos() {
        Usuario usuario = obterUsuarioAutenticado();
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não autenticado");
        }
        if(usuario.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ATENDENTE"))) {
            return ResponseEntity.badRequest().body("Você não tem permissão para acessar esse recurso");
        }
        List<Chat> chats = chatService.listarAtendimentos();
        List<ListaAtendimentosDTO> chatDTOs = chats.stream()
                .map(chat -> new ListaAtendimentosDTO(
                        chat.getId(),
                        chat.getUsuario1().getId(),
                        chat.getUsuario2() != null ? chat.getUsuario2().getId() : null,
                        chat.getRoomHash(),
                        chat.getTitulo(),
                        chat.getDescricao(),
                        usuarioRepository.findById(chat.getUsuario1().getId()).get().getNome(),
                        chat.getUltimaMensagem()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(chatDTOs);
    }

}
