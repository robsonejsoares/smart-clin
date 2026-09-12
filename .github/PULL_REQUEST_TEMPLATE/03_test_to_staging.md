## 🎭 Test -> Staging
<!-- Use este template somente para PRs de test para staging. -->

### 📌 Release Candidate
<!-- Descreva a versão ou conjunto de alterações que será promovido para homologação. -->

- [ ] A branch de origem é `test` e o destino é `staging`.
- [ ] O pacote foi validado no ambiente `test`, com evidências registradas abaixo.
- [ ] Os fluxos críticos e as funcionalidades alteradas foram aprovados na validação de QA.
- [ ] Não existem bugs bloqueadores ou pendências críticas conhecidas.

### 🧪 Evidências da Validação
<!-- Informe os cenários executados e adicione links para prints, vídeos ou relatórios, quando disponíveis. -->

- Cenários validados:
- Resultado da validação:
- Evidências:
- Pendências conhecidas:

### 🛡️ Validação de Segurança e Infraestrutura
- [ ] As alterações de schema e as migrações do banco foram revisadas.
- [ ] As migrações são compatíveis com a versão atualmente em produção, quando aplicável.
- [ ] As variáveis de ambiente necessárias estão configuradas no ambiente `staging`.
- [ ] Não há chaves, senhas ou dados de pacientes (PII) expostos em código ou logs.
- [ ] As alterações de autenticação, autorização e acesso foram verificadas, quando aplicável.

### 📋 Checklist Técnico
- [ ] O `npm run lint` foi executado com sucesso.
- [ ] O `npm run build` foi executado com sucesso.
- [ ] A documentação foi atualizada, se aplicável.
- [ ] O plano de validação em `staging` está definido.