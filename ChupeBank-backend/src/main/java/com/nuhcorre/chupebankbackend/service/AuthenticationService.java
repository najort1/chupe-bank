package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.DTO.UserLoginDTO;
import com.nuhcorre.chupebankbackend.DTO.UserRegisterDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthenticationService {
    private final UsuarioRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UsuarioRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrar(UserRegisterDTO input) {
        Usuario user = new Usuario();
        user.setId(UUID.randomUUID());
        user.setNome(input.nome());
        user.setEmail(input.email());
        user.setSenha(passwordEncoder.encode(input.senha()));
        user.setCpf(input.cpf());
        user.setTelefone(input.telefone());

        return userRepository.save(user);
    }

    public Usuario logar(UserLoginDTO input) {
        var authentication = new UsernamePasswordAuthenticationToken(input.email(), input.senha());
        var auth = authenticationManager.authenticate(authentication);
        return userRepository.findByEmail(input.email()).orElseThrow();
    }
}