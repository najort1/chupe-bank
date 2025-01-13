package com.nuhcorre.chupebankbackend.DTO.responses;

import java.util.UUID;

public record ListaAtendimentosDTO(
        Long id,
        UUID usuario1Id,
        UUID usuario2Id,
        String roomHash,
        String titulo,
        String descricao,
        String nome,
        String ultimaMensagem

) {
}
