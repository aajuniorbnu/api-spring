package com.superdev.helpdesk.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
@RestControllerAdvice
public class ErroControllerAdvice {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validar(MethodArgumentNotValidException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Confira os campos informados", "erros", e.getBindingResult().getFieldErrors().stream().map(f -> f.getField() + ": " + f.getDefaultMessage()).toList()));
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> json(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "JSON inválido: confira vírgulas, aspas e datas no formato AAAA-MM-DD."));
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> tipo(MethodArgumentTypeMismatchException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Parâmetro inválido: " + e.getName()));
    }
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> recurso(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(Map.of("message", e.getReason() == null ? "Requisição inválida" : e.getReason()));
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> conflito(DataIntegrityViolationException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Dados em conflito: confira nomes duplicados e registros relacionados."));
    }
}
