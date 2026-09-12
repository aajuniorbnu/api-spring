package com.superdev.helpdesk.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name="equipes")
public class Equipe {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false, length=60)
    private String nome;
    @Column(length=255)
    private String descricao;
    @Column(nullable=false, length=255)
    private String email;
    @Column(nullable=false, length=30)
    private String telefone;
    @Column(nullable=false, length=100)
    private String especialidade;
    @Column(nullable=false, length=100)
    private String horarioAtendimento;
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
