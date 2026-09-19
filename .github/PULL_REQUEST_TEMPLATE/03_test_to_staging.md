# 🎭 Test → Staging

<!-- Use este template somente para PRs de test para staging. -->

## 📌 Release Candidate

<!-- Descreva a versão ou conjunto de alterações que será promovido para homologação. -->

- [x] A origem é `test` e o destino é `staging`.
- [ ] As alterações foram validadas no ambiente `test`.
- [ ] Os fluxos críticos e as funcionalidades alteradas foram aprovados na validação de QA.
- [ ] Não existem bugs bloqueadores ou pendências críticas conhecidas.
- [ ] O escopo da promoção está documentado.

## 🧪 Evidências da Validação

<!-- Informe os cenários executados e adicione links para evidências. -->

- Cenários validados:
- Resultado da validação:
- Evidências:
- Pendências conhecidas:

## 🛡️ Validação de Segurança e Infraestrutura

- [ ] As alterações de schema e as migrações do banco foram revisadas.
- [ ] As migrações são compatíveis com a versão atualmente em produção, quando aplicável.
- [ ] As variáveis de ambiente necessárias estão configuradas no ambiente `staging`.
- [ ] Não há chaves, senhas ou dados de pacientes (PII) expostos em código ou logs.
- [ ] As alterações de autenticação, autorização e acesso foram verificadas, quando aplicável.

## 📋 Checklist Técnico

- [ ] Os checks automatizados de CI passaram com sucesso.
- [ ] A documentação foi atualizada, se aplicável.
- [ ] O plano de validação em `staging` está definido.

## 🔍 Critérios para Promoção

- [ ] Não há regressões conhecidas que impeçam a homologação.
- [ ] O comportamento esperado da aplicação está documentado.
- [ ] Os pontos que precisam ser validados em `staging` estão identificados.
