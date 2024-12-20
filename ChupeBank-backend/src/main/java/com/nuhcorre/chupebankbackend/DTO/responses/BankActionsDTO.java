package com.nuhcorre.chupebankbackend.DTO.responses;

import java.util.UUID;

public record BankActionsDTO(
        UUID transactionId,
        Double saldo,
        java.time.LocalDateTime dataTransacao,
        Double valor,
        Double saldoFinal
) {
}
