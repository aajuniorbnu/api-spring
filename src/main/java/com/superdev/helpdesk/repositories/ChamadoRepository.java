package com.superdev.helpdesk.repositories;
import com.superdev.helpdesk.models.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ChamadoRepository extends JpaRepository<Chamado, Integer> {}
