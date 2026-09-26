package com.superdev.helpdesk.exceptions;

import org.springframework.http.HttpStatus;

public class ConnflitoException extends ErroAplicacao {
    public ConnflitoException(String mensagem) {
        super(HttpStatus.CONFLICT, "conflito", mensagem);;
    }

}
