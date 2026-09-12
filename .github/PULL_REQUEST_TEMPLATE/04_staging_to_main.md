## 🌐 Staging -> Main (Production Release)
<!-- Use este template somente para PRs de staging para main. -->

### 📌 Release de Produção
<!-- Descreva a versão, o objetivo e as principais alterações deste release. -->

- [ ] A branch de origem é `staging` e o destino é `main`.
- [ ] A homologação em `staging` foi concluída com sucesso.
- [ ] As funcionalidades críticas foram validadas no ambiente de homologação.
- [ ] Não existem bugs bloqueadores ou pendências críticas conhecidas.
- [ ] O escopo do release foi revisado e está documentado.

### 🗄️ Banco de Dados e Compatibilidade
- [ ] As alterações de schema e as migrações foram revisadas.
- [ ] As migrações são compatíveis com a versão atualmente em produção.
- [ ] Existe um plano de rollback para as alterações de banco, quando aplicável.
- [ ] O backup necessário foi realizado antes do deploy ou foi documentado que não se aplica.
- [ ] As variáveis de ambiente de produção foram verificadas sem expor valores sensíveis.

### 🚀 Checklist de Deploy
- [ ] O `npm run lint` foi executado com sucesso.
- [ ] O `npm run build` foi executado com sucesso.
- [ ] O procedimento de deploy está definido e foi revisado.
- [ ] O procedimento mantém a disponibilidade da aplicação ou documenta claramente qualquer janela de indisponibilidade.
- [ ] O plano de rollback da aplicação está definido.
- [ ] Os responsáveis pela execução e acompanhamento do deploy estão definidos.

### 📊 Plano de Validação Pós-Deploy
- [ ] Os fluxos críticos que serão verificados após o deploy estão definidos.
- [ ] O monitoramento de logs, erros e alertas está preparado.
- [ ] Os responsáveis pela validação pós-deploy estão definidos.

### 📸 Evidências e Plano de Rollback
<!-- Adicione links para evidências da homologação, build, deploy e validação pós-deploy. -->

- Evidências da homologação:
- Evidências do build:
- Evidências do deploy:
- Plano de rollback:
- Observações: