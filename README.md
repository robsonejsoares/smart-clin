# 🏥 SmartClin — Multi-tenant SaaS para Gestão e Agendamento Clínico

![CI Build](https://img.shields.io/github/actions/workflow/status/robsonejsoares/smart-clin/ci.yml?branch=develop&label=CI%20Build)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Coverage](https://img.shields.io/badge/Coverage-80%25+-brightgreen)
![Compliance](https://img.shields.io/badge/Compliance-LGPD-green)

O **SmartClin** é uma plataforma SaaS multi-tenant voltada para a gestão operacional de clínicas, agendamento clínico público sem fricção e faturamento recorrente via assinaturas.

---

## 🛠️ Tech Stack & Arquitetura de Sistemas

| Camada | Tecnologias Utilizadas |
| :--- | :--- |
| **Frontend** | Next.js (App Router & Server Actions), TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query |
| **Backend & ORM** | Node.js (API Routes), Prisma ORM |
| **Processamento Assíncrono** | Redis, BullMQ (Lembretes de consultas e envio de e-mails) |
| **Autenticação & Segurança** | Auth.js (OAuth2 Google), RBAC, LGPD Compliance (Audit Trail) |
| **Pagamentos & SaaS** | Stripe Billing, Webhooks Idempotentes, Feature Gating |
| **Testes & Qualidade** | Vitest, React Testing Library, Playwright (E2E), ESLint Enterprise |
| **Infraestrutura & DevOps** | Docker, Docker Compose, Vercel, GitHub Actions (CI/CD), GitHub Rulesets |

---

## ⚡ Diferenciais Técnicos & Engenharia Enterprise

* **Padronização UTC Zero**: Armazenamento e tratamento estrito de datas em UTC no banco de dados para evitar conflitos de fuso horário entre regiões.
* **Prevenção de Double-Booking**: Algoritmo de cruzamento de agenda em tempo real que bloqueia instantaneamente horários concorrentes.
* **Idempotência no Stripe**: Processamento seguro de webhooks para garantir que nenhum evento de cobrança seja duplicado ou perdido.
* **Arquitetura Event-Driven**: Filas assíncronas via Redis para notificação automática de pacientes sem bloquear a resposta da API.
* **Feature Gating**: Controle dinâmico de acesso a recursos e limites operacionais com base no plano contratado.
* **Governança & CI/CD**: Esteira automatizada de lint, testes, build, regras estritas de Pull Request e proteção de branches (`main`, `develop`, `test`, `staging`).

---

## 🏢 Módulos do Sistema

### 1. Painel Administrativo da Clínica
* Perfil corporativo, janela de atendimento customizável e upload de logotipo.
* Gestão (CRUD) de serviços de saúde com máscaras de moeda (BRL) e restrições por plano.
* Dashboard interativo de agendamentos e quadro de lembretes.

### 2. Portal do Paciente (Agendamento Clínico Público)
* Interface otimizada para agendamento clínico público em tempo real, sem necessidade de criação prévia de conta.

### 3. Gestão SaaS & Billing
* Checkout transparente e portal do cliente para gestão de assinaturas via Stripe.

---

## 📖 Documentação de API & DevOps

* **Especificação OpenAPI / Swagger**: Rotas e schemas documentados em `/docs/swagger.json`.
* **Governança DevOps completa**: Diretrizes de arquitetura, CI/CD e regras de branch em [`docs/DEVOPS.md`](./docs/DEVOPS.md).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js 20+
* Docker Desktop & Docker Compose
* npm / pnpm / yarn

### 1. Clonar o Repositório & Instalação
```bash
git clone https://github.com/robsonejsoares/smart-clin.git
cd smart-clin
npm ci