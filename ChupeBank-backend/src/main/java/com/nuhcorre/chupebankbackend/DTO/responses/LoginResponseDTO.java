package com.nuhcorre.chupebankbackend.DTO.responses;

public record LoginResponseDTO(
        String token,
        String error,
        String message
) {
}
