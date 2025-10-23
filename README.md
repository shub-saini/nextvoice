# 🚀 NextCall — AI Calling & Chatbot SaaS Platform

NextCall is a full-stack **AI communication platform** that allows businesses to:

- 🧠 Create intelligent chatbots and AI calling agents using **VAPI**.
- 🌐 Embed these agents as **widgets** on their own websites.
- 💬 Manage conversations, leads, and insights in a **single dashboard**.
- 💳 Monetize via usage-based billing with **Stripe** integration.
- 🔐 Seamlessly manage users and authentication with **Clerk**.

Built with scalability, modularity, and automation at its core.

---

## 🗺️ System Architecture & Workflow

### Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  👤 End User  →  🌐 Client Website  →  💬 NextCall Widget           │
│  📱 Business Owner  →  🖥️ NextCall Dashboard                        │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND APPS (Next.js)                       │
├─────────────────────────────────────────────────────────────────────┤
│  📦 web (Dashboard)  |  📦 widget (Embeddable)  |  📦 landing       │
└─────────────────────────────────────────────────────────────────────┘
                    ↓                              ↓
    ┌───────────────────────────┐    ┌───────────────────────────┐
    │   🔐 CLERK AUTH           │    │   🧠 VAPI AI ENGINE       │
    │   • User Sessions         │    │   • AI Calling Agent      │
    │   • Organizations         │    │   • Conversational AI     │
    │   • Role Management       │    │   • Phone Calls           │
    └───────────────────────────┘    └───────────────────────────┘
                    ↓                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    ⚡ CONVEX BACKEND & DATABASE                      │
├─────────────────────────────────────────────────────────────────────┤
│  📊 Conversations  |  👥 Users & Orgs  |  🤖 Agent Configs          │
│  📈 Analytics  |  💬 Messages  |  🔔 Notifications                  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
                    ┌───────────────────────────┐
                    │   💳 STRIPE PAYMENTS      │
                    │   • Subscriptions         │
                    │   • Usage-based Billing   │
                    │   • Webhooks              │
                    └───────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    AWS INFRASTRUCTURE (ECS)                          │
├─────────────────────────────────────────────────────────────────────┤
│  GitHub → Actions → 🐳 Docker → ECR → ECS Cluster                   │
│  • Service: web  |  • Service: widget  |  • Service: landing       │
│  ☁️ CloudFront CDN → Load Balancer                                  │
└─────────────────────────────────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    📊 MONITORING & OBSERVABILITY                     │
├─────────────────────────────────────────────────────────────────────┤
│  Prometheus → Grafana Dashboards → 🔔 Slack Alerts                  │
│  Loki (Logs) → Centralized Logging                                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              📦 SHARED PACKAGES (Turborepo Monorepo)                │
├─────────────────────────────────────────────────────────────────────┤
│  ui (Components)  |  utils (Helpers)  |  config (Types & Env)       │
│  api (Convex + VAPI Client)                                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 🔄 Data Flow Explained

1. **User Interaction** → End user visits client website with embedded widget
2. **Widget Init** → Widget loads, authenticates with Clerk (if needed), connects to Convex
3. **AI Request** → User message sent to VAPI for AI processing
4. **Response** → VAPI returns AI-generated response, stored in Convex
5. **Dashboard Sync** → Business owner sees real-time conversation updates
6. **Billing** → Usage tracked and sent to Stripe for billing
7. **Deployment** → Code pushed → CI/CD builds → Docker images → ECS deployment
8. **Monitoring** → All services monitored via Grafana with alerts

---

## 🧩 Monorepo Architecture

This project uses **Turborepo** for fast, modular, and consistent development across multiple apps and packages.

### Structure

```
nextcall/
│
├── apps/
│   ├── web/                # Main Next.js web dashboard (SaaS app)
│   ├── widget/             # Embeddable chatbot widget (can be installed via script tag)
│   └── landing/            # Marketing website with pricing and blog
│
├── packages/
│   ├── ui/                 # Shared UI components (shadcn/ui, Tailwind)
│   ├── utils/              # Shared TypeScript utilities and hooks
│   ├── config/             # Env, constants, and types
│   └── api/                # Shared API client for Convex + VAPI
│
├── turbo.json              # Turborepo configuration
├── package.json
└── pnpm-workspace.yaml
```

---

## ⚙️ Tech Stack

