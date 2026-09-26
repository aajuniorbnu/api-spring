package com.superdev.helpdesk.service;
import com.superdev.helpdesk.models.*;
import com.superdev.helpdesk.repositories.*;
import com.superdev.helpdesk.dtos.chamado.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class ChamadoService {
    private final ChamadoRepository repository;
    private final CategoriaRepository categorias;
    private final UsuarioRepository usuarios;
    public List<Chamado> listar() { return repository.findAll(); }
    public Chamado obterPorId(int id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chamado não encontrado"));
    }
    public Chamado apagar(int id) {
        var item = obterPorId(id);
        item.setAtivo(false);
        return repository.save(item);
    }
    public Chamado criar(ChamadoCriarDto dado) {
        var item = new Chamado();
        var categoria = categorias.findById(dado.categoriaId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrado"));
        var solicitante = usuarios.findById(dado.solicitanteId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario não encontrado"));
        item.setTitulo(dado.titulo());
        item.setDescricao(dado.descricao());
        item.setPrioridade(dado.prioridade());
        item.setStatus(dado.status());
        item.setPrazo(dado.prazo());
        item.setCategoria(categoria);
        item.setSolicitante(solicitante);
        return repository.save(item);
    }
    public Chamado atualizar(int id, ChamadoAtualizarDto dado) {
        var item = obterPorId(id);
        var categoria = categorias.findById(dado.categoriaId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrado"));
        var solicitante = usuarios.findById(dado.solicitanteId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario não encontrado"));
        item.setTitulo(dado.titulo());
        item.setDescricao(dado.descricao());
        item.setPrioridade(dado.prioridade());
        item.setStatus(dado.status());
        item.setPrazo(dado.prazo());
        item.setCategoria(categoria);
        item.setSolicitante(solicitante);
        return repository.save(item);
    }
}
