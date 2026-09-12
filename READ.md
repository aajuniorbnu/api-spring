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

## Comparação com o trabalho

Referência: https://github.com/franciscosensaulas/super-dev-08-help-desk/blob/master/TRABALHO.md

| Tabela | Campos de negócio | Antes | Agora |
|---|---|---|---|
| categorias | nome, descricao (2) | CRUD existente | CRUD com resposta 404 para ID inexistente e interface |
| usuarios | nome, email, telefone, cargo (4) | nome e email | Dois campos adicionais e interface |
| equipes | nome, descricao, email, telefone, especialidade, horarioAtendimento (6) | Ausente | Entidade, repository, DTOs criar/atualizar, service, controller e interface |
| chamados | titulo, descricao, prioridade, status, prazo, categoria, solicitante, equipe (8) | Ausente | Entidade, repository, DTOs criar/atualizar, service, controller e interface |

IDs, datas de criação e indicadores de atividade não entram nessa contagem. Cada chamado pertence a uma categoria, um usuário solicitante e uma equipe, com chaves estrangeiras no PostgreSQL.

Todas as tabelas oferecem POST e GET na coleção e GET, PUT e DELETE em `/{id}`. DELETE mantém o padrão original de exclusão lógica: o registro fica inativo e continua disponível para consulta. O status de atendimento do chamado é independente do indicador de exclusão.

Prioridades: BAIXA, MEDIA, ALTA, URGENTE. Status: ABERTO, EM_ANDAMENTO, RESOLVIDO, FECHADO. Prazo: AAAA-MM-DD.

A interface usa somente arquivos locais HTML/CSS/JS, sem bibliotecas. Crie categoria, usuário e equipe antes de criar um chamado. É possível listar, buscar localmente, consultar detalhes, editar e apagar em cada tela. Não existe autenticação nesta aplicação didática.

## Validação e apresentação

Os testes de integração executam CRUD das quatro tabelas, verificam relacionamentos, atualizações, exclusão lógica, dados inválidos e IDs inexistentes. Usam transações revertidas ao final; sequências de IDs podem avançar. Os testes acessam o banco configurado.

Para apresentar: crie os três cadastros auxiliares, abra um chamado, consulte os dados relacionados, altere sua prioridade/status e demonstre a exclusão lógica. Percorra controller → DTO → service → repository → entidade.

## Entrega no GitHub

O projeto tem Git local, mas não há remoto configurado. A publicação no repositório do aluno continua pendente. O repositório do professor é apenas a referência; nenhuma alteração foi enviada a ele.
