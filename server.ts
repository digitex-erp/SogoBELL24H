import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for server-side persistence
  let user = {
    id: "u-admin-1",
    name: "Ramesh Sharma",
    email: "admin@bell24h.com",
    role: "super_admin"
  };

  let organization = {
    id: "org-1",
    name: "VyaparSethu Exports Ltd",
    timezone: "Asia/Kolkata",
    currency: "INR",
    plan: "Enterprise"
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Bell24h-OS", timestamp: new Date().toISOString() });
  });

  // Auth
  app.get(["/api/auth/me", "/auth/me"], (_req, res) => {
    res.json({ user, organization });
  });

  app.post(["/api/auth/login", "/auth/login"], (req, res) => {
    const email = req.body.email || "admin@bell24h.com";
    user.email = email;
    res.json({ token: "bell24h_jwt_enterprise_token", user, organization });
  });

  app.post(["/api/auth/register", "/auth/register"], (req, res) => {
    const email = req.body.email || "newuser@bell24h.com";
    user = { id: "u-" + Date.now(), name: req.body.name || "Enterprise Trader", email, role: "admin" };
    res.json({ token: "bell24h_jwt_token_" + Date.now(), user, organization });
  });

  app.post(["/api/auth/reset-password", "/auth/reset-password"], (_req, res) => {
    res.json({ message: "Password reset instructions sent" });
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", (_req, res) => {
    res.json({
      totalBudget: 2850000,
      totalSpent: 1420500,
      totalCampaigns: 24,
      activeCampaigns: 18,
      totalLeads: 142,
      activeLeads: 68,
      totalJobs: 89,
      runningJobs: 4,
      recentJobs: [
        { id: "job-101", type: "lead_enrichment_pipeline", status: "running", createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
        { id: "job-102", type: "rfq_cross_border_matcher", status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
        { id: "job-103", type: "textile_catalog_indexer", status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
        { id: "job-104", type: "whatsapp_broadcast_dispatch", status: "completed", createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString() }
      ],
      activities: [
        { id: "act-1", action: "rfq.matched", resource: "Tirupur Combed Cotton 40s (15,000 kg)", createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString() },
        { id: "act-2", action: "campaign.activated", resource: "Surat Synthetic Silk Global Outreach Q3", createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString() },
        { id: "act-3", action: "lead.converted", resource: "Al-Mansoor Textiles LLC (Dubai, UAE)", createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString() }
      ],
      notifications: [
        { id: "notif-1", title: "New High-Value RFQ", message: "Buyer from Hamburg requested quotation for 50,000m Organic Twill.", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false },
        { id: "notif-2", title: "Circuit Breaker Alert", message: "DeepSeek API latency normalized below 400ms. Breaker restored.", createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(), read: false }
      ],
      unreadNotifications: 2
    });
  });

  // Providers
  app.get("/api/providers", (_req, res) => {
    res.json({
      providers: [
        { id: "prov-1", provider: "openai", model: "gpt-4o", priority: 1, rateLimit: 500, isEnabled: true, maskedApiKey: "sk-proj-...8a9F", createdAt: "2024-01-15T08:00:00Z", status: "active" },
        { id: "prov-2", provider: "anthropic", model: "claude-3-5-sonnet-20241022", priority: 2, rateLimit: 300, isEnabled: true, maskedApiKey: "sk-ant-...4Xk9", createdAt: "2024-01-20T10:30:00Z", status: "active" },
        { id: "prov-3", provider: "google", model: "gemini-1.5-pro", priority: 3, rateLimit: 1000, isEnabled: true, maskedApiKey: "AIzaSy...7mP2", createdAt: "2024-02-01T12:00:00Z", status: "active" },
        { id: "prov-4", provider: "groq", model: "llama-3.3-70b-versatile", priority: 4, rateLimit: 600, isEnabled: true, maskedApiKey: "gsk_...9bV1", createdAt: "2024-02-10T15:00:00Z", status: "active" }
      ],
      usage: [
        { provider: "openai", requests: 48200, tokens: 28400000, cost: 142.30, errorRate: 0.02 },
        { provider: "anthropic", requests: 31400, tokens: 19800000, cost: 98.40, errorRate: 0.01 },
        { provider: "google", requests: 22100, tokens: 15400000, cost: 42.10, errorRate: 0.005 }
      ]
    });
  });

  app.post("/api/providers/:id/test", (_req, res) => {
    res.json({ success: true, latency: 138 });
  });

  // AI Router & Factory endpoints fallback
  app.all("/api/*", (_req, res) => {
    res.json({ success: true });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bell24h-OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
