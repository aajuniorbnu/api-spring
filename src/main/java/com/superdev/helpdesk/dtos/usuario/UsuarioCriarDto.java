package com.superdev.helpdesk.dtos.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioCriarDto(
        @NotBlank @Size(min = 2, max = 60)
        String nome,

        @NotBlank @Email @Size(max = 255)
        String email,

        @Size(max = 30) String telefone,
        @Size(max = 60) String cargo
) {
}
