# Albi Finance

Um aplicativo de controle financeiro pessoal construído com tecnologias web modernas. Este projeto permite que os usuários gerenciem seus períodos de orçamento, metas e transações diárias.

## Stack de Tecnologias

* **Framework Frontend:** [React](https://react.dev/) com [Vite](https://vitejs.dev/) para um desenvolvimento rápido.
* **Banco de Dados e Autenticação:** [Supabase](https://supabase.com/) como backend (PostgreSQL, Auth, Storage).
* **Gerenciamento de Dados (Client-side):** [TanStack Query](https://tanstack.com/query/latest) para caching, sincronização e busca de dados.
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) para estilização via classes de utilidade.
* **Componentes de UI:** [shadcn/ui](https://ui.shadcn.com/) para uma coleção de componentes acessíveis e customizáveis.
* **Roteamento:** [React Router DOM](https://reactrouter.com/) para navegação e múltiplas páginas.
* **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/) para gerenciamento eficiente de dependências.

## 🚀 Começando

Siga estes passos para configurar e rodar o projeto localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [pnpm](https://pnpm.io/installation) instalado globalmente: `npm install -g pnpm`
* [Supabase CLI](https://supabase.com/docs/guides/cli) instalada globalmente: `pnpm install -g supabase`

### 1. Configuração Inicial

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd albi-finance
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo chamado `.env.local` na raiz do projeto.
    * Vá para o painel do seu projeto no Supabase > Settings > API.
    * Copie a URL do Projeto e a Chave `anon` `public` e cole no arquivo:
    ```env
    # .env.local
    VITE_SUPABASE_URL="SUA_URL_DO_PROJETO_SUPABASE"
    VITE_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_PUBLIC_DO_SUPABASE"
    ```

### 2. Conectando ao Supabase

Para gerenciar o banco de dados via linha de comando, você precisa autenticar e conectar seu projeto local ao projeto remoto no Supabase.

1.  **Faça login na sua conta Supabase:**
    ```bash
    supabase login
    ```
    (Isso abrirá uma janela no navegador para você se autenticar).

2.  **Conecte o projeto local ao remoto:**
    * Encontre o seu "Project Ref" na URL do seu painel Supabase (`app.supabase.com/project/ESTE_EH_O_REF`).
    * Execute o comando abaixo. Você precisará da senha do seu banco de dados.
    ```bash
    supabase link --project-ref SEU_PROJECT_REF_AQUI
    ```
    > **Não lembra a senha do banco?** Você pode redefini-la facilmente no painel do Supabase em `Settings` > `Database` > `Reset database password`.

### 3. Rodando o Projeto

Com tudo configurado, inicie o servidor de desenvolvimento:
```bash
pnpm dev
```
O projeto estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## 🛠️ Fluxo de Trabalho com o Banco de Dados

Gerenciar a estrutura do banco de dados (tabelas, colunas, etc.) é feito através de "migrations".

### Criando uma Nova Migração

Sempre que você precisar alterar a estrutura do banco de dados (criar uma tabela, adicionar uma coluna), crie um novo arquivo de migração.
```bash
# Use um nome descritivo para a migração
supabase migration new "nome_descritivo_da_sua_alteracao"
```
Isso criará um novo arquivo SQL na pasta `supabase/migrations`. Edite este arquivo com seus comandos SQL (ex: `CREATE TABLE`, `ALTER TABLE`).

### Aplicando a Migração no Supabase

Após escrever sua migração, aplique-a ao seu banco de dados remoto no Supabase com o comando:
```bash
supabase db push
```
> **⚠️ Erro de Conexão?** Se você receber um erro como `hostname resolving error`, geralmente é um problema de rede na sua máquina. Tente o seguinte:
> 1. Desative temporariamente seu Firewall, Antivírus ou VPN.
> 2. Limpe o cache de DNS do seu sistema operacional.

### Gerando Tipos TypeScript do Banco

Para manter a segurança de tipos (type safety) entre o banco de dados e o frontend, gere os tipos TypeScript sempre que alterar a estrutura do banco.
```powershell
# Comando recomendado (para PowerShell no Windows)
pnpm supabase gen types typescript --project-id SEU_PROJECT_REF_AQUI | Out-File -FilePath src/types/supabase.ts -Encoding utf8

# Comando para outros terminais (Linux/macOS)
pnpm supabase gen types typescript --project-id SEU_PROJECT_REF_AQUI > src/types/supabase.ts
```
> **💡 Por que usar `Out-File` no PowerShell?** O comando padrão `>` no PowerShell pode salvar o arquivo com uma codificação de caracteres (UTF-16 LE) que causa um erro `Unexpected "�"` no Vite. Usar `Out-File -Encoding utf8` garante que o arquivo seja salvo no formato correto (UTF-8).

## 🔐 Autenticação e Segurança

* **Login com Google:** A configuração é feita no painel do Supabase em `Authentication` > `Providers`. Você precisará criar credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/).
* **Row Level Security (RLS):** **Fundamental!** Todas as tabelas têm RLS ativada. Isso significa que, por padrão, ninguém pode acessar os dados. Você precisa criar **Políticas (Policies)** no painel do Supabase para permitir operações de `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
    > **Problema Comum:** "Meus dados não aparecem na aplicação, mas estão no banco". Isso quase sempre significa que falta uma política de `SELECT` para o usuário autenticado. A regra mais comum é `auth.uid() = user_id`.

## 📜 Scripts do Projeto

* `pnpm dev`: Inicia o servidor de desenvolvimento.
* `pnpm build`: Compila e otimiza o projeto para produção.
* `pnpm lint`: Executa o linter para verificar a qualidade do código.
* `pnpm preview`: Inicia um servidor local para visualizar a build de produção.
