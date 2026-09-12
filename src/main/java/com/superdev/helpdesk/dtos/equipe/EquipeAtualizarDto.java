package com.superdev.helpdesk.dtos.equipe;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record EquipeAtualizarDto(
    @NotBlank @Size(min=2, max=60) String nome,
    @Size(max=255) String descricao,
    @NotBlank @Email @Size(max=255) String email,
    @NotBlank @Size(max=30) String telefone,
    @NotBlank @Size(max=100) String especialidade,
    @NotBlank @Size(max=100) String horarioAtendimento
) {}
