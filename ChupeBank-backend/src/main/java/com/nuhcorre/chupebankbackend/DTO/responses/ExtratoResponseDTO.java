package com.nuhcorre.chupebankbackend.DTO.responses;

import java.util.UUID;

public record ExtratoResponseDTO(


        UUID id,
        String tipo,
        Double valor,
        Double saldo,
        String descricao,
        java.time.LocalDateTime dataHora


        ) {


}
