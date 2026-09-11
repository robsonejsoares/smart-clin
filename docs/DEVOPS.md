# DevOps, Governança e Padrões de Engenharia — SmartClin

Este documento define as diretrizes obrigatórias de governança de código, arquitetura de branches, gestão de segurança e a esteira de CI/CD do projeto **SmartClin**, em conformidade com os padrões globais de engenharia Enterprise.

---

## 1. Estrutura de Branches (Git Flow Enterprise)

* **`main`**: Código em produção. Alterações ocorrem exclusivamente via Pull Request validado e aprovado.
* **`staging`**: Ambiente de pré-produção/homologação para validação final.
* **`test`**: Ambiente isolado para execução de testes integrados e validações de QA.
* **`develop`**: Branch principal de integração do desenvolvimento contínuo.
* **`feature/*`**: Branches temporárias para novas funcionalidades (ex: `feature/agendamento-consulta`).
* **`fix/*` / `hotfix/*`**: Branches para correção de falhas em ambiente de testes ou produção.

---

## 2. Políticas de Proteção de Branches (GitHub Rulesets)

### Integration Ruleset (`develop`, `test`, `staging`)
* **Pull Request**: Obrigatório.
* **Status Checks**: Requer aprovação dos testes e validação da esteira de CI (`build-and-test`).
* **Block Force Push**: Ativo.
* **Restrict Deletions**: Ativo.

### Production Ruleset (`main`)
* **Pull Request**: Obrigatório com **1 aprovação de revisor** (Tech Lead / Code Owner).
* **Conversation Resolution**: Todos os comentários e revisões devem ser marcados como resolvidos.
* **Linear History**: Requerido (proibidos commits de merge; apenas `squash` ou `rebase`).
* **Status Checks**: Requer aprovação estrita do CI e verificação de segurança.
* **Block Force Push**: Ativo.
* **Bypass List**: Restrito exclusivamente a `Repository Admin` (para simulação de papeis e emergências operacionais).

---

## 3. Matriz de Propriedade de Código (`.github/CODEOWNERS`)

As alterações em diretórios críticos exigem aprovação obrigatória dos responsáveis indicados:
* `src/app/api/` ➔ Requer aprovação do time de Backend / Arquitetura.
* `.github/` e `docs/` ➔ Requer aprovação do time de DevOps / Tech Lead.
* `package.json` e `package-lock.json` ➔ Requer aprovação do Tech Lead.

---

## 4. Padronização de Commits (Conventional Commits)

Todos os commits no repositório devem seguir estritamente o padrão:

`<tipo>(<escopo opcional>): <descrição no imperativo>`

* **`feat`**: Nova funcionalidade.
* **`fix`**: Correção de bug.
* **`docs`**: Alterações em documentação.
* **`style`**: Formatação de código sem alteração de lógica (Prettier, lint).
* **`refactor`**: Refatoração de código sem alterar comportamento.
* **`test`**: Adição ou ajuste de testes.
* **`chore`**: Atualizações de builds, pacotes ou configurações locais.

---

## 5. Segurança, LGPD e Trilha de Auditoria (Audit Trail)

* **Injeção de Credenciais**: Proibido o versionamento de arquivos `.env` ou chaves de API no repositório.
* **GitHub Secrets**: Variáveis de ambiente de CI/CD injetadas via cofre do GitHub.
* **Compliance LGPD**: Proibida a emissão de logs contendo dados pessoais identificáveis (PII) ou dados sensíveis de saúde dos pacientes.
* **Trilha de Auditoria (Audit Trail)**: Armazenamento imutável de histórico de escrita/leitura sobre registros médicos e cadastrais de pacientes.
* **Criptografia**: Requisito de dados criptografados em trânsito (TLS 1.3) e em repouso (AES-256).
* **Secret Scanning**: Alertas automáticos no GitHub para detecção de credenciais vazadas.

---

## 6. Esteira de Integração Contínua (CI)

