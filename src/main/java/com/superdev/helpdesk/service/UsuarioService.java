package com.superdev.helpdesk.service;

import com.superdev.helpdesk.dtos.usuario.UsuarioAtualizarDto;
import com.superdev.helpdesk.dtos.usuario.UsuarioCriarDto;
import com.superdev.helpdesk.models.Usuario;
import com.superdev.helpdesk.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }

    public Usuario obterPorId(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }

    public Usuario criar(UsuarioCriarDto dado) {
        var usuario = Usuario.builder()
                .nome(dado.nome())
                .email(dado.email())
                .ativo(true)
                .build();
        return repository.save(usuario);
    }

    public Usuario atualizar(int id, UsuarioAtualizarDto dado) {
        var usuario = obterPorId(id);
        usuario.setNome(dado.nome());
        usuario.setEmail(dado.email());
        return repository.save(usuario);
    }

    public Usuario apagar(int id) {
        var usuario = obterPorId(id);
        usuario.setAtivo(false);
        return repository.save(usuario);
    }
}
