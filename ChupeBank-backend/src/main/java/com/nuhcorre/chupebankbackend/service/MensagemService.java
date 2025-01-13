package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Mensagem;
import com.nuhcorre.chupebankbackend.repository.MensagemRepository;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MensagemService {

    @Autowired
    private final MensagemRepository mensagemRepository;

    @Autowired
    private final UsuarioRepository usuarioRepository;

    public Mensagem save(Mensagem mensagem) {
        return mensagemRepository.save(mensagem);
    }

    public List<Mensagem> sincronizacao(UUID idUsuario) {

        System.out.println("Sincronizando mensagens para o usuário: " + idUsuario);
        List<Mensagem> mensagens = mensagemRepository.findAllByReceiverId(idUsuario);
        System.out.println("Mensagens encontradas: " + mensagens.size());
        mensagemRepository.deleteAllByReceiverId(idUsuario);
        return mensagens;

    }

}
