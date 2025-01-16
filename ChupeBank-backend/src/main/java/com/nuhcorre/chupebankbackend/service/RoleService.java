package com.nuhcorre.chupebankbackend.service;

import com.nuhcorre.chupebankbackend.model.Role;
import com.nuhcorre.chupebankbackend.model.Usuario;
import com.nuhcorre.chupebankbackend.repository.RoleRepository;
import com.nuhcorre.chupebankbackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;

    public Usuario addRoleToUsuario(UUID usuarioId, Role role) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(usuarioId);
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            Optional<Role> existingRole = roleRepository.findByNome(role.getNome());
            if (existingRole.isPresent()) {
                Role foundRole = existingRole.get();
                if (!usuario.getRoles().contains(foundRole)) {
                    usuario.getRoles().add(foundRole);
                }
            } else {
                usuario.getRoles().add(role);
            }
            return usuarioRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado!");
    }

    public Usuario createUsuarioWithRole(Usuario usuario, Role role) {
        usuario.getRoles().add(role);
        return usuarioRepository.save(usuario);
    }

    public Optional<Role> findByNome(String nome) {
        return roleRepository.findByNome(nome);
    }

    public Role save(Role role) {
        return roleRepository.save(role);
    }

}
