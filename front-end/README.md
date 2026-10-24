# Helpdesk Angular

Tela de cadastro em `/categorias/cadastrar`, integrada ao `POST /categorias` do Spring Boot.

## Executar

1. Inicie o PostgreSQL e o backend na porta 8080 (`./mvnw spring-boot:run` na raiz do projeto).
2. Nesta pasta, execute `npm install` e `npm start`.
3. Acesse http://localhost:4200/categorias/cadastrar.

O proxy de desenvolvimento encaminha `/api/categorias` ao backend, sem precisar alterar CORS. Nome obrigatório (2 a 60 caracteres); descrição opcional (até 255). Em produção, configure o servidor para encaminhar `/categorias` à rota `/categorias` da API e servir o Angular nas demais rotas.

Validação: `npm run build` e `npm test -- --watch=false`.

## Organização

Seguindo a separação de responsabilidades do backend `escola-projeto`:

- `src/app/services/categoria.service.ts`: acesso HTTP, com injeção pelo construtor.
- `src/app/dtos/categoria/`: contratos separados para criar, atualizar e receber categorias.
- `src/app/categorias/`: componente e formulário de cadastro.

Os contratos e as rotas correspondem ao backend Helpdesk; a referência da escola é usada para a organização do código.
