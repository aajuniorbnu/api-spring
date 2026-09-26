package com.superdev.helpdesk.models;

import com.superdev.helpdesk.enums.Prioridade;
import com.superdev.helpdesk.enums.Setor;
import com.superdev.helpdesk.enums.StatusTicket;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(length = 120, nullable = false)
    private String titulo;

    @Column(name ="numero_protocolo",length = 20, nullable = false, unique = true)
    private String numeroProtocolo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @Column( name = "descricao_solucao",columnDefinition = "TEXT", nullable = true)
    private String descricaoSolucao;

    @Enumerated(EnumType.STRING)
    @Column( name = "status_ticket", length = 20, nullable = false)
    private StatusTicket status;
    //prioridade será definada em outro momento
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = true)
    private Prioridade prioridade;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Setor setor ;

    @Column(name = "motivo_cancelamento",columnDefinition = "TEXT", nullable = true)
    private String motivoCancelamento;

   @Column(name = "data_criacao", nullable = false,updatable = false)
   private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao", nullable = true)
    private LocalDateTime dataAtualizacao;

    @ManyToOne
    @JoinColumn(name= "atendente_id")
    private Usuario atendente;

    @ManyToOne
    @JoinColumn(name= "solicitante_id", nullable = true)
    private Usuario solicitante;

    @PrePersist
    void aoCriar() {
        LocalDateTime agora = LocalDateTime.now();
        if(dataCriacao == null)
            dataCriacao = agora;
    }
    @PreUpdate
    void aoAtualizar() {
        dataAtualizacao = LocalDateTime.now();
    }
}
