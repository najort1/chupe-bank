package com.nuhcorre.chupebankbackend.controller;

import com.nuhcorre.chupebankbackend.DTO.responses.ExtratoResponseDTO;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.service.ExtratoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/extrato")
public class ExtratoController {

    public final ExtratoService extratoService;

    public ExtratoController(ExtratoService extratoService) {
        this.extratoService = extratoService;
    }

    private Usuario obterUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        return (principal instanceof Usuario) ? (Usuario) principal : null;
    }

    @GetMapping("/listar")
    public ResponseEntity<Page<?>> listarExtrato(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "10") int itens,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String valorOrdem,
            @RequestParam(required = false) String dataOrdem
    ) {
        Usuario usuarioAutenticado = obterUsuarioAutenticado();
        if (usuarioAutenticado != null) {
            Sort sort = Sort.unsorted();

            if (valorOrdem != null) {
                if (valorOrdem.equalsIgnoreCase("asc")) {
                    sort = Sort.by(Sort.Order.asc("valor"));
                } else if (valorOrdem.equalsIgnoreCase("desc")) {
                    sort = Sort.by(Sort.Order.desc("valor"));
                }
            }

            if (dataOrdem != null) {
                if (dataOrdem.equalsIgnoreCase("asc")) {
                    sort = Sort.by(Sort.Order.asc("dataHora"));
                } else if (dataOrdem.equalsIgnoreCase("desc")) {
                    sort = Sort.by(Sort.Order.desc("dataHora"));
                }
            }

            Pageable pageable = PageRequest.of(pagina, itens, sort);
            Page<ExtratoResponseDTO> extrato = extratoService.buscarPorUsuario(usuarioAutenticado.getId(), pageable, tipo);
            return ResponseEntity.ok(extrato);
        }
        return ResponseEntity.status(401).body(Page.empty());
    }

}