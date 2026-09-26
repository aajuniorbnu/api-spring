package com.superdev.helpdesk.dtos.ticket;

import com.superdev.helpdesk.enums.Prioridade;
import com.superdev.helpdesk.enums.StatusTicket;
import com.superdev.helpdesk.models.Usuario;

import java.time.LocalDateTime;

public record TicketRespostaDto(
        Integer id,
        String titulo,
        String descricao,
        StatusTicket status,
        Prioridade prioridade,
        Usuario solicitante,
        Usuario atendente,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {

}
