package com.nuhcorre.chupebankbackend.repository;

import com.nuhcorre.chupebankbackend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);


    Boolean existsByEmail(String email);
    Boolean existsByCpf(String cpf);
    Boolean existsByTelefone(String telefone);


}