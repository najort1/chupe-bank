package com.nuhcorre.chupebankbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nuhcorre.chupebankbackend.DTO.BodyCriptografadoDTO;
import com.nuhcorre.chupebankbackend.DTO.UserLoginDTO;
import com.nuhcorre.chupebankbackend.DTO.UserRegisterDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.LoginResponseDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.AuthenticationService;
import com.nuhcorre.chupebankbackend.service.Conta_BancariaService;
import com.nuhcorre.chupebankbackend.service.JwtService;
import com.nuhcorre.chupebankbackend.util.AESUtil;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.UUID;

@RequestMapping("/auth")
@RestController
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    private final Conta_BancariaService contaBancariaService;

    @Autowired
    private SecretKeySpec aesKey;

    @Autowired
    private IvParameterSpec aesIv;

    public AuthController(AuthenticationService authenticationService, JwtService jwtService, ObjectMapper objectMapper, Conta_BancariaService contaBancariaService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.contaBancariaService = contaBancariaService;
        this.objectMapper = objectMapper;
    }


    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody BodyCriptografadoDTO input) {
        return processRequest(input, true);
    }

    @PostMapping("/cadastrar")
    public LoginResponseDTO cadastrar(@RequestBody BodyCriptografadoDTO input) {
        return processRequest(input, false);
    }


    private LoginResponseDTO processRequest(BodyCriptografadoDTO input, boolean isLogin) {
        try {
            String encryptedBody = input.encryptedBody();
            validateBase64(encryptedBody);

            String decryptedBody = AESUtil.decrypt(encryptedBody, aesKey, aesIv);
            if (isLogin) {
                UserLoginDTO inputLogin = objectMapper.readValue(decryptedBody, UserLoginDTO.class);
                var user = authenticationService.logar(inputLogin);
                var token = jwtService.generateToken(user);
                return new LoginResponseDTO(token, null, null);
            } else {
                UserRegisterDTO inputRegister = objectMapper.readValue(decryptedBody, UserRegisterDTO.class);
                var user = authenticationService.cadastrar(inputRegister);
                var token = jwtService.generateToken(user);
                return new LoginResponseDTO(token, null, null);
            }

        } catch (DataIntegrityViolationException e) {
            return new LoginResponseDTO(null, "Erro ao realizar cadastro", "Parece que alguém já cadastrou algum dos dados informados");
        } catch (Exception e) {
            return new LoginResponseDTO(null, isLogin ? "Erro ao realizar login" : "Erro ao realizar cadastro", e.getMessage());
        }
    }

    private void validateBase64(String encryptedBody) {
        if (!Base64.isBase64(encryptedBody)) {
            throw new IllegalArgumentException("O corpo da requisição não está codificado em Base64.");
        }
    }
}
