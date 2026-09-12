package com.superdev.helpdesk.controller;

import com.superdev.helpdesk.models.Usuario;
import com.superdev.helpdesk.repositories.UsuarioRepository;
import com.superdev.helpdesk.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UsuarioControllerTests {
    private MockMvc mvc;
    private UsuarioRepository repository;
    private Map<Integer, Usuario> usuarios;

    @BeforeEach
    void configurar() {
        usuarios = new LinkedHashMap<>();
        repository = mock(UsuarioRepository.class);
        when(repository.findAll()).thenAnswer(invocation -> List.copyOf(usuarios.values()));
        when(repository.findById(anyInt())).thenAnswer(invocation -> Optional.ofNullable(usuarios.get(invocation.getArgument(0))));
        when(repository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            if (usuario.getId() == null) {
                usuario.aoCriar();
                usuario.setId(usuarios.size() + 1);
            }
            usuarios.put(usuario.getId(), usuario);
            return usuario;
        });
        mvc = MockMvcBuilders.standaloneSetup(new UsuarioController(new UsuarioService(repository))).build();
    }

    @Test
    void executarCrudPreservandoDataEExclusaoLogica() throws Exception {
        mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON)
                        .content("""
{"nome":"Ana Silva","email":"ana@example.com"}
"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.ativo").value(true))
                .andExpect(jsonPath("$.criadoEm").exists());
        var criadoEm = usuarios.get(1).getCriadoEm();
        mvc.perform(get("/usuarios")).andExpect(status().isOk()).andExpect(jsonPath("$[0].nome").value("Ana Silva"));
        mvc.perform(get("/usuarios/1")).andExpect(status().isOk()).andExpect(jsonPath("$.email").value("ana@example.com"));
        mvc.perform(put("/usuarios/1").contentType(MediaType.APPLICATION_JSON)
                        .content("""
{"nome":"Ana Souza","email":"souza@example.com"}
"""))
                .andExpect(status().isOk()).andExpect(jsonPath("$.nome").value("Ana Souza"))
                .andExpect(jsonPath("$.email").value("souza@example.com"));
        assertEquals(criadoEm, usuarios.get(1).getCriadoEm());
        mvc.perform(delete("/usuarios/1")).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(false));
        mvc.perform(get("/usuarios/1")).andExpect(status().isOk()).andExpect(jsonPath("$.ativo").value(false));
        assertEquals(1, usuarios.size());
        verify(repository, never()).delete(any());
        verify(repository, never()).deleteById(anyInt());
    }

    @Test
    void rejeitarDadosInvalidosNaCriacaoEAtualizacao() throws Exception {
        for (String dados : List.of(
                """
{"nome":"","email":"ana@example.com"}
""",
                """
{"nome":"Ana","email":"invalido"}
""",
                """
{"nome":"Ana","email":""}
""",
                "{}")) {
            mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content(dados)).andExpect(status().isBadRequest());
            mvc.perform(put("/usuarios/1").contentType(MediaType.APPLICATION_JSON).content(dados)).andExpect(status().isBadRequest());
        }
        verify(repository, never()).save(any());
    }

    @Test
    void retornar404ParaUsuarioInexistente() throws Exception {
        mvc.perform(get("/usuarios/99")).andExpect(status().isNotFound());
        mvc.perform(delete("/usuarios/99")).andExpect(status().isNotFound());
        mvc.perform(put("/usuarios/99").contentType(MediaType.APPLICATION_JSON)
                        .content("""
{"nome":"Ana Silva","email":"ana@example.com"}
"""))
                .andExpect(status().isNotFound());
        verify(repository, never()).save(any());
    }
}
