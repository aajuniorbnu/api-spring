package com.superdev.helpdesk.dtos.chamado;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record ChamadoCriarDto(
    @NotBlank @Size(min=2, max=100) String titulo,
    @NotBlank @Size(max=2000) String descricao,
    @NotBlank @Pattern(regexp="BAIXA|MEDIA|ALTA|URGENTE") String prioridade,
    @NotBlank @Pattern(regexp="ABERTO|EM_ANDAMENTO|RESOLVIDO|FECHADO") String status,
    @NotNull LocalDate prazo,
    @NotNull @Positive Integer categoriaId,
    @NotNull @Positive Integer solicitanteId,
    @NotNull @Positive Integer equipeId
) {}
