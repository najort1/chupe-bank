package com.nuhcorre.chupebankbackend.DTO.responses;

import java.util.UUID;

public record AllCardsResponseDTO(
        UUID id,
        String numeroCartao,
        String nomeTitular,
        String bandeira,
        String cvv,
        String dataExpiracao,
        Double limite
) {
}
