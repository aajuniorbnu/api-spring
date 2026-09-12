package com.superdev.helpdesk.controller;
import com.superdev.helpdesk.models.Equipe;
import com.superdev.helpdesk.service.EquipeService;
import com.superdev.helpdesk.dtos.equipe.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
@RestController @RequestMapping("/equipes") @RequiredArgsConstructor
public class EquipeController {
    private final EquipeService service;
    @GetMapping public List<Equipe> listar() { return service.listar(); }
    @GetMapping("/{id}") public Equipe obterPorId(@PathVariable int id) { return service.obterPorId(id); }
    @PostMapping public Equipe criar(@RequestBody @Valid EquipeCriarDto dto) { return service.criar(dto); }
    @PutMapping("/{id}") public Equipe atualizar(@PathVariable int id, @RequestBody @Valid EquipeAtualizarDto dto) { return service.atualizar(id, dto); }
    @DeleteMapping("/{id}") public Equipe apagar(@PathVariable int id) { return service.apagar(id); }
}
