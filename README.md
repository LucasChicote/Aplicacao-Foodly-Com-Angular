# 🥡 Foodly — Plataforma de Delivery Sustentável

> Conectando comércios alimentícios a consumidores conscientes, reduzindo o desperdício de alimentos e promovendo o consumo responsável.

**Grupo Byte Bro's — FIAP · Análise e Desenvolvimento de Sistemas · Java Advanced 2026**

| Integrante | RM |
|---|---|
| Henrique Marques Sladkevicius | 560698 |
| Lucas Aurelio de Brito Chicote | 559366 |
| Lucas Gomes de Araujo Lopes | 559607 |

---

## 📋 Sobre o Projeto

O **Foodly** é uma plataforma web completa de delivery de alimentos com foco em sustentabilidade. O sistema identifica e disponibiliza alimentos próximos da data de vencimento ou de pedidos cancelados, tornando-os acessíveis a preços reduzidos por meio de kits sortidos — beneficiando o meio ambiente, os estabelecimentos e os consumidores.

### Principais Funcionalidades

- **Listagem de alimentos** por categorias (Salgados, Doces, Lanches, Bebidas e outros)
- **Compra de kits/bags sustentáveis** com preços reduzidos
- **Integração com meios de pagamento** digitais (PIX, cartão de crédito, débito e carteiras digitais)
- **Sistema de recomendação inteligente** baseado no histórico do usuário
- **Acompanhamento de pedido em tempo real**
- **Canal de suporte** com chatbot integrado

---

## 🏗️ Arquitetura

A plataforma é composta por dois repositórios independentes que se comunicam via HTTP REST com autenticação JWT:

