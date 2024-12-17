package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.TransferirDTO;
import com.nuhcorre.chupebankbackend.DTO.ValorDTO;
import com.nuhcorre.chupebankbackend.DTO.responses.AccountInfoDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.Conta_BancariaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    private final Conta_BancariaService conta_BancariaService;

    public BankController(Conta_BancariaService conta_BancariaService) {
        this.conta_BancariaService = conta_BancariaService;
    }

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
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/sacar")
    public ResponseEntity<?> sacar(@RequestBody ValorDTO valor) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {
            conta_BancariaService.sacar(usuario.getId(), valor.valor());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/transferir")
    public ResponseEntity<?> transferir(@RequestBody TransferirDTO transferirDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof Usuario usuario) {

            if(Objects.equals(transferirDTO.chave(), usuario.getCpf()) || Objects.equals(transferirDTO.chave(), usuario.getEmail())){
                return ResponseEntity.badRequest().body("Você não pode transferir para você mesmo");
            }

            conta_BancariaService.transferir(usuario.getId(), transferirDTO);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }


}
