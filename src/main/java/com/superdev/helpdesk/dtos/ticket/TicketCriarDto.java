package com.superdev.helpdesk.dtos.ticket;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.superdev.helpdesk.enums.Setor;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.SchemaProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TicketCriarDto(
        @Schema(example = "Nao consigo acessar a VPN")
        @NotBlank
        @Size(min = 5, max = 120)
        String titulo,
        @Schema(example = "Desde ontem a VPN retorna erro de autenticaçao ao conectar de casa.")
        @NotBlank
        @Size(min = 10, max = 5000)
        String descricao,
        @Schema(description = "Define o setor: TI/ RH / FINANCEIRO / ADMINISTRATIVO / MANUTENCAO", example = "TI")
        Setor setor,
        @Schema(description = "Id do usuario que abre o ticket", example = "1")
        @JsonProperty("solicitante_id")
        Integer solicitanteId

) {
}
