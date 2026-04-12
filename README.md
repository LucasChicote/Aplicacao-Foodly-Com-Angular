# Foodly — Front-end com Angular

## Descrição do Projeto

O Foodly é uma aplicação web de delivery de alimentos desenvolvida com Angular. A plataforma permite que clientes naveguem por restaurantes e façam pedidos, donos de restaurante gerenciem seus cardápios e pedidos, e administradores controlem usuários e categorias.

A aplicação consome a [Foodly API](https://github.com/seu-usuario/Foodly_API) (Spring Boot) via HTTP e utiliza JWT para autenticação.

---

## Arquitetura

A aplicação é composta pelos seguintes módulos:

**Páginas públicas**
- Welcome — página de boas-vindas
- Login — autenticação de usuário
- Cadastro — registro de novo usuário (cliente, dono de restaurante ou admin)

**Área do Cliente**
- Restaurantes — lista todos os restaurantes cadastrados com busca por nome
- Cardápio do Restaurante — exibe os produtos de um restaurante com filtro por categoria
- Sacola e Pagamento — resumo do pedido e seleção de forma de pagamento
- Meus Pedidos — histórico de pedidos realizados

**Área do Dono de Restaurante**
- Dashboard — cadastro de restaurantes e produtos, gerenciamento de pedidos recebidos

**Área do Administrador**
- Painel Admin — listagem e exclusão de usuários, criação e remoção de categorias

---

## Tecnologias Utilizadas

- Angular 19 (Standalone Components)
- TypeScript
- Tailwind CSS
- Lucide Angular (ícones)
- RxJS
- Angular Router com Guards (authGuard, adminGuard, ownerGuard)
- HTTP Client com interceptor JWT

---

## Pré-requisitos

Antes de executar, certifique-se de ter instalado:

- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)

```bash
npm install -g @angular/cli
```

> A [Foodly API](https://github.com/seu-usuario/Foodly_API) deve estar em execução em `http://localhost:8080` antes de iniciar o front-end.

---

## Instruções de Uso

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/Aplicacao-Foodly-Com-Angular.git
```

### 2. Entrar na pasta do projeto

```bash
cd Aplicacao-Foodly-Com-Angular
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Executar a aplicação

```bash
ng serve
```

A aplicação ficará disponível em:

```
http://localhost:4200
```

---

## Configuração da URL da API

A URL base da API está definida no arquivo:

```
src/app/service/api.service.ts
```

```typescript
private readonly URL = 'http://localhost:8080';
```

Se a API estiver rodando em outra porta, altere esse valor.

---

## Fluxo de Uso

### Cliente
```
Cadastro (ROLE_CUSTOMER)
  → Login
  → Lista de Restaurantes (busca por nome)
  → Cardápio do Restaurante (filtro por categoria)
  → Adicionar ao carrinho
  → Pagamento (PIX, Débito ou Crédito)
  → Pedido confirmado
  → Meus Pedidos (histórico)
```

### Dono de Restaurante
```
Cadastro (ROLE_RESTAURANT_OWNER)
  → Login
  → Dashboard do Restaurante
  → Cadastrar restaurante (nome, descrição, categoria, imagem)
  → Adicionar produtos (nome, preço, categoria, imagem)
  → Visualizar e atualizar status dos pedidos recebidos
```

### Administrador
```
Cadastro (ROLE_ADMIN)
  → Login
  → Painel Admin
  → Visualizar todos os usuários (filtro por perfil)
  → Excluir usuários
  → Criar e remover categorias
```

---

## Rotas da Aplicação

| Rota | Componente | Acesso |
|------|-----------|--------|
| `/` | Welcome | Público |
| `/login` | Login | Público |
| `/cadastro` | Form | Público |
| `/restaurantes` | Restaurantes | Autenticado |
| `/restaurante/:id` | RestauranteDetalhe | Autenticado |
| `/pagamento` | Pagamento | Autenticado |
| `/meus-pedidos` | MeusPedidos | Autenticado |
| `/perfil` | Perfil | Autenticado |
| `/dashboard-owner` | DashboardOwner | Apenas OWNER |
| `/admin` | Admin | Apenas ADMIN |

---

## Estrutura do Projeto

```
Aplicacao-Foodly-Com-Angular/
│
├── src/
│   └── app/
│       ├── app.config.ts
│       ├── app.routes.ts
│       │
│       ├── components/
│       │   ├── categorias/
│       │   ├── header/
│       │   └── todo-item/
│       │
│       ├── guards/
│       │   ├── auth.guard.ts
│       │   ├── admin.guard.ts
│       │   └── owner.guard.ts
│       │
│       ├── interceptors/
│       │   └── auth.interceptor.ts
│       │
│       ├── pages/
│       │   ├── Welcome/
│       │   ├── admin/
│       │   ├── pagamento/
│       │   ├── pedidos/
│       │   ├── restaurante/
│       │   │   └── dashboard-owner.ts
│       │   └── restaurantes/
│       │       ├── restaurantes.ts
│       │       └── restaurante-detalhe.ts
│       │
│       ├── service/
│       │   └── api.service.ts
│       │
│       ├── form/
│       ├── home/
│       └── login/
│
├── public/
├── angular.json
├── package.json
└── tsconfig.json
```

---

## Funcionalidades de Imagem

O upload de imagens é feito diretamente pela interface, sem necessidade de servidor externo. A imagem selecionada é convertida para Base64 e enviada junto com os dados do restaurante ou produto para a API.

- Suporte a JPG, PNG e outros formatos de imagem
- Preview da imagem antes de salvar
- Imagens exibidas nos cards de restaurantes e produtos

> Recomenda-se usar imagens de até **500KB** para melhor desempenho.

---

## Troubleshooting

**Erro: `ng: command not found`**
```bash
npm install -g @angular/cli
```

**Erro: módulos não encontrados após clonar**
```bash
npm install
```

**A aplicação abre mas não carrega dados**
```
Verifique se a Foodly API está rodando em http://localhost:8080
```

**Erro de CORS**
```
Verifique se a URL http://localhost:4200 está liberada no SecurityConfig.java da API.
```

**Token expirado (erro 403)**
```
Faça logout e login novamente para obter um novo token JWT.
```

---

## Conclusão

O Foodly Front-end oferece:

- Interface responsiva para clientes, donos de restaurante e administradores
- Autenticação com JWT e controle de acesso por guards
- Upload de imagens diretamente pelo navegador
- Navegação por restaurantes com busca e filtro por categoria
- Gerenciamento completo de pedidos em tempo real

## Vídeo demonstrativo da aplicação angular rodando com a API em Java com SpringBoot

[![Vídeo de Demonstração](https://img.youtube.com/vi/89RdIERCHqM/hqdefault.jpg)](https://youtu.be/89RdIERCHqM?si=9i-5eB3Z3j2PgVS1)