Localizada em `.github/workflows/ci.yml`. Disparada em todo `push` ou `pull_request` para as branches protegidas:

1. **Checkout de Código**: `actions/checkout@v4`
2. **Ambiente Runtime**: Node.js 20 com cache estrito do `npm`.
3. **Instalação Reprodutível**: `npm ci`
4. **Análise Estática (Linting)**: `npm run lint` (ESLint Enterprise Rules).
5. **Testes Automatizados**: `npm run test` (Exigência de 80%+ de cobertura).
6. **Auditoria de Acessibilidade (a11y)**: Validação automatizada de componentes visuais conforme a norma WCAG 2.1.
7. **Orçamento de Performance**: Análise de tamanho de pacote JS (*Bundle Size Limit*) para evitar regressões de carregamento no Next.js.
8. **Compilação de Validação (Build)**: `npm run build` (Next.js Enterprise Build).

---

## 7. Análise de Segurança, Qualidade e Compliance (SAST / SCA)

* **Dependabot**: Monitoramento e PRs automáticos para correção de vulnerabilidades em dependências (`SCA`).
* **CodeQL / SonarCloud**: Análise estática de vulnerabilidades de código (`SAST`) para bloqueio de brechas antes do merge.
* **Auditoria de Licenças**: Verificação no CI para barrar pacotes `npm` com licenças restritivas.

---

## 8. Banco de Dados e Migrações (Zero-Downtime)

* **Migrações Automatizadas**: Executadas pela esteira de CD antes da publicação do novo código.
* **Compatibilidade Reversa**: Modificações de esquema divididas em fases para não interromper acessos em execução.

---

## 9. Versionamento Semântico e Releases Automáticas

* **Semantic Release**: Automação da criação de tags de versão (ex: `v1.2.0`) com base nos *Conventional Commits*.
* **CHANGELOG.md**: Atualização automática do histórico de mudanças a cada publicação na `main`.

---

## 10. Gestão de Implantação e Feature Flags

* **Feature Toggles**: Funcionalidades críticas devem ser isoladas por Feature Flags (ex: LaunchDarkly/Unleash) para permitir rollouts graduais (Canary Release) e desligamento instantâneo em caso de anomalia.

---

## 11. Observabilidade, Telemetria e Disaster Recovery

* **Monitoramento de Erros (APM)**: Integração com Sentry para rastreamento de exceções em tempo real.
* **Logs Estruturados**: Formatação em JSON para auditoria técnica.
* **Plano de Rollback Instantâneo**: Reversão automática de tráfego pela infraestrutura de CD em caso de falha crítica na `main`.
* **Disaster Recovery**: Backups diários automatizados do banco de dados com RPO (ponto de recuperação) menor que 1 hora.

---

## 12. Esteira de Entrega Contínua (CD)

* **Ambiente Preview**: Deploy automático na Vercel a cada PR aberto.
* **Ambiente Staging**: Deploy automático na Vercel ao integrar na branch `staging`.
* **Ambiente Production**: Deploy automatizado com aprovação e tag de versão ao integrar na `main`.

---

## 13. Roadmap de Automação do Repositório

- [x] Arquitetura de Branches e Git Flow Enterprise
- [x] Rulesets de Proteção de Branches (Integração e Produção)
- [x] Pipeline Base de CI (`ci.yml`)
- [ ] Template de Pull Request (`.github/PULL_REQUEST_TEMPLATE.md`)
- [ ] Templates de Issues (`.github/ISSUE_TEMPLATE/`)
- [ ] Git Hooks Locais (Husky + Commitlint)
- [ ] Configuração do `CODEOWNERS` (`.github/CODEOWNERS`)
- [ ] Pipeline de Testes de Unidade e Cobertura Mínima
- [ ] Testes de Acessibilidade Automáticos (axe-core / WCAG)
- [ ] Leitor de Segurança SAST (CodeQL)
- [ ] Configuração de Observabilidade (Sentry)
- [ ] Pipeline de CD e Previews na Vercel