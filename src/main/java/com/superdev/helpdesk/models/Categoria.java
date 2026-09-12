package com.superdev.helpdesk.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@Table(name = "categorias")
@AllArgsConstructor
@Entity
@NoArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 60,nullable = false, unique = true)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(nullable = false)
    private Boolean ativa;

    @Column(name = "criado_em",nullable = false, updatable = false)
    private LocalDateTime criadoEm ;

    //Executado pelo JPA antes do INSERT; preenche os valores padores
    @PrePersist
    public void aoCriar() {
        if (criadoEm == null)
        criadoEm = LocalDateTime.now();
    }
}

