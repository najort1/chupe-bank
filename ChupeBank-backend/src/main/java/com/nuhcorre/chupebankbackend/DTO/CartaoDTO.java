package com.nuhcorre.chupebankbackend.DTO;

import java.util.Date;
import java.util.UUID;

public record CartaoDTO(
        UUID id,
        String numero,
        Date dataValidade,
        String cvv,
        Double limite,
        Boolean bloqueado

        ) {
}
