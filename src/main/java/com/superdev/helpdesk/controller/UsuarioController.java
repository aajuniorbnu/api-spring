package com.superdev.helpdesk.controller;

import com.superdev.helpdesk.dtos.usuario.UsuarioAtualizarDto;
import com.superdev.helpdesk.dtos.usuario.UsuarioCriarDto;
import com.superdev.helpdesk.models.Usuario;
import com.superdev.helpdesk.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Usuario obterPorId(@PathVariable int id) {
        return service.obterPorId(id);
    }

    @PostMapping
    public Usuario criar(@RequestBody @Valid UsuarioCriarDto dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@PathVariable int id, @RequestBody @Valid UsuarioAtualizarDto dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public Usuario apagar(@PathVariable int id) {
        return service.apagar(id);
    }
}
