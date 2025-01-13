package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Role;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final UsuarioRepository usuarioRepository;

    public Usuario addRoleToUsuario(UUID usuarioId, Role role) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(usuarioId);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            usuario.getRoles().add(role);
            return usuarioRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado!");
    }

    public Usuario createUsuarioWithRole(Usuario usuario, Role role) {
        usuario.getRoles().add(role);
        return usuarioRepository.save(usuario);
    }

}