| Layer      | Technology                               | Purpose                                          |
| ---------- | ---------------------------------------- | ------------------------------------------------ |
| Frontend   | **Next.js 15 + React 19 + Tailwind**     | High-performance SaaS & widget                   |
| Backend    | **Convex**                               | Serverless backend & database for real-time sync |
| AI         | **VAPI**                                 | Handles AI calling and conversational logic      |
| Auth       | **Clerk**                                | Authentication, orgs, roles                      |
| Payments   | **Stripe**                               | Subscription, usage-based billing                |
| Deployment | **Docker + AWS ECS + CloudFront**        | Auto-scaled infra                                |
| CI/CD      | **GitHub Actions + Terraform + AWS ECR** | Full infra automation                            |
| Monitoring | **Grafana + Loki + Prometheus**          | Observability suite                              |

---

## 🧠 Features

- **AI Calling Agents:** Integrate with VAPI for AI phone interactions.
- **Smart Chatbot Widgets:** Plug-and-play widgets for client sites.
- **Real-time Dashboards:** View conversations, metrics, and payments instantly via Convex.
- **Subscription & Billing:** Managed via Stripe webhooks.
- **Multi-Tenant Auth:** Built with Clerk's Organizations API.
- **Developer SDK:** For clients who want API access directly.

---

## 🚀 Setup

### 1️⃣ Install Dependencies

```bash
pnpm install
```

### 2️⃣ Create `.env` files

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/widget/.env.local
```

Populate with:

```
VAPI_KEY=
CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
```

### 3️⃣ Run Development

```bash
pnpm dev
```

### 4️⃣ Build All Apps

```bash
pnpm build
```

---

## 🧱 Killer DevOps Implementation (Scalable, Automated, Resilient)

### 🧩 1. **Infrastructure as Code — Terraform**

- Define all AWS infra: ECS cluster, ECR, Load Balancer, RDS (if added later), CloudFront, and S3.
- Each app (web, widget, landing) runs in its own ECS service.
- Use Terraform modules for DRY configuration.
- Store state in **AWS S3 backend + DynamoDB** for locking.

### ⚙️ 2. **CI/CD — GitHub Actions**

Workflow example:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install PNPM
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Install deps
        run: pnpm install

      - name: Build apps
        run: pnpm build

      - name: Dockerize & Push
        run: |
          docker build -t nextcall-web ./apps/web
          docker tag nextcall-web:latest ${{ secrets.AWS_ECR_URI }}/nextcall-web:latest
          docker push ${{ secrets.AWS_ECR_URI }}/nextcall-web:latest

      - name: Deploy via Terraform
        run: |
          cd infra/
          terraform init
          terraform apply -auto-approve
```

Every push to `main` → Build → Test → Dockerize → Push → Deploy.

### 🛡️ 3. **Zero-Downtime Deployments**

- Use **ECS Blue-Green Deployment** (via CodeDeploy).
- Rollbacks auto-trigger if health checks fail.
- Route traffic through **AWS Application Load Balancer**.

### 🧠 4. **Secrets & Config Management**

- Manage all secrets via **AWS SSM Parameter Store**.
- Inject them into ECS task definitions automatically.

### 📈 5. **Monitoring & Logging**

- **Prometheus** scrapes metrics from ECS services.
- **Grafana** dashboards visualize latency, CPU, and traffic.
- **Loki** aggregates logs across containers.
- Alerting via **Slack Webhooks** when thresholds break.

### 🧰 6. **Local-to-Cloud Parity**

- Docker Compose replicates full cloud stack locally:
  ```bash
  docker-compose up
  ```
- Mimics Convex, Clerk, and VAPI connections via mock APIs for testing.

---

## 🧪 Testing Strategy

- **Unit Tests** → Vitest
- **Integration Tests** → Playwright (dashboard + widget)
- **Load Testing** → k6 (simulate multiple concurrent calls)
- **CI Coverage Reports** → Codecov integration

---

## 💡 Future Roadmap

- [ ] AI Agent Marketplace
- [ ] Voice cloning for personalized calls
- [ ] Team management & analytics
- [ ] White-label chatbots for agencies
- [ ] Self-hosted Convex alternative for enterprise clients

---

## 🧍‍♂️ Founder's Vision

> "NextCall isn't just a chatbot builder. It's the bridge between humans and intelligent automation. Every business deserves its own AI workforce — that's what we're building."

— **Shub**, Founder & Engineer
