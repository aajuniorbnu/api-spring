package com.superdev.helpdesk.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name="chamados")
public class Chamado {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false, length=100)
    private String titulo;
    @Column(nullable=false, length=2000)
    private String descricao;
    @Column(nullable=false, length=10)
    private String prioridade;
    @Column(nullable=false, length=20)
    private String status;
    @Column(nullable=false)
    private LocalDate prazo;
    @ManyToOne(optional=false) @JoinColumn(name="categoria_id", nullable=false)
    private Categoria categoria;
    @ManyToOne(optional=false) @JoinColumn(name="solicitante_id", nullable=false)
    private Usuario solicitante;
    @ManyToOne(optional=false) @JoinColumn(name="equipe_id", nullable=false)
    private Equipe equipe;
    @Column(nullable=false)
    private Boolean ativo;
    @Column(nullable=false, updatable=false)
    private LocalDateTime criadoEm;
    @PrePersist
    public void aoCriar() {
        if (ativo == null) ativo = true;
        if (criadoEm == null) criadoEm = LocalDateTime.now();
    }
}
