package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.DTO.UserLoginDTO;
import com.nuhcorre.chupebankbackend.DTO.UserRegisterDTO;
import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.Conta_BancariaRepository;
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

    private final Conta_BancariaService contaBancariaService;

    private final CartaoService cartaoService;

    public AuthenticationService(
            UsuarioRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            Conta_BancariaService contaBancariaService,
            CartaoService cartaoService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.contaBancariaService = contaBancariaService;
        this.cartaoService = cartaoService;
    }

    public Usuario cadastrar(UserRegisterDTO input) {
        Usuario user = new Usuario();
        user.setId(UUID.randomUUID());
        user.setNome(input.nome());
        user.setEmail(input.email());
        user.setSenha(passwordEncoder.encode(input.senha()));
        user.setCpf(input.cpf());
        user.setTelefone(input.telefone());

        Usuario savedUser = userRepository.save(user);
        contaBancariaService.criarConta(savedUser);
        Cartao cartao = new Cartao();
        cartao.setContaBancaria(contaBancariaService.buscarConta(savedUser.getId()));
        cartaoService.criarCartao(cartao);
        return savedUser;
    }

    public Usuario logar(UserLoginDTO input) {
        var authentication = new UsernamePasswordAuthenticationToken(input.email(), input.senha());
        var auth = authenticationManager.authenticate(authentication);
        return userRepository.findByEmail(input.email()).orElseThrow();
    }
}