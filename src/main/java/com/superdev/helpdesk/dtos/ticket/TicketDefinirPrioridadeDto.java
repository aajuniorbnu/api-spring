package com.superdev.helpdesk.dtos.ticket;

import com.superdev.helpdesk.enums.Prioridade;
import io.swagger.v3.oas.annotations.media.Schema;

public record TicketDefinirPrioridadeDto (
    @Schema(description = "Prioridade do ticket definida como: BAIXA / MEDIA /ALTA")
    Prioridade prioridade
){
}
