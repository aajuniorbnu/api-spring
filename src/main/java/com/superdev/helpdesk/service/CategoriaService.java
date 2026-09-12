package com.superdev.helpdesk.service;

import com.superdev.helpdesk.dtos.categoria.CategoriaAtualizarDto;
import com.superdev.helpdesk.dtos.categoria.CategoriaCriarDto;
import com.superdev.helpdesk.models.Categoria;
import com.superdev.helpdesk.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service

public class CategoriaService {
    private final CategoriaRepository repository;
    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }
    public List<Categoria> listar() {
        return this.repository.findAll();
    }

    public Categoria criar(CategoriaCriarDto dado){
       var categoria =  Categoria.builder()
        .nome(dado.nome())
                .descricao(dado.descricao())
               .ativa(true)
                        .build();
        return this.repository.save(categoria);
        //delete fisico
        //DELETE FROM categorias WHERE id =?
        //delete logico
        //UPDATE categorias SET ativo = false WHERE id =?
    }
    public Categoria atualizar( int id ,CategoriaAtualizarDto dado){
        var categoria = repository.findById(id)
        .orElseThrow();
        categoria.setNome(dado.nome());
        categoria.setDescricao(dado.descricao());
        return repository.save(categoria);

    }
    public Categoria apagar(int id){
        var categoria = repository.findById(id).orElseThrow();
        categoria.setAtiva(false);
        return repository.save(categoria);
    }
    public Categoria obterPorId(int id){
        var categoria = repository.findById(id).orElseThrow();
        return categoria;
    }

    }
