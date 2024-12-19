package com.nuhcorre.chupebankbackend.DTO;

import java.util.UUID;

public record ConsultaCartaoDTO(
        UUID id,
        String senha
) {
}
