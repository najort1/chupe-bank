package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.model.Chat;
import com.nuhcorre.chupebankbackend.model.Mensagem;
import com.nuhcorre.chupebankbackend.service.ChatService;
import com.nuhcorre.chupebankbackend.service.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import com.nuhcorre.chupebankbackend.enums.FiltroPalavras;

@Controller
public class ChatController {

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat/{roomHash}")
    @SendTo("/topic/chat/{roomHash}")
    public Mensagem handleChatMessage(@DestinationVariable String roomHash, Mensagem message) {

        if (FiltroPalavras.PALAVRAS_PROIBIDAS.contains(message.getContent().toLowerCase())) {
            message.setContent("Mensagem bloqueada por conter palavras proibidas");
            return message;
        }

        mensagemService.save(message);
        chatService.setUltimaConversaByRoomHash(roomHash, message.getContent());
        return message;
    }


    @MessageMapping("/chat.register/{roomHash}")
    @SendTo("/topic/public")
    public Mensagem register(@Payload Mensagem chatMessage, SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomHash) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderId());
        return chatMessage;
    }

}