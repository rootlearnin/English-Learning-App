# English Learning Platform

Plataforma web fullstack para aprendizado de inglês com lições estruturadas, quizzes interativos e acompanhamento de progresso.

## Demonstração

| Homepage | Dashboard | Lição | Quiz |
|----------|-----------|-------|------|
| Landing page com apresentação | Progresso e lista de lições | Conteúdo em Markdown | Exercícios com feedback |

## Funcionalidades

- **Autenticação** — Registro e login com JWT + hash de senhas (bcrypt)
- **5 Lições** — Conteúdo em Markdown com tabelas e exemplos formatados
- **25 Exercícios** — Múltipla escolha com feedback imediato e explicação
- **Sistema de Pontos** — Acumule pontos a cada acerto (+10 por questão correta)
- **Rastreamento de Progresso** — Taxa de acerto, lições completadas e barra de progresso
- **Rotas Protegidas** — Dashboard e lições acessíveis apenas para usuários autenticados

## Lições Disponíveis

| # | Lição | Nível |
|---|-------|-------|
| 1 | Verbo TO BE | Iniciante |
| 2 | Verbos Irregulares | Iniciante |
| 3 | Present Continuous | Intermediário |
| 4 | Vocabulário: Rotina Diária | Iniciante |
| 5 | Simple Past | Intermediário |

## Stack

**Frontend**
- React 19 + Vite
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (ícones)
- React Markdown + remark-gfm

**Backend**
- Node.js + Express
- better-sqlite3 (banco de dados)
- JSON Web Token (autenticação)
- bcryptjs (hash de senhas)

## Estrutura do Projeto

```
english-learning-app/
├── backend/
│   └── src/
│       ├── config/database.js    # SQLite + seed das lições
│       ├── middleware/auth.js    # Verificação JWT
│       ├── routes/
│       │   ├── auth.routes.js    # POST /register, /login
│       │   ├── lessons.routes.js # GET /lessons, /:id, POST /:id/complete
│       │   └── users.routes.js   # GET /users/stats
│       └── server.js
└── frontend/
    └── src/
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── components/PrivateRoute.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Dashboard.jsx
            └── Lesson.jsx
```

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/rootlearnin/English-Learning-App.git
cd English-Learning-App
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Variáveis de Ambiente

Crie o arquivo `backend/.env`:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_URL=./database.sqlite
```

Crie o arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Executar

**Windows** — duplo clique em `iniciar.bat`

**Manual** (dois terminais):

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

## API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/health` | Status do servidor | — |
| POST | `/api/auth/register` | Criar conta | — |
| POST | `/api/auth/login` | Fazer login | — |
| GET | `/api/lessons` | Listar lições com progresso | JWT |
| GET | `/api/lessons/:id` | Detalhes + exercícios da lição | JWT |
| POST | `/api/lessons/:id/complete` | Enviar respostas do quiz | JWT |
| GET | `/api/users/stats` | Estatísticas do usuário | JWT |

## Licença

MIT