| Repositório | Descrição |
|---|---|
| [`Aplicacao-Foodly-Com-Angular`](https://github.com/LucasChicote/Aplicacao-Foodly-Com-Angular.git) | Front-end SPA — Angular 21 + Tailwind CSS |
| [`Foodly_API_2.0`](https://github.com/LucasChicote/Foodly_API_2.0.git) | Back-end RESTful — Java 17 + Spring Boot 3 + Oracle |

```
Navegador (Angular 21 · localhost:4200)
        │  HTTP + JWT
        ▼
API REST (Spring Boot 3 · localhost:8080)
  ├── Controller → Service → Repository
  └── Security (JWT + Roles)
        │
        ▼
Oracle Database (oracle.fiap.com.br:1521)
        ▲
      Flyway (migrations V1–V6)

Integrações externas:
  ├── ViaCEP — preenchimento automático de endereço
  └── BrasilAPI — fallback para consulta de CEP
```

---

## 🛠️ Tecnologias

### Front-end

| Tecnologia | Detalhe |
|---|---|
| Angular | 21.1.0 (Standalone Components) |
| TypeScript | Linguagem principal |
| Tailwind CSS | Estilização utilitária |
| Lucide Angular | Ícones SVG |
| RxJS | Programação reativa |
| Angular Router | Roteamento com Guards (`authGuard`, `adminGuard`, `ownerGuard`) |
| HTTP Interceptor | Injeção automática do token JWT |

### Back-end

| Tecnologia | Detalhe |
|---|---|
| Java | 17 (Eclipse Temurin) |
| Spring Boot | 3.4.4 |
| Spring Security + JWT | Autenticação e autorização por roles |
| Spring Data JPA + Hibernate | ORM e acesso ao Oracle |
| Oracle Database | Servidor FIAP (`oracle.fiap.com.br:1521`) |
| Flyway | Migrations versionadas (V1 a V6) |
| Lombok | Redução de boilerplate |
| Gradle | Build e gerenciamento de dependências |
| Docker | Containerização (Dockerfile multi-stage) |
| WebFlux / WebClient | Integração assíncrona com ViaCEP |
| `com.auth0:java-jwt 4.4.0` | Geração e validação de tokens JWT |

---

## ⚙️ Pré-requisitos e Configuração

### Front-end

**Requisitos:**
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Foodly API rodando em `http://localhost:8080`

**Instalação e execução:**

```bash
git clone https://github.com/LucasChicote/Aplicacao-Foodly-Com-Angular.git
cd Aplicacao-Foodly-Com-Angular
npm install
ng serve
```

Disponível em: `http://localhost:4200`

> Para alterar a URL da API, edite `src/app/service/api.service.ts`:
> ```typescript
> private readonly URL = 'http://localhost:8080';
> ```

---

### Back-end (API)

**Requisitos:**
- Java 17+
- Acesso ao Oracle FIAP ou Oracle XE local
- Gradle (o wrapper `./gradlew` já está incluso)

**Instalação e execução:**

```bash
git clone https://github.com/LucasChicote/Foodly_API_2.0.git
cd Foodly_API_2.0

# Linux/macOS
./gradlew bootRun

# Windows
gradlew.bat bootRun
```

Disponível em: `http://localhost:8080`

---

### Banco de Dados

Edite `src/main/resources/application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl
    username: <seu_rm>
    password: <sua_senha>
    driver-class-name: oracle.jdbc.OracleDriver
  jpa:
    hibernate:
      ddl-auto: none
    database-platform: org.hibernate.dialect.OracleDialect
  flyway:
    enabled: true
    baseline-on-migrate: true
```

> As tabelas são criadas e atualizadas automaticamente pelo Flyway na inicialização.

---

### Execução via Docker

```bash
# Build da imagem
docker build -t foodly-api .

# Execução
docker run -p 8080:8080 -e JWT_SECRET=meu-segredo foodly-api
```

O `compose.yaml` disponível no repositório sobe um banco PostgreSQL local para testes isolados (porta 5432). Para produção/FIAP, utilizar Oracle conforme `application.yaml`.

---

## 👥 Perfis de Usuário

| Role | Permissões |
|---|---|
| `ROLE_CUSTOMER` | Navegar em restaurantes, montar carrinho, realizar pedidos, consultar histórico |
| `ROLE_RESTAURANT_OWNER` | Cadastrar e gerenciar restaurantes e produtos, visualizar e atualizar status dos pedidos recebidos |
| `ROLE_ADMIN` | Acesso total: gerencia usuários, categorias, pode agir como qualquer role |

### Fluxo do Cliente
1. Cadastro com `ROLE_CUSTOMER` → Login → token JWT
2. Navega pela lista de restaurantes (busca por nome)
3. Acessa cardápio com filtro por categoria
4. Adiciona itens ao carrinho e seleciona forma de pagamento (PIX, Débito ou Crédito)
5. Pedido confirmado → consulta histórico em **Meus Pedidos**

### Fluxo do Dono de Restaurante
1. Cadastro com `ROLE_RESTAURANT_OWNER` → Login → token JWT
2. Acessa o **Dashboard do Restaurante**
3. Cadastra restaurante (nome, descrição, categoria, imagem Base64)
4. Adiciona produtos e gerencia os pedidos recebidos

### Fluxo do Administrador
1. Cadastro com `ROLE_ADMIN` → Login → token JWT
2. Acessa o **Painel Admin**
3. Visualiza, filtra e exclui usuários
4. Cria e remove categorias do sistema

---

## 🗺️ Rotas do Front-end

| Rota | Componente | Acesso |
|---|---|---|
| `/` | Welcome | Público |
| `/login` | Login | Público |
| `/cadastro` | Form de Cadastro | Público |
| `/restaurantes` | Lista de Restaurantes | Autenticado |
| `/restaurante/:id` | Detalhes do Restaurante | Autenticado |
| `/pagamento` | Sacola e Pagamento | Autenticado |
| `/meus-pedidos` | Meus Pedidos | Autenticado |
| `/perfil` | Perfil do Usuário | Autenticado |
| `/dashboard-owner` | Dashboard do Dono | Apenas OWNER |
| `/admin` | Painel Administrativo | Apenas ADMIN |

---

## 📡 Endpoints da API

Todos os endpoints autenticados requerem o header:
```
Authorization: Bearer <token_jwt>
```

### Autenticação

| Endpoint | Descrição | Acesso |
|---|---|---|
| `POST /auth/register` | Cadastrar novo usuário | Público |
| `POST /auth/login` | Login + token JWT | Público |

**Exemplo de body para login:**
```json
{
  "email": "usuario@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Usuários

| Endpoint | Descrição | Acesso |
|---|---|---|
| `GET /usuarios` | Listar todos os usuários | ADMIN |
| `DELETE /usuarios/{id}` | Deletar usuário | ADMIN |
| `GET /usuarios/cep/{cep}` | Buscar endereço via ViaCEP | ADMIN |

### Restaurantes

| Endpoint | Descrição | Acesso |
|---|---|---|
| `GET /restaurantes` | Listar todos | Público |
| `GET /restaurantes/meus` | Restaurantes do dono autenticado | OWNER |
| `POST /restaurantes` | Criar restaurante | OWNER / ADMIN |

**Exemplo de body:**
```json
{
  "nome": "Mc Donald's",
  "descricao": "FastFood",
  "categoria": "Lanches",
  "imagemUrl": "<base64>"
}
```

### Produtos

| Endpoint | Descrição | Acesso |
|---|---|---|
| `GET /produtos` | Listar todos | Público |
| `GET /produtos/restaurante/{id}` | Listar por restaurante | Público |
| `GET /produtos/categoria/{id}` | Listar por categoria | Público |
| `POST /produtos` | Criar produto | OWNER / ADMIN |
| `DELETE /produtos/{id}` | Deletar produto | OWNER / ADMIN |

**Exemplo de body:**
```json
{
  "nome": "Big Mac",
  "descricao": "Pão com gergelim, dois hambúrgueres, alface, queijo e molho especial.",
  "preco": 24.90,
  "precoPromocional": 18.90,
  "isKitSustentavel": true,
  "dataExpiracao": "2026-06-01",
  "categoriaId": 1,
  "restauranteId": 1,
  "imagemUrl": "<base64>"
}
```

### Categorias

| Endpoint | Descrição | Acesso |
|---|---|---|
| `GET /categorias` | Listar categorias | Público |
| `POST /categorias` | Criar categoria | ADMIN |
| `DELETE /categorias/{id}` | Deletar categoria | ADMIN |

### Pedidos

| Endpoint | Descrição | Acesso |
|---|---|---|
| `POST /pedidos` | Criar pedido | CUSTOMER / ADMIN |
| `GET /pedidos/meus` | Meus pedidos | CUSTOMER / ADMIN |
| `GET /pedidos/restaurante/{id}` | Pedidos do restaurante | OWNER / ADMIN |
| `PATCH /pedidos/{id}/status` | Atualizar status | OWNER / ADMIN |

**Exemplo de body para criar pedido:**
```json
{
  "restauranteId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 },
    { "produtoId": 3, "quantidade": 1 }
  ]
}
```

### Busca Global

| Endpoint | Descrição | Acesso |
|---|---|---|
| `GET /search?termo=...` | Busca em produtos + restaurantes por nome/descrição | Autenticado |

---

## 🗄️ Banco de Dados — Migrations (Flyway)

Scripts em `src/main/resources/db/migration/`, executados automaticamente na inicialização:

| Arquivo | Descrição |
|---|---|
| `V1__init.sql` | Criação de todas as tabelas |
| `V2__insert_dados.sql` | Dados iniciais (categorias padrão) |
| `V3__cascade_delete_usuario.sql` | `ON DELETE CASCADE` nas FKs de usuários |
| `V4__imagem_url_para_clob.sql` | Altera `imagem_url` para `CLOB` (suporte a Base64) |
| `V5__categoria_tipo_produto.sql` | Adiciona campo `tipo` na tabela de categorias |
| `V6__add_kit_sustentavel_fields.sql` | Adiciona `preco_promocional`, `is_kit_sustentavel` e `data_expiracao` em produtos |

---

## 🖼️ Upload de Imagens (Base64)

O sistema suporta upload de imagens sem necessidade de servidor de arquivos externo:

1. Usuário seleciona uma imagem no Angular
2. O Angular converte para Base64 e exibe preview
3. A string Base64 é enviada junto aos dados do restaurante/produto
4. A API armazena o Base64 no campo `imagem_url` (tipo `CLOB` — migration V4)
5. O Angular renderiza a imagem diretamente do Base64

**Formatos suportados:** JPG, PNG e demais formatos do navegador.
**Recomendação:** usar imagens de até 500 KB para melhor desempenho.

---

## 🗂️ Estrutura dos Repositórios

### Front-end — `Aplicacao-Foodly-Com-Angular`

```
src/app/
├── app.config.ts            # Configuração global do Angular
├── app.routes.ts            # Definição de todas as rotas
├── components/              # Componentes reutilizáveis (header, categorias...)
├── guards/                  # authGuard, adminGuard, ownerGuard
├── interceptors/            # auth.interceptor.ts (injeta JWT)
├── pages/
│   ├── Welcome/             # Página inicial pública
│   ├── admin/               # Painel administrativo
│   ├── pagamento/           # Sacola e pagamento
│   ├── pedidos/             # Histórico de pedidos
│   ├── restaurante/         # Dashboard do dono
│   └── restaurantes/        # Lista e detalhe de restaurante
├── service/api.service.ts   # Serviço HTTP centralizado
├── form/                    # Formulário de cadastro
└── login/                   # Página de login
```

### Back-end — `Foodly_API_2.0`

```
src/main/java/com/foodly/foodly/
├── FoodlyApplication.java
├── client/
│   └── ViaCepClient.java
├── config/
│   ├── SecurityConfig.java
│   └── GlobalExceptionHandler.java
├── controller/
│   ├── AutenticacaoController.java
│   ├── CategoriaController.java
│   ├── PedidoController.java
│   ├── ProdutoController.java
│   ├── RestauranteController.java
│   ├── SearchController.java
│   └── UsuarioController.java
├── dto/
├── model/
├── repository/
├── security/
│   └── JwtAuthFilter.java
└── service/

src/main/resources/
├── application.yaml
└── db/migration/
    ├── V1__init.sql
    ├── V2__insert_dados.sql
    ├── V3__cascade_delete_usuario.sql
    ├── V4__imagem_url_para_clob.sql
    ├── V5__categoria_tipo_produto.sql
    └── V6__add_kit_sustentavel_fields.sql
```

---

## 🔧 Troubleshooting

### Front-end

| Erro | Solução |
|---|---|
| `ng: command not found` | `npm install -g @angular/cli` |
| Módulos não encontrados após clonar | `npm install` |
| Aplicação abre mas não carrega dados | Verificar se a API está rodando em `http://localhost:8080` |
| Erro de CORS | Confirmar que `http://localhost:4200` está em `allowedOrigins` no `SecurityConfig.java` |
| Erro 403 (token expirado) | Realizar logout e login novamente para obter novo token JWT |

### Back-end

| Erro | Solução |
|---|---|
| `ORA-01017` (usuário/senha inválidos) | Verificar credenciais no `application.yaml` |
| Erro de Flyway na primeira execução | Adicionar `baseline-on-migrate: true` no `application.yaml` |
| Porta 8080 já em uso | Alterar `server.port` no `application.yaml` |
| Erro de CORS no front-end | Verificar `allowedOrigins` em `SecurityConfig.java` |

---

## 🔗 Links

| Recurso | Link |
|---|---|
|    Repositório da API | [github.com/LucasChicote/Foodly_API_2.0](https://github.com/LucasChicote/Foodly_API_2.0.git) |
|    Repositório do Front-end | [github.com/LucasChicote/Aplicacao-Foodly-Com-Angular](https://github.com/LucasChicote/Aplicacao-Foodly-Com-Angular.git) |
|    Link da API Foodly | [https://api-foodly-fng4.onrender.com](https://api-foodly-fng4.onrender.com) |
|    Link dO site Foodly | [https://aplicacao-foodly-com-angular.vercel.app](https://aplicacao-foodly-com-angular.vercel.app ) |
---

## Vídeo de Demonstração geral do projeto:

[![Vídeo de Demonstração](https://img.youtube.com/vi/6LPK_jIOFcA/hqdefault.jpg)](https://youtu.be/6LPK_jIOFcA?si=4zG6cXpceC2R_Y3C)

*Foodly — Menos desperdício. Mais consciência. Tecnologia a serviço do planeta.* 
