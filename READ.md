# Helpdesk

API Spring Boot com PostgreSQL e interface em HTML, CSS e JavaScript puros.

## Executar

Requer Java 26 e PostgreSQL. Crie o banco `helpdesk` antes de iniciar.
As variáveis `DATABASE_URL` (URL JDBC), `DATABASE_USER` e `DATABASE_PASSWORD` configuram a conexão em `src/main/resources/application.properties`.

```sh
./mvnw spring-boot:run
```

- Interface: http://localhost:8080/
- Swagger: http://localhost:8080/docs (sem barra final)
- Testes: `./mvnw test`

O Hibernate está configurado com `ddl-auto=update`: cria as tabelas e acrescenta as colunas necessárias. Os campos novos `telefone` e `cargo` de usuários são opcionais para preservar registros e clientes existentes.

## Exemplos completos de imobiliária

A pasta `exemplos-imobiliaria` contém uma aplicação independente com proprietários, imóveis, clientes, visitas e contratos. Consulte `exemplos-imobiliaria/README.md` para abrir no IntelliJ, configurar o banco e experimentar os cinco CRUDs.

O helpdesk e seu banco continuam separados dos exemplos de imobiliária.
