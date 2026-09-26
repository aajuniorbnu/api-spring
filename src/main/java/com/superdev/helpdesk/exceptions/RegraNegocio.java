package com.superdev.helpdesk.exceptions;

import org.springframework.http.HttpStatus;

public class RegraNegocio extends ErroAplicacao {
    public RegraNegocio(String mensagem) {
        super(HttpStatus.UNPROCESSABLE_CONTENT, "regra_negocio", mensagem);
    }
}
