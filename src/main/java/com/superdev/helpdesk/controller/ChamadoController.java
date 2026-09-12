package com.superdev.helpdesk.controller;
import com.superdev.helpdesk.models.Chamado;
import com.superdev.helpdesk.service.ChamadoService;
import com.superdev.helpdesk.dtos.chamado.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
@RestController @RequestMapping("/chamados") @RequiredArgsConstructor
public class ChamadoController {
    private final ChamadoService service;
    @GetMapping public List<Chamado> listar() { return service.listar(); }
    @GetMapping("/{id}") public Chamado obterPorId(@PathVariable int id) { return service.obterPorId(id); }
    @PostMapping public Chamado criar(@RequestBody @Valid ChamadoCriarDto dto) { return service.criar(dto); }
    @PutMapping("/{id}") public Chamado atualizar(@PathVariable int id, @RequestBody @Valid ChamadoAtualizarDto dto) { return service.atualizar(id, dto); }
    @DeleteMapping("/{id}") public Chamado apagar(@PathVariable int id) { return service.apagar(id); }
}
