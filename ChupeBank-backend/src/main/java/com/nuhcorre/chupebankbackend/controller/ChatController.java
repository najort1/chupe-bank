package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.model.Chat;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat")
    public Chat sendMessage(@Payload Chat chat) {
        return chat;
    }

    @MessageMapping("/chat.register")
    @SendTo("/topic/chat")
    public Chat registerUser(@Payload Chat chat, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chat.getSender());
        return chat;
    }

}