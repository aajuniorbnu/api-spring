package com.superdev.helpdesk.repositories;

import com.superdev.helpdesk.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
}
