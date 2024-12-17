package com.nuhcorre.chupebankbackend.DTO;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nuhcorre.chupebankbackend.enums.TipoChave;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record TransferirDTO(

        @JsonProperty("tipo_chave")
        TipoChave tipoChave,

        @JsonProperty("chave")
        String chave,

        @JsonProperty("valor")
        Double valor,

        @JsonProperty("senha")
        String senha

) {
}
