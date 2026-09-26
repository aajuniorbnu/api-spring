package com.superdev.helpdesk.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.MediaType;
import tools.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.UUID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TrabalhoIntegracaoTests {
    @Autowired MockMvc mvc;
    private final ObjectMapper json = new ObjectMapper();

    private int criar(String recurso, Map<String, Object> dados) throws Exception {
        var resposta = mvc.perform(post(recurso).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(dados))).andExpect(status().isOk()).andReturn();
        return json.readTree(resposta.getResponse().getContentAsString()).get("id").asInt();
    }

    @Test
    void crudDasTresTabelasComRelacionamentosEExclusaoLogica() throws Exception {
        var categoria = Map.<String,Object>of("nome", "Teste " + UUID.randomUUID(), "descricao", "Suporte");
        int categoriaId = criar("/categorias", categoria);
        var usuario = Map.<String,Object>of("nome", "Pessoa Teste", "email", "teste@example.com", "papel", "SOLICITANTE");
        int usuarioId = criar("/usuarios", usuario);
        var chamado = Map.<String,Object>of("titulo", "Sem conexão", "descricao", "Não conecta à rede", "prioridade", "ALTA", "status", "ABERTO", "prazo", "2026-12-20", "categoriaId", categoriaId, "solicitanteId", usuarioId);
        int chamadoId = criar("/chamados", chamado);
        mvc.perform(get("/chamados/" + chamadoId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.categoria.id").value(categoriaId))
                .andExpect(jsonPath("$.solicitante.id").value(usuarioId));
        var registros = Map.of("/categorias", categoriaId, "/usuarios", usuarioId, "/chamados", chamadoId);
        var dados = Map.of("/categorias", categoria, "/usuarios", usuario, "/chamados", chamado);
        for (var entry : registros.entrySet()) {
            String recurso = entry.getKey();
            String rota = recurso + "/" + entry.getValue();
            mvc.perform(get(recurso)).andExpect(status().isOk());
            var atualizado = new java.util.HashMap<>(dados.get(recurso));
            String campo = recurso.equals("/chamados") ? "titulo" : "nome";
            atualizado.put(campo, "Editado " + UUID.randomUUID());
            mvc.perform(put(rota).contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(atualizado)))
                    .andExpect(status().isOk()).andExpect(jsonPath("$." + campo).value(atualizado.get(campo)));
            mvc.perform(delete(rota)).andExpect(status().isOk());
            mvc.perform(get(rota)).andExpect(status().isOk())
                    .andExpect(jsonPath(recurso.equals("/categorias") ? "$.ativa" : "$.ativo").value(false));
        }
    }

    @Test
    void rejeitarDadosInvalidosERecursosInexistentes() throws Exception {
        for (String recurso : new String[]{"/categorias", "/usuarios", "/chamados"}) {
            mvc.perform(post(recurso).contentType(MediaType.APPLICATION_JSON).content("{}"))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.erros").isArray());
            mvc.perform(get(recurso + "/2147483647")).andExpect(status().isNotFound());
            mvc.perform(delete(recurso + "/2147483647")).andExpect(status().isNotFound());
        }
        mvc.perform(post("/usuarios").contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Ana\" \"email\":\"a@example.com\"}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").exists());
        mvc.perform(post("/chamados").contentType(MediaType.APPLICATION_JSON).content("""
            {"titulo":"Teste", "descricao":"Teste", "prioridade":"ALTA", "status":"ABERTO", "prazo":"2026-12-20", "categoriaId":2147483647, "solicitanteId":2147483647}
            """)).andExpect(status().isNotFound());
    }
}
