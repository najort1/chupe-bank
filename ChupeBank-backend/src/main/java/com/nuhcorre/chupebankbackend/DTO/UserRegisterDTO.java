package com.nuhcorre.chupebankbackend.DTO;

public record UserRegisterDTO(
        String nome,
        String email,
        String senha,
        String cpf,
        String telefone
) {
}
