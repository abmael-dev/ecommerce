# 🛍️ E-Commerce Platform

Uma plataforma full-stack moderna e completa de **E-Commerce** especializada em vestuário, tênis e calçados, construída com foco em alta performance, segurança, design responsivo e excelente experiência do usuário.

---

## 🚀 Tecnologias Utilizadas

### **Frontend**
- **[React 19](https://react.dev/)** & **[TypeScript](https://www.typescriptlang.org/)** — Interface moderna e tipagem estática.
- **[Vite](https://vitejs.dev/)** — Build tool ultra-rápida.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Estilização moderna e responsiva.
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Gerenciamento de estado simples e performático (Carrinho, Autenticação, Favoritos).
- **[TanStack React Query](https://tanstack.com/query/latest)** — Gerenciamento de estado assíncrono e cache de dados da API.
- **[Framer Motion](https://www.framer.com/motion/)** — Animações e transições fluídas.
- **[Lucide React](https://lucide.dev/)** — Pacote completo de ícones modernos.
- **[React Hook Form](https://react-hook-form.com/)** & **[Zod](https://zod.dev/)** — Validação de formulários simplificada e robusta.

### **Backend**
- **[Node.js](https://nodejs.org/) (>= 20)** & **[TypeScript](https://www.typescriptlang.org/)** — Runtime assíncrono e seguro.
- **[Fastify](https://fastify.dev/)** — Framework web de altíssimo desempenho.
- **[Prisma ORM](https://www.prisma.io/)** — Modelagem e manipulação de banco de dados relacional.
- **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional robusto.
- **[Redis](https://redis.io/)** & **[ioRedis](https://github.com/redis/ioredis)** — Caching de respostas e limitação de requisições (Rate Limiting).
- **[Argon2](https://github.com/ranisalt/node-argon2)** & **[Jose](https://github.com/panva/jose)** — Hashing seguro de senhas e autenticação via JWT / Cookies HTTP-Only.
- **[Swagger / OpenAPI](https://swagger.io/)** — Documentação interativa da API gerada automaticamente.
- **[Vitest](https://vitest.dev/)** — Suite de testes unitários e de integração.

---

## ✨ Funcionalidades

### 🛒 Loja & Cliente
- **Navegação & Vitrine**: Catálogo de produtos com filtros por categoria, marca, preço e ordenação.
- **Busca de Produtos**: Pesquisa dinâmica com suporte a debounce.
- **Detalhes do Produto**: Visualização de galeria de imagens, opções de tamanho/cor, estoque e avaliações.
- **Carrinho de Compras**: Carrinho persistente (Drawer lateral e página dedicada) com cálculo dinâmico de totais.
- **Lista de Desejos (Favoritos)**: Adicione e gerencie seus produtos favoritos.
- **Gestão de Conta & Pedidos**: Histórico de pedidos realizados e acompanhamento de status.
- **Tema Claro / Escuro (Dark Mode)**: Suporte nativo a alternância de temas.

### 🛡️ Painel Administrativo
- **Dashboard**: Métricas e relatórios de vendas, estoque e usuários.
- **Gestão de Produtos**: Cadastro, edição, categorização e gerenciamento de estoque.
- **Gestão de Categorias e Marcas**: Organização de marcas e coleções.
- **Gestão de Cupons**: Criação e controle de cupons de desconto.
- **Gestão de Pedidos**: Alteração de status dos pedidos (Pendente, Pago, Enviado, Entregue, Cancelado).
- **Relatórios**: Geração e visualização de métricas detalhadas.

---

## 📁 Estrutura do Projeto

```text
ecommerce/
├── backend/                  # Servidor API Fastify
│   ├── docker/               # Configurações do Dockerfile
│   ├── src/
│   │   ├── cache/            # Serviços de Caching (Redis)
│   │   ├── config/           # Configurações de ambiente, segurança e Swagger
│   │   ├── database/         # Schema Prisma, migrations e seeds
│   │   ├── modules/          # Módulos de domínio (Auth, Produtos, Pedidos, etc.)
│   │   └── shared/           # Utilitários, tratadores de erro e interfaces compartilhadas
│   ├── tests/                # Testes automatizados (Vitest)
│   └── package.json
│
├── public/                   # Recursos estáticos do frontend
├── src/                      # Aplicação Frontend React
│   ├── assets/               # Imagens e vetores
│   ├── components/           # Componentes UI reutilizáveis
│   ├── contexts/             # Provedores de contexto (Tema, Toast)
│   ├── features/             # Stores Zustand e lógica por funcionalidade (Cart, Auth, Wishlist)
│   ├── layouts/              # Layouts base (Root, Admin, Auth)
│   ├── pages/                # Páginas da loja e do painel Admin
│   ├── routes/               # Configurações de rotas (React Router)
│   ├── services/             # Chamadas de API e dados simulados
│   └── types/                # Definições de tipos TypeScript
│
├── docker-compose.yml        # Configuração para subida rápida de banco de dados e serviços
├── package.json              # Configurações e dependências do frontend
└── README.md
```

---

## 🛠️ Como Executar o Projeto

### **Pré-requisitos**
- [Node.js](https://nodejs.org/) v20 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (opcional, para rodar PostgreSQL e Redis facilmente)

---

### **1. Configuração do Backend**

Navegue até a pasta do backend:
```bash
cd backend
```

Instale as dependências:
```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

Suba os serviços de banco de dados com Docker (opcional, se possuir Docker instalado):
```bash
docker-compose up -d
```

Execute as migrações do banco de dados e pue os dados iniciais (seed):
```bash
npm run db:migrate
npm run db:seed
```

Inicie o servidor de desenvolvimento do backend:
```bash
npm run dev
```
> O servidor estará rodando em `http://localhost:3333` e a documentação Swagger em `http://localhost:3333/docs`.

---

### **2. Configuração do Frontend**

Na raiz do projeto, instale as dependências:
```bash
npm install
```

Inicie a aplicação React:
```bash
npm run dev
```
> O frontend estará rodando em `http://localhost:5173`.

---

## 📜 Scripts Disponíveis

### **Frontend**
- `npm run dev` — Inicia o servidor de desenvolvimento com HMR.
- `npm run build` — Compila a aplicação para produção.
- `npm run lint` — Executa a checagem de código com Oxlint.
- `npm run preview` — Visualiza o build de produção localmente.

### **Backend**
- `npm run dev` — Inicia o servidor backend com watch mode (`tsx`).
- `npm run build` — Compila o código TypeScript para JavaScript na pasta `dist`.
- `npm run test` — Executa a suíte de testes com Vitest.
- `npm run db:studio` — Abre a interface visual do Prisma Studio para inspeção do banco de dados.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito por [Abmael](https://github.com/abmael-dev).
