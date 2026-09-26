package com.superdev.helpdesk.service;

import com.superdev.helpdesk.dtos.usuario.UsuarioAtualizarDto;
import com.superdev.helpdesk.dtos.usuario.UsuarioCriarDto;
import com.superdev.helpdesk.exceptions.ConnflitoException;
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
        String email = dado.email().trim().toLowerCase();
        //Validar que existe usuario com o email
        repository.findByEmail(email).ifPresent(usuario -> {
           //Caso existir nao deve permitir cadastrar outro usuario com o mesmo erro
           //Vamos lançar uma excecao que status code 409
           throw new ConnflitoException("Ë-mail já cadastrado");
        });

        var usuario = Usuario.builder()
                .nome(dado.nome())
                .email(dado.email())
                .papel(dado.papel())
                .ativo(true)
                .build();
        return repository.save(usuario);
    }

    public Usuario atualizar(int id, UsuarioAtualizarDto dado) {
        var usuario = repository.findById(id)
                        .orElseThrow();
        usuario.setNome(dado.nome());
        usuario.setEmail(dado.email());
        usuario.setPapel(dado.papel());
        return repository.save(usuario);
    }

    public Usuario apagar(int id) {
        var usuario = obterPorId(id);
        usuario.setAtivo(false);
        return repository.save(usuario);
    }
}
