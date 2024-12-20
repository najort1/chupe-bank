package com.nuhcorre.chupebankbackend.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ConsultaCartaoDTO(
        @JsonProperty("id")
        UUID id,
        @JsonProperty("senha")
        String senha,
        @JsonProperty("novaSenha")
        String novaSenha
) {
}
