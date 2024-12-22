package com.nuhcorre.chupebankbackend.model;

public class Chat {
    private String content;
    private String sender;
    private MessageType type;

    public enum MessageType {
        CHAT, LEAVE, JOIN
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public static ChatBuilder builder() {
        return new ChatBuilder();
    }

    public static class ChatBuilder {
        private String content;
        private String sender;
        private MessageType type;

        public ChatBuilder content(String content) {
            this.content = content;
            return this;
        }

        public ChatBuilder sender(String sender) {
            this.sender = sender;
            return this;
        }

        public ChatBuilder type(MessageType type) {
            this.type = type;
            return this;
        }

        public Chat build() {
            Chat chat = new Chat();
            chat.setContent(this.content);
            chat.setSender(this.sender);
            chat.setType(this.type);
            return chat;
        }
    }
}