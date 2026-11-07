package com.superdev.helpdesk.service;

import com.superdev.helpdesk.dtos.ticket.*;
import com.superdev.helpdesk.enums.*;
import com.superdev.helpdesk.models.*;
import com.superdev.helpdesk.repositories.TicketRepository;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TicketServiceTests {
    private final TicketRepository repository = mock(TicketRepository.class);
    private final UsuarioService usuarios = mock(UsuarioService.class);
    private final TicketService service = new TicketService(repository, usuarios);

    @Test
    void persistirProtocoloDefinitivoDepoisDeGerarId() {
        when(usuarios.obterPorId(1)).thenReturn(Usuario.builder().id(1).papel(Papel.SOLICITANTE).build());
        when(repository.saveAndFlush(any(Ticket.class))).thenAnswer(call -> {
            Ticket ticket = call.getArgument(0);
            ticket.setId(42);
            ticket.setDataCriacao(LocalDateTime.of(2026, 11, 7, 9, 0));
            return ticket;
        });
        when(repository.save(any(Ticket.class))).thenAnswer(call -> call.getArgument(0));
        Ticket ticket = service.criar(new TicketCriarDto("Falha de acesso", "Não consigo acessar o sistema", Setor.TI, 1));
        assertEquals("20261107_00042", ticket.getNumeroProtocolo());
        verify(repository).save(ticket);
    }

    @Test
    void resolverSalvaSolucaoEEncerraTicket() {
        Ticket ticket = Ticket.builder().id(42).status(StatusTicket.EM_ANALISE).build();
        when(repository.findById(42)).thenReturn(Optional.of(ticket));
        when(repository.save(ticket)).thenReturn(ticket);
        service.resolver(42, new TicketResolverDto("Acesso ao sistema restaurado"));
        assertEquals(StatusTicket.RESOLVIDO, ticket.getStatus());
        assertEquals("Acesso ao sistema restaurado", ticket.getDescricaoSolucao());
        verify(repository).save(ticket);
    }

    @Test
    void naoResolverTicketAberto() {
        when(repository.findById(42)).thenReturn(Optional.of(Ticket.builder().status(StatusTicket.ABERTO).build()));
        assertThrows(RuntimeException.class, () -> service.resolver(42, new TicketResolverDto("Acesso ao sistema restaurado")));
        verify(repository, never()).save(any());
    }
}
