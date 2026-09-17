const fs = require("fs");

console.log("Generating full Enterprise SEOCenterPage component...");

const seoCenterCode = `function SEOCenterPage({ onNavigate }) {
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [healthScore, setHealthScore] = reactExports.useState(88);
  const [auditing, setAuditing] = reactExports.useState(false);
  const [auditSuccess, setAuditSuccess] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [intentFilter, setIntentFilter] = reactExports.useState("all");
  const [copiedSchema, setCopiedSchema] = reactExports.useState(false);
  const [analyzerUrl, setAnalyzerUrl] = reactExports.useState("/marketplace/textiles");
  const [analyzing, setAnalyzing] = reactExports.useState(false);
  const [analyzedData, setAnalyzedData] = reactExports.useState(null);
  const [newKw, setNewKw] = reactExports.useState({ keyword: "", volume: 5000, intent: "commercial", cluster: "Textile Sourcing" });
  const [showAddKw, setShowAddKw] = reactExports.useState(false);
  const [aiGenerating, setAiGenerating] = reactExports.useState(false);
  const [aiContent, setAiContent] = reactExports.useState("");
  const [geoQuery, setGeoQuery] = reactExports.useState("Top B2B textile sourcing platforms in India");
  const [geoResult, setGeoResult] = reactExports.useState(null);
  const [checkingGeo, setCheckingGeo] = reactExports.useState(false);

  const [keywords, setKeywords] = reactExports.useState([
    { id: "kw-1", keyword: "textile manufacturer india", volume: 18500, difficulty: 54, cpc: "₹195", intent: "commercial", position: 4, prevPosition: 6, url: "/marketplace/textiles", cluster: "Textile Sourcing" },
    { id: "kw-2", keyword: "cotton fabric wholesale bulk", volume: 24200, difficulty: 62, cpc: "₹248", intent: "transactional", position: 3, prevPosition: 5, url: "/marketplace/cotton", cluster: "Textile Sourcing" },
    { id: "kw-3", keyword: "surat synthetic silk exporter", volume: 6800, difficulty: 38, cpc: "₹148", intent: "commercial", position: 2, prevPosition: 2, url: "/suppliers/surat-silk", cluster: "Regional Hubs" },
    { id: "kw-4", keyword: "tirupur combed cotton knitwear", volume: 9400, difficulty: 42, cpc: "₹176", intent: "transactional", position: 1, prevPosition: 3, url: "/suppliers/tirupur-knits", cluster: "Regional Hubs" },
    { id: "kw-5", keyword: "cross border textile escrow payment", volume: 3200, difficulty: 29, cpc: "₹360", intent: "transactional", position: 2, prevPosition: 4, url: "/trust-escrow", cluster: "Trade Finance" },
    { id: "kw-6", keyword: "b2b fabric quotation rfq portal", volume: 4100, difficulty: 34, cpc: "₹190", intent: "transactional", position: 5, prevPosition: 8, url: "/rfqs", cluster: "Trade Finance" },
    { id: "kw-7", keyword: "organic gots certified cotton yarn", volume: 8100, difficulty: 49, cpc: "₹210", intent: "commercial", position: 6, prevPosition: 7, url: "/marketplace/organic-cotton", cluster: "Textile Sourcing" }
  ]);

  const [auditIssues, setAuditIssues] = reactExports.useState([
    { id: "iss-1", severity: "critical", title: "Missing canonical tag on /marketplace/machinery", impact: "High", fixed: false },
    { id: "iss-2", severity: "warning", title: "2 product images missing alt attributes on /suppliers/surat-silk", impact: "Medium", fixed: false },
    { id: "iss-3", severity: "warning", title: "Title tag exceeds 60 characters on /knowledge-base/export-guide", impact: "Medium", fixed: false },
    { id: "iss-4", severity: "notice", title: "XML Sitemap last submitted 4 days ago", impact: "Low", fixed: false },
    { id: "iss-5", severity: "notice", title: "Hreflang tags missing on regional Surat hub page", impact: "Low", fixed: false }
  ]);

  const [selectedSchema, setSelectedSchema] = reactExports.useState("Organization");
  const schemaSnippets = {
    Organization: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Bell24h / VyaparSethu",
      "url": "https://bell24h.com",
      "logo": "https://bell24h.com/logo.png",
      "sameAs": ["https://twitter.com/bell24h", "https://linkedin.com/company/bell24h"],
      "description": "Global B2B Textile & Cross-Border Sourcing Platform with milestone trade escrow."
    }, null, 2),
    B2BProduct: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Combed Cotton Knitting Yarn 30s/1",
      "image": "https://bell24h.com/images/cotton-yarn.jpg",
      "description": "Premium Tirupur combed cotton knitting yarn. High CSP, certified OEKO-TEX Standard 100.",
      "brand": { "@type": "Brand", "name": "Tirupur Mills Direct" },
      "offers": { "@type": "Offer", "priceCurrency": "INR", "price": "285.00", "unitCode": "KGM", "availability": "https://schema.org/InStock" }
    }, null, 2),
    FAQPage: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How does milestone trade escrow protect buyers?", "acceptedAnswer": { "@type": "Answer", "text": "Funds are held securely by VyaparSethu Escrow and only released when SGS lab test inspection passes." } },
        { "@type": "Question", "name": "What is the minimum order quantity for Surat silk?", "acceptedAnswer": { "@type": "Answer", "text": "MOQ typically starts from 500 meters per design with custom sampling available." } }
      ]
    }, null, 2),
    LocalBusiness: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Bell24h Textile Sourcing Hub - Surat",
      "address": { "@type": "PostalAddress", "streetAddress": "Ring Road Textile Market", "addressLocality": "Surat", "addressRegion": "Gujarat", "postalCode": "395002", "addressCountry": "IN" },
      "geo": { "@type": "GeoCoordinates", "latitude": 21.1702, "longitude": 72.8311 },
      "telephone": "+91-261-2400100"
    }, null, 2)
  };

  const handleRunAudit = () => {
    setAuditing(true);
    setAuditSuccess("");
    setTimeout(() => {
      setAuditing(false);
      setHealthScore(91);
      setAuditSuccess("Audit completed successfully! 162 pages crawled, Core Web Vitals validated.");
    }, 900);
  };

  const handleFixIssue = (id) => {
    setAuditIssues(prev => prev.map(iss => iss.id === id ? { ...iss, fixed: true } : iss));
    setHealthScore(prev => Math.min(100, prev + 2));
  };

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!newKw.keyword.trim()) return;
    const added = {
      id: "kw-" + Date.now(),
      keyword: newKw.keyword.trim(),
      volume: Number(newKw.volume) || 4500,
      difficulty: 32,
      cpc: "₹180",
      intent: newKw.intent,
      position: 8,
      prevPosition: 14,
      url: "/marketplace",
      cluster: newKw.cluster || "Textile Sourcing"
    };
    setKeywords(prev => [added, ...prev]);
    setNewKw({ keyword: "", volume: 5000, intent: "commercial", cluster: "Textile Sourcing" });
    setShowAddKw(false);
  };

  const handleAnalyzePage = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzedData({
        url: analyzerUrl,
        score: 93,
        title: "Verified Indian Textile Manufacturers & Sourcing Mills | Bell24h",
        titleLen: 58,
        desc: "Direct sourcing from verified Tirupur, Surat and Ahmedabad textile mills with milestone escrow protection, lab testing, and instant RFQ matching.",
        descLen: 154,
        h1: "Global B2B Textile & Apparel Sourcing Marketplace",
        h2Count: 4,
        h3Count: 9,
        wordCount: 1420,
        readability: "Grade 8 (High Readability)",
        canonical: "https://bell24h.com" + (analyzerUrl.startsWith("/") ? analyzerUrl : "/" + analyzerUrl),
        indexable: true
      });
    }, 600);
  };

  const handleCheckGeo = () => {
    setCheckingGeo(true);
    setTimeout(() => {
      setCheckingGeo(false);
      setGeoResult({
        query: geoQuery,
        citations: [
          { engine: "Perplexity AI", rank: "#1 Citation", sentiment: "Highly Positive", text: "Bell24h / VyaparSethu is cited as a leading digital B2B trade infrastructure linking verified Indian textile mills in Tirupur and Surat with international buyers using secured trade escrow." },
          { engine: "ChatGPT Search", rank: "#2 Citation", sentiment: "Positive", text: "Recommended for secure wholesale textile procurement and RFQ competitive pricing with SGS pre-shipment inspections." },
          { engine: "Google Gemini", rank: "#1 Grounding", sentiment: "Authoritative", text: "Structured sourcing hub providing verified export certifications and direct mill connections across cotton, synthetic silks, and handlooms." }
        ]
      });
    }, 700);
  };

  const handleGenerateContent = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setAiContent("# The Ultimate B2B Guide to Sourcing Combed Cotton Yarn from Tirupur\\n\\nIndia accounts for over 22% of global cotton production, with Tirupur emerging as the undisputed capital for combed ring-spun cotton knitting yarn.\\n\\n### Key Procurement Specifications\\n- **Yarn Counts**: Ne 30/1, 40/1, 60/1 high CSP\\n- **Certifications**: OEKO-TEX Standard 100, GOTS Organic\\n- **Escrow Terms**: 20% Advance in Escrow, 80% on SGS Pre-Shipment Inspection Certificate\\n\\nProcure directly on Bell24h with verified mill milestone guarantees.");
    }, 800);
  };

  const filteredKeywords = keywords.filter(k => {
    const matchSearch = k.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || k.cluster.toLowerCase().includes(searchQuery.toLowerCase());
    const matchIntent = intentFilter === "all" || k.intent === intentFilter;
    return matchSearch && matchIntent;
  });

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-6 h-6 text-emerald-600" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Enterprise SEO Center" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 border-emerald-200 font-medium", children: "AI & GEO Ready" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Search Intelligence, Technical Site Audits, Keyword Clustering & Generative Engine Optimization" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { 
          variant: "outline", 
          size: "sm", 
          className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer",
          onClick: () => onNavigate && onNavigate("marketplace"),
          children: "View Marketplace →" 
        }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { 
          size: "sm", 
          className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer",
          onClick: handleRunAudit,
          disabled: auditing,
          children: auditing ? [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCw, { className: "w-3.5 h-3.5 mr-1.5 animate-spin" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            "Crawling 162 Pages..."
          ] : [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "w-3.5 h-3.5 mr-1.5" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            "Run Full Site Audit"
          ]
        }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Notification banner if audit ran */
    auditSuccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: auditSuccess }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setAuditSuccess(""), className: "text-emerald-700 hover:text-emerald-900 font-bold ml-4", children: "✕" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Top Metric Summary Cards */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-3.5", children: [
      { label: "SEO Health Score", value: healthScore + "/100", sub: "+4% vs last audit", color: "text-emerald-600", bg: "bg-emerald-50", icon: Shield },
      { label: "Tracked Keywords", value: keywords.length.toString(), sub: "14 in Top 3 SERP", color: "text-blue-600", bg: "bg-blue-50", icon: Search },
      { label: "Est. Organic Traffic", value: "42.8K/mo", sub: "+18.4% MoM growth", color: "text-purple-600", bg: "bg-purple-50", icon: TrendingUp },
      { label: "Core Web Vitals", value: "LCP 1.84s", sub: "FID 14ms · CLS 0.038", color: "text-teal-600", bg: "bg-teal-50", icon: Zap },
      { label: "AI Search Grounding", value: "74% Share", sub: "Perplexity & Gemini", color: "text-amber-600", bg: "bg-amber-50", icon: Sparkles }
    ].map((m, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "hover:shadow-md transition-shadow border-gray-200", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-medium text-gray-500", children: m.label }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-7 h-7 rounded-lg " + m.bg + " flex items-center justify-center", children:
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(m.icon, { className: "w-3.5 h-3.5 " + m.color }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xl font-bold text-gray-900 tracking-tight", children: m.value }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] font-medium text-emerald-600 mt-1", children: m.sub }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, idx, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Tab Navigation */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-1 text-xs font-medium", children: [
      { id: "overview", label: "Executive Overview" },
      { id: "keywords", label: "Keyword Intelligence (" + keywords.length + ")" },
      { id: "audit", label: "Site Audit (" + auditIssues.filter(i => !i.fixed).length + " issues)" },
      { id: "analyzer", label: "Single-Page Analyzer" },
      { id: "meta-tags", label: "Meta & OpenGraph" },
      { id: "schema", label: "Schema & JSON-LD" },
      { id: "geo", label: "AI & GEO Grounding" },
      { id: "content", label: "Content Optimizer" },
      { id: "sitemap", label: "Sitemap & Robots" }
    ].map(t => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
      onClick: () => setActiveTab(t.id),
      className: cn(
        "px-3.5 py-2 rounded-t-lg transition-colors cursor-pointer whitespace-nowrap font-medium",
        activeTab === t.id 
          ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50 font-semibold" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      ),
      children: t.label
    }, t.id, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: OVERVIEW */
    activeTab === "overview" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* Left Column: Health & Core Web Vitals */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "lg:col-span-2 border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "Crawl & Indexation Health (162 Pages)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-700 border-0 text-[11px]", children: "Healthy 91%" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "pt-4 space-y-4", children: [
          /* HTTP Status Distribution */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-4 gap-3 text-center", children: [
            { code: "200 OK", count: 148, pct: "91.3%", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { code: "301 Redirect", count: 10, pct: "6.2%", color: "text-blue-700 bg-blue-50 border-blue-200" },
            { code: "404 Not Found", count: 3, pct: "1.8%", color: "text-amber-700 bg-amber-50 border-amber-200" },
            { code: "500 Error", count: 1, pct: "0.6%", color: "text-red-700 bg-red-50 border-red-200" }
          ].map((st, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 rounded-xl border " + st.color, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-base font-bold", children: st.count }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] font-medium opacity-90", children: st.code }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] opacity-75 mt-0.5", children: st.pct }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, i, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

          /* Core Web Vitals Details */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-xs font-semibold text-gray-800", children: "Google Core Web Vitals (Real User Metrics)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white p-2.5 rounded-lg border border-gray-200", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500", children: "LCP (Largest Contentful Paint)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-bold text-emerald-600 mt-0.5", children: "1.84s (Good)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-400 mt-0.5", children: "Benchmark: < 2.5s" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white p-2.5 rounded-lg border border-gray-200", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500", children: "FID (First Input Delay)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-bold text-emerald-600 mt-0.5", children: "14ms (Good)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-400 mt-0.5", children: "Benchmark: < 100ms" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white p-2.5 rounded-lg border border-gray-200", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500", children: "CLS (Cumulative Layout Shift)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm font-bold text-emerald-600 mt-0.5", children: "0.038 (Good)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-400 mt-0.5", children: "Benchmark: < 0.10" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* Right Column: Top High-Impact SEO Actions */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "High-Impact Recommendations" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "pt-4 space-y-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-xl", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-blue-900", children: "Target 'Textile Sourcing' cluster" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-blue-700 mt-0.5", children: "3 keywords ranked #4-#6 can enter Top 3 with 2 new internal links from Supplier Hubs." }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setActiveTab("keywords"), className: "text-[11px] font-semibold text-blue-800 hover:underline mt-2 inline-block", children: "View Keywords →" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-xl", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-amber-900", children: "Missing Canonical Tag" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-amber-800 mt-0.5", children: "1 critical duplicate content issue detected on /marketplace/machinery." }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setActiveTab("audit"), className: "text-[11px] font-semibold text-amber-900 hover:underline mt-2 inline-block", children: "Fix in Technical Audit →" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-emerald-900", children: "AI Search Grounding (GEO)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-emerald-800 mt-0.5", children: "Perplexity cited Bell24h as #1 sourcing platform for verified Indian cotton yarn." }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setActiveTab("geo"), className: "text-[11px] font-semibold text-emerald-900 hover:underline mt-2 inline-block", children: "Check AI Citations →" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: KEYWORDS */
    activeTab === "keywords" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "Tracked Keywords & SERP Rankings" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Daily position changes, search volume, CPC, and commercial intent classification" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
              placeholder: "Search keywords or clusters...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "w-52 h-8 text-xs bg-gray-50"
            }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
              value: intentFilter,
              onChange: (e) => setIntentFilter(e.target.value),
              className: "h-8 text-xs border border-gray-300 rounded-md px-2 bg-white text-gray-700"
            }, [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "all", children: "All Intents" }, "all", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "transactional", children: "Transactional" }, "trans", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "commercial", children: "Commercial" }, "comm", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ], false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
              size: "sm",
              className: "h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer",
              onClick: () => setShowAddKw(!showAddKw),
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3 h-3 mr-1" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                "Add Keyword"
              ]
            }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* Add Keyword Drawer / Form */
      showAddKw && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleAddKeyword, className: "p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[11px] font-medium text-gray-700", children: "Target Keyword" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
            required: true,
            placeholder: "e.g., Surat jacquard silk fabric",
            value: newKw.keyword,
            onChange: (e) => setNewKw({ ...newKw, keyword: e.target.value }),
            className: "h-8 text-xs mt-1 bg-white"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[11px] font-medium text-gray-700", children: "Est. Monthly Volume" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
            type: "number",
            value: newKw.volume,
            onChange: (e) => setNewKw({ ...newKw, volume: e.target.value }),
            className: "h-8 text-xs mt-1 bg-white"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-[11px] font-medium text-gray-700", children: "Cluster" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
            value: newKw.cluster,
            onChange: (e) => setNewKw({ ...newKw, cluster: e.target.value }),
            className: "h-8 text-xs mt-1 w-full border border-gray-300 rounded-md px-2 bg-white text-gray-700"
          }, [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Textile Sourcing", children: "Textile Sourcing" }, "ts", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Regional Hubs", children: "Regional Hubs" }, "rh", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Trade Finance", children: "Trade Finance" }, "tf", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ], false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white w-full cursor-pointer", children: "Save & Track" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setShowAddKw(false), className: "h-8 text-xs", children: "Cancel" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* Keyword Table */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-0", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { children:
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-b bg-gray-50 text-gray-600 font-semibold text-left", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Keyword & Intent" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Topic Cluster" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-center", children: "Google SERP Rank" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-right", children: "Volume" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Difficulty (KD)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-right", children: "CPC" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Target URL" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-right", children: "Action" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: filteredKeywords.map(k => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-b last:border-0 hover:bg-gray-50/75 transition-colors", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 font-medium text-gray-900", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-semibold text-gray-900", children: k.keyword }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded mt-0.5 " + (k.intent === "transactional" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"), children: k.intent }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3", children:
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[11px] font-normal border-gray-300 text-gray-700", children: k.cluster }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-center", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-full " + (k.position <= 3 ? "bg-emerald-100 text-emerald-800" : k.position <= 10 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"), children: [
                  "#", k.position
                ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] text-emerald-600 font-semibold ml-1.5", children: [
                  "▲ ", (k.prevPosition - k.position > 0 ? "+" + (k.prevPosition - k.position) : "±0")
                ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-right font-medium text-gray-800", children: k.volume.toLocaleString() }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between text-[10px] text-gray-500 mb-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: k.difficulty > 50 ? "Hard" : "Medium" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: k.difficulty + "/100" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
                ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden", children:
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-full " + (k.difficulty > 60 ? "bg-red-500" : k.difficulty > 40 ? "bg-amber-500" : "bg-emerald-500"), style: { width: k.difficulty + "%" } }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
                }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-right font-medium text-gray-700", children: k.cpc }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 font-mono text-[11px] text-gray-500", children: k.url }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-right", children:
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
                  onClick: () => { setAnalyzerUrl(k.url); setActiveTab("analyzer"); },
                  className: "text-emerald-600 hover:text-emerald-800 font-semibold text-[11px] hover:underline cursor-pointer",
                  children: "Audit Page"
                }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
              }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, k.id, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        )
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: TECHNICAL AUDIT */
    activeTab === "audit" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "Automated Technical SEO Crawler Issues" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Crawl diagnostics covering canonicals, status codes, broken links, and metadata" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer", onClick: handleRunAudit, children: "Re-scan Site" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-3", children: auditIssues.map(iss => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3.5 rounded-xl border flex items-center justify-between gap-3 " + (iss.fixed ? "bg-gray-50 border-gray-200 opacity-60" : iss.severity === "critical" ? "bg-red-50/50 border-red-200" : iss.severity === "warning" ? "bg-amber-50/50 border-amber-200" : "bg-blue-50/50 border-blue-200"), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: iss.fixed ? "bg-gray-200 text-gray-700" : iss.severity === "critical" ? "bg-red-100 text-red-800" : iss.severity === "warning" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800", children: iss.fixed ? "Resolved" : iss.severity.toUpperCase() }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-gray-900 " + (iss.fixed ? "line-through" : ""), children: iss.title }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500 mt-0.5", children: "Impact: " + iss.impact + " · Affects search ranking & crawl budget" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: iss.fixed ? 
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-emerald-600 font-semibold flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-3.5 h-3.5" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this), " Fixed"
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this) :
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "h-7 text-xs border-gray-300 hover:bg-white cursor-pointer", onClick: () => handleFixIssue(iss.id), children: "Auto-Fix Issue" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, iss.id, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: SINGLE-PAGE ANALYZER */
    activeTab === "analyzer" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
      /* URL Input bar */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-xs font-semibold text-gray-700", children: "Analyze Any Internal Page or Marketplace URL" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
              value: analyzerUrl,
              onChange: (e) => setAnalyzerUrl(e.target.value),
              placeholder: "/marketplace/textiles or https://bell24h.com/...",
              className: "mt-1 h-9 text-xs"
            }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            onClick: handleAnalyzePage,
            disabled: analyzing,
            className: "mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 cursor-pointer",
            children: analyzing ? "Auditing Page..." : "Analyze Page"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* Analyzed Details */
      analyzedData && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100 flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: [ "Audit Report for: ", analyzedData.url ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Indexable: Yes · Canonical: Valid" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1", children: [ "Page Score: ", analyzedData.score, "/100" ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-4 text-xs", children: [
          /* Title Check */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-gray-800", children: "Page Title Tag" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-emerald-700 font-medium", children: analyzedData.titleLen + " / 60 chars (Optimal)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-900 font-medium", children: analyzedData.title }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

          /* Meta Description Check */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-gray-800", children: "Meta Description Tag" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-emerald-700 font-medium", children: analyzedData.descLen + " / 160 chars (Optimal)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-700", children: analyzedData.desc }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

          /* Headings and Word Count */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50/60 rounded-xl border border-emerald-200", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500", children: "H1 Tag Structure" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-1", children: "1 Unique H1" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-500 mt-0.5 truncate", children: analyzedData.h1 }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-blue-50/60 rounded-xl border border-blue-200", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500", children: "Content Depth" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-1", children: analyzedData.wordCount + " Words" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-emerald-600 mt-0.5", children: "Passed B2B Threshold" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-purple-50/60 rounded-xl border border-purple-200", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-500", children: "Readability Index" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900 mt-1", children: analyzedData.readability }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-500 mt-0.5", children: "Flesch-Kincaid Standard" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: SCHEMA & JSON-LD */
    activeTab === "schema" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100 flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "Schema.org Structured Data Generator" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Rich snippets for Google Search results, Knowledge Panels & Merchant listings" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
            value: selectedSchema,
            onChange: (e) => setSelectedSchema(e.target.value),
            className: "h-8 text-xs border border-gray-300 rounded-md px-2 bg-white text-gray-800"
          }, [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Organization", children: "Organization Schema" }, "org", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "B2BProduct", children: "B2B Product Schema" }, "prod", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "FAQPage", children: "FAQ Page Schema" }, "faq", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "LocalBusiness", children: "Local Hub Schema" }, "local", false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ], false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            variant: "outline",
            className: "h-8 text-xs cursor-pointer",
            onClick: () => {
              navigator.clipboard && navigator.clipboard.writeText(schemaSnippets[selectedSchema]);
              setCopiedSchema(true);
              setTimeout(() => setCopiedSchema(false), 2000);
            },
            children: copiedSchema ? [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-3 h-3 text-emerald-600 mr-1" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              "Copied!"
            ] : [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Copy, { className: "w-3 h-3 mr-1" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              "Copy JSON-LD"
            ]
          }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("pre", { className: "p-4 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto", children: schemaSnippets[selectedSchema] }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500 mt-2", children: "✓ Passed Google Structured Data Testing Tool standards." }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: GEO (GENERATIVE ENGINE OPTIMIZATION) */
    activeTab === "geo" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "Generative Engine Optimization (GEO) & AI Search Citations" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Monitor how Perplexity AI, ChatGPT Search, and Google Gemini cite Bell24h and VyaparSethu in conversational sourcing queries" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-4", children: [
        /* Query tester input */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
            value: geoQuery,
            onChange: (e) => setGeoQuery(e.target.value),
            placeholder: "Enter AI search query to inspect citations...",
            className: "h-9 text-xs flex-1 bg-gray-50"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            onClick: handleCheckGeo,
            disabled: checkingGeo,
            className: "h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer",
            children: checkingGeo ? "Testing AI Grounding..." : "Test AI Citations"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* GEO citations list */
        geoResult && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 pt-2", children: geoResult.citations.map((c, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 bg-white border border-gray-200 rounded-xl space-y-2 shadow-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "w-4 h-4 text-purple-600" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-bold text-gray-900", children: c.engine }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 text-[10px]", children: c.rank }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] text-gray-600", children: c.sentiment }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100", children: [ '"', c.text, '"' ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, idx, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: CONTENT OPTIMIZER */
    activeTab === "content" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: "AI B2B Sourcing Content & Article Generator" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500", children: "Create authoritative, search-optimized textile procurement guides and category pages" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
            size: "sm",
            onClick: handleGenerateContent,
            disabled: aiGenerating,
            className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer",
            children: aiGenerating ? "Generating Content..." : "Generate AI Article"
          }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500", children: "Target Keyword" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-bold text-gray-900 mt-0.5", children: "combed cotton yarn tirupur" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 rounded-xl border border-emerald-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-emerald-700", children: "Content Score" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-bold text-emerald-900 mt-0.5", children: "94 / 100 (Optimal)" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-purple-50 rounded-xl border border-purple-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-purple-700", children: "Topic Coverage" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-bold text-purple-900 mt-0.5", children: "12 / 12 Key Entities Covered" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
        aiContent && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed", children: aiContent }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* TAB CONTENT: META-TAGS / SITEMAP (Default fallback for remaining tabs) */
    (activeTab === "meta-tags" || activeTab === "sitemap") && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold text-gray-900", children: activeTab === "meta-tags" ? "Meta Tag & Social Card Optimizer" : "XML Sitemaps & Search Engine Directives" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-4 text-xs", children: [
        activeTab === "meta-tags" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 border border-gray-200 rounded-xl bg-white max-w-xl", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-400 mb-1", children: "Google SERP Desktop Snippet Preview" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-blue-700 text-sm font-medium hover:underline cursor-pointer", children: "Verified Indian Textile Manufacturers & Sourcing Mills | Bell24h" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-emerald-700 text-[11px] font-mono", children: "https://bell24h.com/marketplace/textiles" }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-gray-600 mt-1 text-xs", children: "Direct sourcing from verified Tirupur, Surat and Ahmedabad textile mills with milestone escrow protection, lab testing, and instant RFQ matching." }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this) :
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
          [
            { name: "sitemap.xml", urls: 162, status: "200 OK · Indexed", lastmod: "Today" },
            { name: "sitemap-products.xml", urls: 54, status: "200 OK · Indexed", lastmod: "Today" },
            { name: "sitemap-suppliers.xml", urls: 38, status: "200 OK · Indexed", lastmod: "Yesterday" }
          ].map((sm, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-mono font-semibold text-gray-900", children: "https://bell24h.com/" + sm.name }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-500", children: sm.urls + " URLs · Last updated: " + sm.lastmod }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 text-[10px]", children: sm.status }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, i, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this))
        ] }, void 0, false, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "SEOCenter.tsx", lineNumber: 1, columnNumber: 1 }, this);
}`;

// Read bundle-app.js
let code = fs.readFileSync("src/bundle-app.js", "utf8");

// Find SEOCenterPage
const start = code.indexOf("function SEOCenterPage");
const end = code.indexOf("function ContentPlannerPage");

if (start === -1 || end === -1) {
  console.error("Could not find SEOCenterPage in bundle-app.js!");
  process.exit(1);
}

console.log("Replacing SEOCenterPage from", start, "to", end);
code = code.slice(0, start) + seoCenterCode + "\n" + code.slice(end);

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("SEOCenterPage replacement complete!");
