package com.superdev.helpdesk.exceptions;
//base de excecoes de dominio. os servicos lançam  estas excecoes sem saber
//nada de http; o tratadorDeErros traduz cada um para um status+ corpo padrao

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ErroAplicacao extends RuntimeException {
    //atributos protegidos com final para nao permitir a mudança
    //com getter(que permite somente a leitura) sem Setter + final
    private final HttpStatus status;
    private final String codigo;

    //constructor
    protected ErroAplicacao(HttpStatus status, String codigo, String mmensagem) {
        //passando para o construtor da classe Pai(RunTImeException) a mesnsagem
        super(mmensagem);
        this.status = status;
        this.codigo = codigo;
    }



}
