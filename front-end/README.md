# Helpdesk Angular

Categorias, usuários, chamados e tickets integrados ao projeto Java Helpdesk (`api-spring`).

## Executar

1. Inicie o PostgreSQL e o backend na porta 8080 (`./mvnw spring-boot:run` na raiz do projeto).
2. Nesta pasta, execute `npm install` e `npm start`.
3. Acesse http://localhost:4200/categorias/listar.

O proxy de desenvolvimento encaminha `/api/*` ao backend, removendo `/api`, sem precisar alterar CORS. Em produção, configure o servidor para encaminhar `/api/*` ao backend removendo esse prefixo e servir o Angular nas demais rotas.

## Categorias

- `/categorias/listar`: lista categorias ativas e inativas e permite desativar com confirmação.
- `/categorias/cadastrar`: cadastra uma categoria.
- `/categorias/editar/:id`: carrega e atualiza nome e descrição.
- Nome obrigatório (2 a 60 caracteres); descrição opcional (até 255).
- A desativação usa `DELETE /categorias/{id}` e mantém o registro como inativo, conforme o backend. Não há rota de reativação.
- As telas mostram mensagens de sucesso, erro e andamento das operações.

## Organização

Seguindo a separação de responsabilidades do backend Helpdesk:

- `src/app/services/categoria.service.ts`: acesso HTTP, com injeção pelo construtor.
- `src/app/dtos/categoria/`: contratos separados para criar, atualizar e receber categorias.
- `src/app/model/categoria.model.ts`: reexporta os contratos com os nomes anteriores para compatibilidade.
- `src/app/categorias/`: componentes, formulários, estilos e testes de cadastro, listagem e edição.

Os contratos e as rotas correspondem ao backend Helpdesk aberto no IntelliJ.

## Validação

```sh
npm run build
npm test -- --watch=false
```

Os testes usam HTTP simulado e verificam contratos, validação, edição, falhas e desativação. Para conferir a integração real, execute também os fluxos com o backend e o banco ativos.

## Demais telas

- `/usuarios/listar`, `/usuarios/cadastrar`, `/usuarios/editar/:id`: usuários com papel SOLICITANTE ou ATENDENTE e desativação lógica.
- `/chamados/listar`, `/chamados/cadastrar`, `/chamados/editar/:id`: chamados relacionados a categoria e usuário, com prazo, prioridade e status.
- `/tickets/listar`, `/tickets/cadastrar`: abertura por solicitante, associação a atendente, definição de prioridade, resolução e cancelamento conforme as regras do Java.
- Todas as áreas estão no menu principal; os cadastros de usuários e categorias também são acessíveis pelos formulários relacionados.
- O setor Administração envia `ADMINSTRACAO`, exatamente como o enum Java atual.
- Nome de usuário limitado a 60 caracteres para respeitar a coluna da entidade Java.
- Frontend: http://localhost:4200. Backend: http://localhost:8080. Banco: `helpdesk`.
