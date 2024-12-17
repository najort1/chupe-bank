package com.nuhcorre.chupebankbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuhcorre.chupebankbackend.DTO.BodyCriptografadoDTO;
import com.nuhcorre.chupebankbackend.DTO.UserLoginDTO;
import com.nuhcorre.chupebankbackend.DTO.UserRegisterDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.LoginResponseDTO;
import com.nuhcorre.chupebankbackend.service.AuthenticationService;
import com.nuhcorre.chupebankbackend.service.JwtService;
import com.nuhcorre.chupebankbackend.util.AESUtil;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@RequestMapping("/auth")
@RestController
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    @Autowired
    private SecretKeySpec aesKey;

    @Autowired
    private IvParameterSpec aesIv;

    public AuthController(AuthenticationService authenticationService, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody BodyCriptografadoDTO input) {
        try {
            String encryptedBody = input.encryptedBody();

            // Verifica se a string está corretamente codificada em Base64
            if (!Base64.isBase64(encryptedBody)) {
                throw new IllegalArgumentException("O corpo da requisição não está codificado em Base64.");
            }

            String decryptedBody = AESUtil.decrypt(encryptedBody, aesKey, aesIv);
            UserLoginDTO inputLogin = new ObjectMapper().readValue(decryptedBody, UserLoginDTO.class);
            var user = authenticationService.logar(inputLogin);
            var token = jwtService.generateToken(user);
            return new LoginResponseDTO(token, null, null);

        } catch (Exception e) {
            return new LoginResponseDTO(null, "Erro ao realizar login", e.getMessage());
        }
    }

    @PostMapping("/cadastrar")
    public LoginResponseDTO cadastrar(@RequestBody BodyCriptografadoDTO input) {

        try {
            String encryptedBody = input.encryptedBody();

            if (!Base64.isBase64(encryptedBody)) {
                throw new IllegalArgumentException("O corpo da requisição não está codificado em Base64.");
            }

            String decryptedBody = AESUtil.decrypt(encryptedBody, aesKey, aesIv);
            UserRegisterDTO inputRegister = new ObjectMapper().readValue(decryptedBody, UserRegisterDTO.class);
            var user = authenticationService.cadastrar(inputRegister);
            var token = jwtService.generateToken(user);
            return new LoginResponseDTO(token, null, null);

        } catch (Exception e) {
            return new LoginResponseDTO(null, "Erro ao realizar cadastro", e.getMessage());
        }

    }

}