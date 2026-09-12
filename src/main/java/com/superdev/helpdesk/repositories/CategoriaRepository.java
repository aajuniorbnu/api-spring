package com.superdev.helpdesk.repositories;

import com.superdev.helpdesk.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

}
