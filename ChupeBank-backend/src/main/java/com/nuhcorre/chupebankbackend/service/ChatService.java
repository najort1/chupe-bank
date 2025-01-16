package com.nuhcorre.chupebankbackend.service;


import com.nuhcorre.chupebankbackend.model.Chat;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.ChatRepository;
import com.nuhcorre.chupebankbackend.repository.MensagemRepository;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;


    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private final RoomService roomService;

    @Autowired
    private final UsuarioRepository usuarioRepository;

    public String criarCanalAtendimento(UUID idUsuario,String titulo,String descricao) {

        Chat chat = new Chat();
        chat.setId(null);

        chat.setUsuario1(usuarioRepository.findById(idUsuario).get());

        String roomHash = roomService.createRoom(idUsuario.toString());
        chat.setRoomHash(roomHash);
        chat.setTitulo(titulo);
        chat.setDescricao(descricao);
        chatRepository.save(chat);
        return roomHash;

    }

    public String entrarCanalAtendimento(UUID idUsuario, String roomHash) {
        Optional<Chat> chat = chatRepository.findByRoomHash(roomHash);
        if (chat.isPresent()) {
            if (chat.get().getUsuario1().getId().equals(idUsuario)) {
                return roomHash;
            } else {
                chat.get().setUsuario2(usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado")));
                chatRepository.save(chat.get());
                return roomHash;
            }
        } else {
            return null;
        }
    }

    public void deletarTudo(UUID idUsuario) {
        List<Chat> chats = chatRepository.findAllByUsuario1OrUsuario2(idUsuario);
        chatRepository.deleteAll(chats);
    }

    public Boolean atendenteJaEntrou(UUID idUsuario, String roomHash) {
        Optional<Chat> chat = chatRepository.findByRoomHash(roomHash);
        if (chat.isPresent()) {
            Usuario usuario2 = chat.get().getUsuario2();

            if(usuario2 != null){
                return usuario2.getId().equals(idUsuario);
            }

            return false;

        } else {
            return null;
        }
    }

    public List<Chat> listarAtendimentosUsuario(UUID idUsuario) {
        return chatRepository.findAllByUsuario1OrUsuario2(idUsuario);
    }

    @Transactional
    public void setUltimaConversaByRoomHash(String roomHash, String ultimaConversa){
        chatRepository.setUltimaConversaByRoomHash(roomHash, ultimaConversa);
    }

    public List<Chat> listarAtendimentos() {
        return chatRepository.findAll();
    }

}
