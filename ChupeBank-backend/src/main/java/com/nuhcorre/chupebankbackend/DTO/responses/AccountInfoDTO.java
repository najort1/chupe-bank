package com.nuhcorre.chupebankbackend.DTO.responses;

public record AccountInfoDTO(
        Double saldo,
        String numeroConta,
        String agencia

) {
}
