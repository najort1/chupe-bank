package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.DTO.UserLoginDTO;
import com.nuhcorre.chupebankbackend.DTO.UserRegisterDTO;
import com.nuhcorre.chupebankbackend.model.Cartao;
import com.nuhcorre.chupebankbackend.model.Conta_Bancaria;
import com.nuhcorre.chupebankbackend.model.Role;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.Conta_BancariaRepository;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nuhcorre.chupebankbackend.util.ValidaCPF;

import java.util.List;
import java.util.UUID;

@Service
public class AuthenticationService {
    private final UsuarioRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final Conta_BancariaService contaBancariaService;

    private final CartaoService cartaoService;

    private final ExtratoService extratoService;

    private final RoleService roleService;

    public AuthenticationService(
            UsuarioRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            Conta_BancariaService contaBancariaService,
            CartaoService cartaoService,
            ExtratoService extratoService,
            RoleService roleService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.contaBancariaService = contaBancariaService;
        this.cartaoService = cartaoService;
        this.extratoService = extratoService;
        this.roleService = roleService;
    }

    public Usuario cadastrar(UserRegisterDTO input) {

        if(!ValidaCPF.isCPF(input.cpf())) {
            throw new IllegalArgumentException("CPF inválido");
        }else if(!input.email().contains("@") || !input.email().contains(".")){
            throw new IllegalArgumentException("Email inválido");
        }else if(input.senha().length() < 6){
            throw new IllegalArgumentException("Senha inválida");
        }else if (userRepository.existsByEmail(input.email())) {
            throw new IllegalArgumentException("Email já cadastrado");
        }else if (userRepository.existsByCpf(input.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }else if (userRepository.existsByTelefone(input.telefone())) {
            throw new IllegalArgumentException("Telefone já cadastrado");
        }

        Usuario user = new Usuario();
        user.setId(UUID.randomUUID());
        user.setNome(input.nome());
        user.setEmail(input.email());
        user.setSenha(passwordEncoder.encode(input.senha()));
        user.setCpf(input.cpf());
        user.setTelefone(input.telefone());
        roleService.addRoleToUsuario(user.getId(), new Role(null, "USER"));


        // Salvar o usuário antes de criar outras entidades relacionadas
        Usuario savedUser = userRepository.save(user);

        // Criar e salvar a conta bancária
        Conta_Bancaria contaBancaria = contaBancariaService.criarConta(savedUser);

        // Criar e salvar o cartão
        Cartao cartao = new Cartao();
        cartao.setContaBancaria(contaBancaria);
        cartaoService.criarCartao(cartao);

        return savedUser;
    }

    public Usuario logar(UserLoginDTO input) {
        var authentication = new UsernamePasswordAuthenticationToken(input.email(), input.senha());
        var auth = authenticationManager.authenticate(authentication);
        return userRepository.findByEmail(input.email()).orElseThrow();
    }

    public void transformarAtendente(UUID usuarioId) {

        Usuario user = userRepository.findById(usuarioId).
                orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        roleService.addRoleToUsuario(user.getId(), new Role(null, "ATENDENTE"));

    }

    public Boolean validaAtendente(UUID usuarioId) {
        Usuario user = userRepository.findById(usuarioId).
                orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        return user.getRoles().stream().anyMatch(role -> role.getNome().equals("ATENDENTE"));
    }

    public void deletarUsuario(UUID usuarioId) {
        userRepository.deleteById(usuarioId);
    }

}