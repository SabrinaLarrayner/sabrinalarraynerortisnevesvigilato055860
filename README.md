# PROCESSO SELETIVO CONJUNTO Nº 001/2026/SEPLAG
## Engenheiro da Computação - Sênior

### Dados do Candidato
- **Nome:** Sabrina Larrayner Ortis Neves Vigilato
- **Inscrição:** 16415
- **Projeto:** SabrinaLarrayner/sabrinalarraynerortisnevesvigilato055860
- **Email:** sabrinalarrayner2015@outlook.com
- **GitHub:** [SabrinaLarrayner](https://github.com/SabrinaLarrayner)

---

### Stack Técnica
- **Framework:** Angular 21 (Standalone Components)
- **Gerenciamento de Estado:** RxJS (BehaviorSubject) e Angular Signals
- **Estilização:** Tailwind CSS
- **Ícones:** Angular Material Icons
- **Testes:** Vitest
- **Ambiente:** Docker (Node 22 LTS / Nginx Alpine)

---

### Arquitetura do Projeto
A estrutura de pastas segue as melhores práticas para aplicações Angular Standalone, organizada de forma modular e escalável:

```text
src/
└── app/
    ├── components/      # Componentes compartilhados e reutilizáveis (UI/Shared)
    ├── layout/          # Estruturas de layout (ex: layout-toggle-view)
    ├── pages/           # Componentes de página (Views principais da aplicação)
    ├── service/         # Serviços para consumo de APIs e lógica de negócio
    ├── utils/           # Funções utilitárias e constantes auxiliares
    ├── app.config.ts    # Configurações globais (Providers, Interceptors)
    ├── app.routes.ts    # Definição centralizada de rotas e Guards
    └── app.ts           # Componente raiz da aplicação
```

---
#### Ambiente Docker (Produção)
1. **Iniciar containers:**
   ```bash
   docker compose up -d
   ```
2. **Encerrar containers:**
   ```bash
   docker compose down
   ```

### Instruções para Execução

#### Ambiente Local
1. **Instalar dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm start
   ```

---

### Interface (UI)
- **Iconografia:** Utilização do componente `<mat-icon>` do Angular Material para ações semânticas (Adicionar, Editar, Excluir).
- **Design:** Layout responsivo e modular construído estritamente com utilitários do **Tailwind CSS**, garantindo baixa especificidade de CSS e alta performance de renderização.

---

### Health Checks e Resiliência (Liveness & Readiness)
A aplicação implementa um sistema de monitoramento contínuo para validar a disponibilidade da API:

- **Diferenciação Semântica de Erros:** O sistema interpreta os status HTTP 401 (Unauthorized) e 403 (Forbidden) como indicadores de que a API está "Online". A lógica assume que, se o servidor processa a falha de autorização, o serviço está operando corretamente.
- **Polling Reativo:** Utilização dos operadores `interval` e `switchMap` do RxJS para realizar verificações automáticas a cada 30 segundos, evitando concorrência de requisições.
- **Validação por Representação:** Através do operador `forkJoin`, o sistema valida múltiplos endpoints simultaneamente. A estabilidade só é confirmada se o ecossistema completo de serviços responder adequadamente.
- **Tratamento de Falhas Críticas:** O status é alterado para "Offline" apenas em erros de rede (status 0), erros internos do servidor (5xx) ou falhas de resolução de DNS.

---

### Segurança e Gerenciamento de Rotas
- **Proteção de Rotas (AuthGuard):** Implementação de um Guard funcional que atua como middleware de segurança, interceptando o acesso a rotas privadas e redirecionando usuários não autenticados.
- **Arquitetura de Rotas Protegidas:** Uso de rotas agrupadas (*children routes*), onde uma única declaração de guarda protege todo o escopo logado da aplicação.
- **Lazy Loading:** Implementação de `loadComponent` em todas as rotas para otimização do Large Contentful Paint (LCP).
- **Redirecionamento de Fallback:** Configuração de rotas curinga (`**`) para tratamento de erros de navegação (404 client-side).

---

### Testes Unitários com Vitest
A escolha pelo **Vitest** em substituição ao Karma/Jasmine visa ganho de performance e alinhamento com o ecossistema Vite.

- **Mock de APIs do Navegador:** Utilização de `vi.stubGlobal` para simular comportamentos de classes nativas como `FileReader` em testes de upload.
- **Validação de Formulários:** Injeção de mocks diretamente nos controles via `setValidators` para isolar a lógica de componentes de serviços externos.
- **Sincronia e Ciclo de Vida:** Substituição do `fakeAsync` por padrões `async/await` controlados, garantindo que as máscaras de entrada (`ngx-mask`) sejam processadas antes das asserções.

---

### Camada de Serviço e Padrão Facade
A aplicação utiliza o padrão Facade dentro do diretório service/ para gerenciar a complexidade das interações com a API.

- **Gerenciamento de Estado:** Utiliza BehaviorSubject para controlar o estado reativo da aplicação, como a lista de dados, o item selecionado e o status de carregamento (loading), garantindo que a interface sempre tenha o valor mais atualizado.
- **Simplificação:** As Facades abstraem as chamadas de múltiplos serviços e o gerenciamento de estado (RxJS), entregando para os componentes apenas os dados e métodos necessários.
- **Desacoplamento:** Reduz a dependência direta dos componentes em relação à lógica de infraestrutura de rede.

---

### Hierarquia de Endpoints (Rotas)

| Entidade | Ação | Caminho (URL) |
| :--- | :--- | :--- |
| Login | Autenticação | `/login` |
| Pets | Listagem | `/list-pets` |
| Pets | Cadastro | `/create-pet` |
| Pets | Edição | `/details-pet/:id/edit` |
| Tutores | Listagem | `/list-tutors` |
| Tutores | Cadastro | `/create-tutor` |
| Tutores | Edição | `/details-tutor/:id/edit` |
