# 🏥 SmartClin — Multi-tenant SaaS para Gestão e Agendamentos Médicos

Plataforma SaaS desenvolvida para automatizar a gestão de clínicas, agendamentos públicos de consultas e faturamento recorrente via assinaturas.

## 🎯 Sobre o Projeto
O SmartClin resolve a gestão operacional de clínicas médicas. O sistema oferece um painel administrativo para controle de serviços e assinaturas, além de um portal público otimizado para que pacientes realizem agendamentos em tempo real sem conflitos de horários.


## 🛠️ Stack Tecnológica
   - Frontend: Next.js (App Router e Server Actions), TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query
   - Backend: Node.js (API Routes), Prisma ORM, Auth.js (OAuth2 com Google)
   - Integradores: Stripe Billing e Webhooks, Cloud Storage, Vercel (CI/CD)


## ⚡ Diferenciais Técnicos
   - Padronização UTC Zero: Tratamento de fuso horário no banco para evitar conflitos de horários entre regiões.
   - Idempotência no Stripe: Processamento seguro de webhooks para impedir duplicação de eventos e falhas de cobrança.
   - Feature Gating: Limitação dinâmica de recursos e cadastros com base na assinatura ativa.
   - Prevenção de Double-Booking: Algoritmo que cruza a agenda em tempo real para bloquear horários ocupados.


## 🏢 Módulos do Sistema
   - Painel da Clínica:
     - Perfil corporativo, janela de atendimento, fuso horário e logotipo
     - CRUD de serviços com máscaras de moeda (BRL) e restrições de plano
     - Dashboard de agendamentos e quadro interativo de lembretes

   - Portal do Paciente:
     - Agendamento público em tempo real sem necessidade de criar conta

   - Gestão SaaS Billing:
     - Checkout transparente e portal do cliente via Stripe


## 🌿 Estrutura de Branches (Git Flow)
   - main ➔ Ambiente de Produção
   - staging ➔ Ambiente de Homologação
   - test ➔ Ambiente de Testes / QA
   - develop ➔ Branch de Desenvolvimento   


## 🚀 Como Executar Localmente
   1. Clonar o repositório:
      git clone https://github.com/robsonejsoares/smart-clin.git
   
   2. Entrar no diretório:
      cd smart-clin
   
   3. Instalar as dependências:
      npm install
   
   4. Configurar variáveis de ambiente:
      cp .env.example .env.local
   
   5. Sincronizar o banco de dados:
      npx prisma db push
   
   6. Iniciar o servidor de desenvolvimento:
      npm run dev


## 👨‍💻 Autor
- Desenvolvedor: Robson Edvaldo José Soares
- E-mail: robsoncsoares.1050@gmail.com
- GitHub: https://github.com/robsonejsoares
- LinkedIn: https://www.linkedin.com/in/robson-soares-b22513170/