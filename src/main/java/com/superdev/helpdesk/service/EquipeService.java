package com.superdev.helpdesk.service;
import com.superdev.helpdesk.models.*;
import com.superdev.helpdesk.repositories.*;
import com.superdev.helpdesk.dtos.equipe.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.RequiredArgsConstructor;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional
public class EquipeService {
    private final EquipeRepository repository;
    public List<Equipe> listar() { return repository.findAll(); }
    public Equipe obterPorId(int id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipe não encontrado"));
    }
    public Equipe apagar(int id) {
        var item = obterPorId(id);
        item.setAtivo(false);
        return repository.save(item);
    }
    public Equipe criar(EquipeCriarDto dado) {
        var item = new Equipe();
        item.setNome(dado.nome());
        item.setDescricao(dado.descricao());
        item.setEmail(dado.email());
        item.setTelefone(dado.telefone());
        item.setEspecialidade(dado.especialidade());
        item.setHorarioAtendimento(dado.horarioAtendimento());
        return repository.save(item);
    }
    public Equipe atualizar(int id, EquipeAtualizarDto dado) {
        var item = obterPorId(id);
        item.setNome(dado.nome());
        item.setDescricao(dado.descricao());
        item.setEmail(dado.email());
        item.setTelefone(dado.telefone());
        item.setEspecialidade(dado.especialidade());
        item.setHorarioAtendimento(dado.horarioAtendimento());
        return repository.save(item);
    }
}
