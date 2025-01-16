package com.nuhcorre.chupebankbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {

    @Id
    private UUID id;

    @Column(name = "nome")
    @NotEmpty
    private String nome;

    @Column(name = "email", unique = true, nullable = false)
    @NotEmpty
    private String email;

    @Column(name = "senha")
    @NotEmpty
    private String senha;

    @Column(name = "cpf", unique = true, nullable = true)
    @NotEmpty
    private String cpf;

    @Column(name = "telefone", unique = true, nullable = false)
    @NotEmpty
    private String telefone;

    @CreationTimestamp
    @Column(name = "data_criacao")
    private Date dataCriacao;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinTable(
            name = "usuarios_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles = new ArrayList<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> (GrantedAuthority) () -> "ROLE_" + role.getNome().toUpperCase())
                .toList();
    }


    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}