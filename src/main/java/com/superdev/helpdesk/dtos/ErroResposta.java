package com.superdev.helpdesk.dtos;

import com.superdev.helpdesk.exceptions.ErroAplicacao;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record ErroResposta(
        @Schema(example = "nao_encontrado")
        String codigo,

        @Schema(example = "Categoria nao encontrado")
        String mensagem,
        List<?> detalhes
) {
}
