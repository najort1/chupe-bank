package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.TransferirDTO;
import com.nuhcorre.chupebankbackend.DTO.ValorDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.AccountInfoDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.CartaoService;
import com.nuhcorre.chupebankbackend.service.Conta_BancariaService;
import com.nuhcorre.chupebankbackend.util.AESUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    private final Conta_BancariaService conta_BancariaService;
    private final PasswordEncoder passwordEncoder;
    private final CartaoService cartaoService;

    public BankController(Conta_BancariaService conta_BancariaService, PasswordEncoder passwordEncoder, CartaoService cartaoService) {
        this.conta_BancariaService = conta_BancariaService;
        this.passwordEncoder = passwordEncoder;
        this.cartaoService = cartaoService;

    }

    @Autowired
    private SecretKeySpec aesKey;

    @Autowired
    private IvParameterSpec aesIv;

    @GetMapping("/dados")
    public AccountInfoDTO getDados() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {
            var conta = conta_BancariaService.buscarConta(usuario.getId());
            return new AccountInfoDTO(conta.getSaldo(), conta.getNumeroConta(), conta.getAgencia());
        }

        return null;
    }

    @PostMapping("/depositar")
    public ResponseEntity<?> depositar(@RequestBody ValorDTO valor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {
            conta_BancariaService.depositar(usuario.getId(), valor.valor());
            var conta = conta_BancariaService.buscarConta(usuario.getId());
            return ResponseEntity.ok(new AccountInfoDTO(conta.getSaldo(), conta.getNumeroConta(), conta.getAgencia()));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/sacar")
    public ResponseEntity<?> sacar(@RequestBody ValorDTO valor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {
            conta_BancariaService.sacar(usuario.getId(), valor.valor());
            var conta = conta_BancariaService.buscarConta(usuario.getId());
            return ResponseEntity.ok(new AccountInfoDTO(conta.getSaldo(), conta.getNumeroConta(), conta.getAgencia()));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/transferir")
    public ResponseEntity<?> transferir(@RequestBody TransferirDTO transferirDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {

//            if(Objects.equals(transferirDTO.chave(), usuario.getCpf()) || Objects.equals(transferirDTO.chave(), usuario.getEmail())){
//                return ResponseEntity.badRequest().body("Você não pode transferir para você mesmo");
//            }

            var contaUsuario = conta_BancariaService.buscarConta(usuario.getId());
            var contaUsuarioId = contaUsuario.getId();
            var cartaoUsuario = cartaoService.buscarPorUsuario(contaUsuarioId);

//            if (transferirDTO.tipoChave() == null) {
//                return ResponseEntity.badRequest().body("Tipo de chave não pode ser nulo");
//            }

            try {
                String decryptedPassword = AESUtil.decrypt(transferirDTO.senha(), aesKey, aesIv);
                if (decryptedPassword != null && !passwordEncoder.matches(decryptedPassword, cartaoUsuario.getSenha())) {
                    return ResponseEntity.badRequest().body("Senha inválida");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("O campo senha não está codificado em Base64");
            }





            conta_BancariaService.transferir(usuario.getId(), transferirDTO);
            var conta = conta_BancariaService.buscarConta(usuario.getId());
            return ResponseEntity.ok(new AccountInfoDTO(conta.getSaldo(), conta.getNumeroConta(), conta.getAgencia()));
        }
        return ResponseEntity.badRequest().build();
    }


}
