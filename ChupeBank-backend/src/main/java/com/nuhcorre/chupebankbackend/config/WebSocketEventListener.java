package com.nuhcorre.chupebankbackend.config;

import com.nuhcorre.chupebankbackend.model.Chat;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final SimpMessageSendingOperations messagingTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent evenSessionDisconnectEvent) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(evenSessionDisconnectEvent.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("User Disconnected: " + username);
            Chat chatMessage = Chat.builder()
                    .type(Chat.MessageType.LEAVE)
                    .sender(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/chat", chatMessage);
        }
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionDisconnectEvent evenSessionDisconnectEvent) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(evenSessionDisconnectEvent.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("User Connected: " + username);
            Chat chatMessage = Chat.builder()
                    .type(Chat.MessageType.JOIN)
                    .sender(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/chat", chatMessage);
        }
    }

    @EventListener
    public void handleWebSocketSendMessageListener(Chat chat) {
        messagingTemplate.convertAndSend("/topic/chat", chat);
    }

    @EventListener
    public void handleWebSocketRegisterUserListener(Chat chat) {
        messagingTemplate.convertAndSend("/topic/chat", chat);
    }

    @EventListener
    public void handleWebSocketChatSendListener(Chat chat) {
        messagingTemplate.convertAndSend("/topic/chat", chat);
    }

}