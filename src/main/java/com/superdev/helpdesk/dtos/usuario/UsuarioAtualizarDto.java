package com.superdev.helpdesk.dtos.usuario;

import com.superdev.helpdesk.enums.Papel;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioAtualizarDto(
        @Schema(description = "DEfine o nome do usuário", example = "Ana da Silva ")
        @NotBlank @Size(min = 2, max = 100)
        String nome,

        @Schema(description = "Define o e-mail do usuário", example = "ana@tickets.com.br")
        @NotBlank @Email @Size(max = 255)
        String email,

        @Schema(description = "Define o papel do usuario como: SOLICITANTE ou ATENDENTE", example = "SOLICITANTE")
        Papel papel
) {
}
