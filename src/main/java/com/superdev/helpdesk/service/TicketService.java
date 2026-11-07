package com.superdev.helpdesk.service;

import com.superdev.helpdesk.dtos.ticket.*;
import com.superdev.helpdesk.enums.Papel;
import com.superdev.helpdesk.enums.StatusTicket;
import com.superdev.helpdesk.exceptions.RegraNegocio;
import com.superdev.helpdesk.models.Ticket;
import com.superdev.helpdesk.models.Usuario;
import com.superdev.helpdesk.repositories.TicketRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {
    private final TicketRepository repository;
    private final UsuarioService usuarioService;

    public TicketService(TicketRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    public List<Ticket> listar() {
        return repository.findAll();
    }

    private String gerarNumeroProtocolo(Ticket ticket) {
        String dataCriacao = ticket.getDataCriacao().format(DateTimeFormatter.BASIC_ISO_DATE);//ANOMESDIA
        String numero = String.format("%05d", ticket.getId());
        return dataCriacao + "_" + numero;
    }

    public Ticket criar(TicketCriarDto dado) {
        Usuario usuario = usuarioService.obterPorId(dado.solicitanteId());
        if (usuario.getPapel() != Papel.SOLICITANTE) {
            throw new RegraNegocio("Tickets podem ser aberto somente por usuários com papel de 'SOLICITANTE'");
        }

        String numeroProtocoloFake = UUID.randomUUID().toString().substring(0, 20);

        Ticket ticket = Ticket.builder()
                .titulo(dado.titulo())
                .descricao(dado.descricao())
                .setor(dado.setor())
                .solicitante(usuario)
                .status(StatusTicket.ABERTO)
                .numeroProtocolo(numeroProtocoloFake)
                .build();
        //executa o INSERT agota, ainda dentro da transaçao(sem commit). o banco gera o valor da coluna IDENTITY e
        //o Hibernate preenche o ticket.getId()
        repository.saveAndFlush(ticket);

        //com id e data é possivel gerar o numero do protocolo
        String numeroProtocolo = gerarNumeroProtocolo(ticket);
        ticket.setNumeroProtocolo(numeroProtocolo);
        return repository.save(ticket);
    }

    public Ticket associar(int id, TicketAssociarDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();
        Usuario usuario = usuarioService.obterPorId(dado.usuarioId());
        if (ticket.getStatus() != StatusTicket.ABERTO) {
            throw new RegraNegocio("Tickets podem ser associados somente com status de 'ABERTO'");
        }
        if (usuario.getPapel() != Papel.ATENDENTE) {
            throw new RegraNegocio("Tickets podem ser associados somente com papel de 'ATENDENTE'");
        }

        ticket.setAtendente(usuario);
        ticket.setStatus(StatusTicket.EM_ANALISE);
        return repository.save(ticket);
    }

    public Ticket cancelar(int id, TicketCancelarDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();
        if (ticket.getStatus() == StatusTicket.CANCELADO) {
            throw new RegraNegocio("tickets nao podem ser cancelados quando ja estao cancelado");
        } else if (ticket.getStatus() == StatusTicket.RESOLVIDO) {
            throw new RegraNegocio("Tickets nao podem ser cancelados quando ja esta resolvido");
        }
      ticket.setStatus(StatusTicket.CANCELADO);
        ticket.setMotivoCancelamento(dado.motivoCancelamento());
        return repository.save(ticket);
    }

    public Ticket resolver(int id, TicketResolverDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();
        if (ticket.getStatus() != StatusTicket.EM_ANALISE) {
            throw new RegraNegocio("Ticket nao pode ser resolvido quando nao tiver em analise");
        }
        ticket.setDescricaoSolucao(dado.descricaoSolucao());
        ticket.setStatus(StatusTicket.RESOLVIDO);
        return repository.save(ticket);
    }

    public Ticket definirPrioridade(int id, @Valid TicketDefinirPrioridadeDto dado) {
        Ticket ticket = repository.findById(id).orElseThrow();

        if (ticket.getStatus() != StatusTicket.EM_ANALISE) {
            throw new RegraNegocio("Nao é possivel definir prioridade de ticket, quando ja esta em analise");
        }
        ticket.setPrioridade(dado.prioridade());
        return repository.save(ticket);
    }
}