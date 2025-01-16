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
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/atendimento")
public class AtendimentoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChatService chatService;

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

    @PostMapping("/criar")
    public ResponseEntity<String> criarCanalAtendimento(@RequestBody CriarAtendimentoDTO input) {
        Usuario usuario = obterUsuarioAutenticado();
        ResponseEntity<String> response = verificarUsuarioAutenticado(usuario);
        if (response != null) return response;

        String roomHash = chatService.criarCanalAtendimento(usuario.getId(), input.titulo(), input.descricao());
        return ResponseEntity.ok(roomHash);
    }

    @PostMapping("/entrar/{roomHash}")
    public ResponseEntity<String> entrarCanalAtendimento(@PathVariable String roomHash) {
        Usuario usuario = obterUsuarioAutenticado();
        ResponseEntity<String> response = verificarUsuarioAutenticado(usuario);
        if (response != null) return response;

        response = verificarPermissaoAtendente(usuario);
        if (response != null) return response;

        if (chatService.atendenteJaEntrou(usuario.getId(), roomHash)) {
            return ResponseEntity.badRequest().body("Atendente já entrou nesse atendimento");
        }

        String roomHashRetornado = chatService.entrarCanalAtendimento(usuario.getId(), roomHash);
        return ResponseEntity.ok(roomHashRetornado);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ListaAtendimentosDTO>> listarAtendimentosUsuario() {
        Usuario usuario = obterUsuarioAutenticado();
        ResponseEntity<String> response = verificarUsuarioAutenticado(usuario);
        if (response != null) return ResponseEntity.badRequest().body(null);

        List<Chat> chats = chatService.listarAtendimentosUsuario(usuario.getId());
        List<ListaAtendimentosDTO> chatDTOs = converterChatsParaDTOs(chats);
        return ResponseEntity.ok(chatDTOs);
    }

    @GetMapping("/listar-todos")
    public ResponseEntity<List<ListaAtendimentosDTO>> listarTodosAtendimentos() {
        Usuario usuario = obterUsuarioAutenticado();
        ResponseEntity<String> response = verificarUsuarioAutenticado(usuario);
        if (response != null) return ResponseEntity.badRequest().body(null);

        response = verificarPermissaoAtendente(usuario);

        if (response != null) return ResponseEntity.badRequest().body(null);

        List<Chat> chats = chatService.listarAtendimentos();
        List<ListaAtendimentosDTO> chatDTOs = converterChatsParaDTOs(chats);
        return ResponseEntity.ok(chatDTOs);
    }

    private List<ListaAtendimentosDTO> converterChatsParaDTOs(List<Chat> chats) {
        return chats.stream()
                .map(chat -> new ListaAtendimentosDTO(
                        chat.getId(),
                        chat.getUsuario1().getId(),
                        Optional.ofNullable(chat.getUsuario2()).map(Usuario::getId).orElse(null),
                        chat.getRoomHash(),
                        chat.getTitulo(),
                        chat.getDescricao(),
                        usuarioRepository.findById(chat.getUsuario1().getId()).map(Usuario::getNome).orElse("Usuário não encontrado"),
                        chat.getUltimaMensagem()))
                .collect(Collectors.toList());
    }
}
