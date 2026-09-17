const fs = require("fs");

console.log("Replacing Admin (Roles, Reports, KnowledgeBase, Logs) and Marketing (PublishingCenter, ContentPlanner) pages...");

let code = fs.readFileSync("src/bundle-app.js", "utf8");

// Helper to replace between two anchor strings
function replaceBetween(src, startStr, endStr, replacement) {
  const s = src.indexOf(startStr);
  if (s === -1) throw new Error("Could not find start: " + startStr);
  const e = src.indexOf(endStr, s);
  if (e === -1) throw new Error("Could not find end: " + endStr);
  return src.slice(0, s) + replacement + "\n" + src.slice(e);
}

// 1. RolesPage
const rolesPageCode = `
function RolesPage({ onNavigate }) {
  const [roles, setRoles] = reactExports.useState([
    { id: "super_admin", name: "Super Administrator", level: 100, desc: "Unrestricted access to all modules, financial escrow releases, and system settings", perms: ["manage_users", "manage_escrow", "manage_rfqs", "publish_campaigns", "export_reports", "system_logs"] },
    { id: "sourcing_mgr", name: "Sourcing & Trade Manager", level: 80, desc: "Oversees mill verifications, RFQ tenders, quality inspections, and milestone approvals", perms: ["manage_rfqs", "manage_escrow", "export_reports"] },
    { id: "marketing_lead", name: "Marketing & Growth Lead", level: 60, desc: "Full control of campaigns, SEO center, content scheduling, and syndication", perms: ["publish_campaigns", "export_reports"] },
    { id: "verified_mill", name: "Verified Mill Exporter", level: 40, desc: "Access to bidding tenders, product catalog publishing, and escrow milestone claims", perms: ["manage_rfqs"] },
    { id: "verified_buyer", name: "Institutional Buyer", level: 30, desc: "Post tenders, deposit escrow, track mill orders, and inspect lab certificates", perms: ["manage_rfqs"] },
    { id: "auditor", name: "Trade & Compliance Auditor", level: 20, desc: "Read-only inspection of escrow contracts, SGS lab certifications, and transaction logs", perms: ["export_reports", "system_logs"] }
  ]);

  const allPerms = [
    { id: "manage_users", label: "Manage User Roles & Access" },
    { id: "manage_escrow", label: "Approve Escrow Releases" },
    { id: "manage_rfqs", label: "Post & Award RFQ Tenders" },
    { id: "publish_campaigns", label: "Publish Marketing Campaigns" },
    { id: "export_reports", label: "Export Financial & Analytics Reports" },
    { id: "system_logs", label: "Audit Security & System Logs" }
  ];

  const [toastMsg, setToastMsg] = reactExports.useState("");
  const [newRoleModal, setNewRoleModal] = reactExports.useState(false);
  const [customRole, setCustomRole] = reactExports.useState({ name: "", desc: "", perms: [] });

  const togglePerm = (roleId, permId) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const has = r.perms.includes(permId);
      const updated = has ? r.perms.filter(p => p !== permId) : [...r.perms, permId];
      return { ...r, perms: updated };
    }));
    setToastMsg("Permissions updated for role.");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!customRole.name) return;
    const r = {
      id: "role-" + Date.now(),
      name: customRole.name,
      level: 50,
      desc: customRole.desc || "Custom defined organization role",
      perms: customRole.perms
    };
    setRoles([...roles, r]);
    setNewRoleModal(false);
    setCustomRole({ name: "", desc: "", perms: [] });
    setToastMsg("New custom role created successfully!");
    setTimeout(() => setToastMsg(""), 3000);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Shield, { className: "w-6 h-6 text-red-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Roles & RBAC Access Matrix" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: roles.length + " security roles defined across Bell24h-OS enterprise governance hierarchy" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("logs"), children: "View Audit Logs →" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => setNewRoleModal(true), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3.5 h-3.5 mr-1" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          "Create Custom Role"
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    toastMsg && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        toastMsg
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setToastMsg(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Roles Cards Matrix */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: roles.map(r => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2 mb-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: r.level >= 80 ? "bg-red-100 text-red-800 text-[10px]" : r.level >= 50 ? "bg-blue-100 text-blue-800 text-[10px]" : "bg-gray-100 text-gray-700 text-[10px]", children: "Level " + r.level }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[11px] text-gray-400 font-mono", children: r.id }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-bold text-gray-900", children: r.name }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-1 line-clamp-2", children: r.desc }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "pt-2 pb-4 space-y-2 border-t border-gray-100 mt-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] font-semibold text-gray-500 uppercase tracking-wider", children: "Granular Permissions:" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: allPerms.map(p => {
          const has = r.perms.includes(p.id);
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", {
            onClick: () => togglePerm(r.id, p.id),
            className: "flex items-center gap-2 text-xs text-gray-700 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer select-none",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", {
                type: "checkbox",
                checked: has,
                readOnly: true,
                className: "rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 pointer-events-none"
              }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: has ? "font-medium text-gray-900" : "text-gray-400", children: p.label }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ]
          }, p.id, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
        }) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, r.id, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Add Role Modal */
    newRoleModal && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Create Custom Role" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setNewRoleModal(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleAddRole, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Role Name" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, placeholder: "e.g. Tirupur Hub Officer", value: customRole.name, onChange: (e) => setCustomRole({ ...customRole, name: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Description" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { placeholder: "Responsibilities and access scope", value: customRole.desc, onChange: (e) => setCustomRole({ ...customRole, desc: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setNewRoleModal(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Save Role" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// 2. ReportsPage
const reportsPageCode = `
function ReportsPage({ onNavigate }) {
  const [timeRange, setTimeRange] = reactExports.useState("30d");
  const [activeReport, setActiveReport] = reactExports.useState("campaign");
  const [downloadToast, setDownloadToast] = reactExports.useState("");

  const reportsData = {
    campaign: {
      title: "Omnichannel Campaign Performance & Ad Spend",
      kpis: [
        { label: "Total Ad Spend", value: "₹4,25,000", change: "+12%" },
        { label: "Impressions", value: "1.28M", change: "+24%" },
        { label: "Clicks & Traffic", value: "84,320", change: "+18%" },
        { label: "Average CPC", value: "₹5.04", change: "-8%" }
      ],
      rows: [
        { name: "Tirupur Cotton Yarn Export Blast", channel: "LinkedIn B2B", spend: "₹1,45,000", leads: 48, cpl: "₹3,020" },
        { name: "Surat Brocade Silks GCC Outreach", channel: "Meta Ads & WhatsApp", spend: "₹1,20,000", leads: 64, cpl: "₹1,875" },
        { name: "Gujarat Indigo Denim Trade Fair", channel: "Google Search Ads", spend: "₹95,000", leads: 31, cpl: "₹3,064" },
        { name: "Bhilwara Suiting International RFP", channel: "Email Broadcast", spend: "₹65,000", leads: 22, cpl: "₹2,954" }
      ]
    },
    sourcing: {
      title: "B2B Mill Sourcing & Tender Conversion",
      kpis: [
        { label: "Active RFQs Posted", value: "48 Tenders", change: "+15%" },
        { label: "Mill Bids Received", value: "246 Bids", change: "+32%" },
        { label: "Avg Bids Per Tender", value: "5.1 Bids", change: "+10%" },
        { label: "Tender Award Rate", value: "82.4%", change: "+5%" }
      ],
      rows: [
        { name: "Combed Ring-Spun Cotton Yarn 40s/1", channel: "Tirupur Cluster", spend: "15,000 kg", leads: 6, cpl: "Awarded" },
        { name: "Brocade Silk Jacquard 48-inch Width", channel: "Surat Cluster", spend: "4,000 meters", leads: 4, cpl: "In Review" },
        { name: "Indigo Denim 11.5 oz Stretch Twill", channel: "Ahmedabad Cluster", spend: "8,000 meters", leads: 9, cpl: "Bidding Open" }
      ]
    },
    escrow: {
      title: "VyaparSethu Trade Escrow & Financial Turnaround",
      kpis: [
        { label: "Total Escrow Secured", value: "₹3.84 Cr", change: "+28%" },
        { label: "Milestone Released", value: "₹2.96 Cr", change: "+20%" },
        { label: "Under SGS Inspection", value: "₹88 Lakhs", change: "Active" },
        { label: "Dispute Rate", value: "0.00%", change: "100% Safe" }
      ],
      rows: [
        { name: "Escrow Order #VS-9821 (Al-Barakah)", channel: "Milestone 2 (SGS Pass)", spend: "₹42,00,000", leads: 1, cpl: "Released 80%" },
        { name: "Escrow Order #VS-9844 (Nordic Organic)", channel: "Milestone 1 (BL Ready)", spend: "₹68,50,000", leads: 1, cpl: "Deposit Held" },
        { name: "Escrow Order #VS-9860 (VogueCraft US)", channel: "Milestone 3 (Customs Pass)", spend: "₹92,00,000", leads: 1, cpl: "Released 100%" }
      ]
    }
  };

  const cur = reportsData[activeReport] || reportsData.campaign;

  const handleDownload = (format) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += cur.title + "\\n";
    csvContent += "Metric,Value\\n";
    cur.kpis.forEach(k => { csvContent += k.label + "," + k.value + "\\n"; });
    csvContent += "\\nItem,Channel/Cluster,Volume/Spend,Status/Leads\\n";
    cur.rows.forEach(r => { csvContent += '"' + r.name + '","' + r.channel + '","' + r.spend + '","' + r.cpl + '"\\n'; });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", activeReport + "_report_" + timeRange + "." + (format === "csv" ? "csv" : "txt"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadToast(format.toUpperCase() + " report downloaded successfully!");
    setTimeout(() => setDownloadToast(""), 3500);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChartPie, { className: "w-6 h-6 text-cyan-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Executive Intelligence & Reports" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Live audited telemetry across marketing ROI, textile mill sourcing, and milestone trade escrow" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* Right actions */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", {
          value: timeRange,
          onChange: (e) => setTimeRange(e.target.value),
          className: "h-8 text-xs border border-gray-300 rounded-lg px-2.5 bg-white text-gray-700"
        }, [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "7d", children: "Last 7 Days" }, "7d", false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "30d", children: "Last 30 Days" }, "30d", false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "90d", children: "Quarter to Date" }, "90d", false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ], false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => handleDownload("csv"), children: "Export CSV" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 cursor-pointer font-medium", onClick: () => handleDownload("pdf"), children: "Download PDF" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    downloadToast && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        downloadToast
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setDownloadToast(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Report Tabs */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 border-b border-gray-200 pb-1 text-xs", children: [
      { id: "campaign", label: "Marketing & Campaigns ROI" },
      { id: "sourcing", label: "Tenders & Mill Sourcing" },
      { id: "escrow", label: "Trade Escrow Protection" }
    ].map(t => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
      onClick: () => setActiveReport(t.id),
      className: cn(
        "px-4 py-2 rounded-t-lg font-medium transition-colors cursor-pointer",
        activeReport === t.id ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50/50 font-semibold" : "text-gray-600 hover:text-gray-900"
      ),
      children: t.label
    }, t.id, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* KPIs Grid */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: cur.kpis.map((k, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 space-y-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-gray-500", children: k.label }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xl font-bold text-gray-900", children: k.value }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded", children: k.change }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, i, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Detailed Table */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardHeader, { className: "pb-3 border-b border-gray-100", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-bold text-gray-900", children: cur.title }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-0", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { children:
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-b bg-gray-50 text-gray-600 font-semibold text-left", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Campaign / RFQ Initiative" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Channel / Cluster" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Spend / Volume" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-right", children: "Status / Efficiency" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { className: "divide-y divide-gray-100", children: cur.rows.map((r, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "hover:bg-gray-50", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 font-semibold text-gray-900", children: r.name }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-gray-600", children: r.channel }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 font-mono font-medium text-gray-900", children: r.spend }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-3 text-right", children:
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 border-0 text-[11px]", children: r.cpl }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, i, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// 3. KnowledgeBasePage
const knowledgeBasePageCode = `
function KnowledgeBasePage({ onNavigate }) {
  const [search, setSearch] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [selectedDoc, setSelectedDoc] = reactExports.useState(null);

  const docs = [
    {
      id: "doc-1",
      title: "VyaparSethu Milestone Trade Escrow Architecture",
      category: "Finance & Escrow",
      readTime: "6 min read",
      author: "Chief Risk Officer",
      summary: "Detailed overview of tripartite milestone releases: 20% Advance, 60% upon Bill of Lading (BL) & SGS Lab Certification, and 20% on destination port customs clearance.",
      content: "The VyaparSethu Trade Escrow mechanism operates on autonomous smart-contract milestone states. Funds are locked into a scheduled commercial escrow account before mill production commences. Upon SGS inspection upload and verification via cryptographic hash, the milestone is triggered and capital released within 2 hours."
    },
    {
      id: "doc-2",
      title: "Textile Mill Sourcing & Cluster Verification Standards",
      category: "Sourcing & Quality",
      readTime: "8 min read",
      author: "Quality Director",
      summary: "Verification protocols for Tirupur knits, Surat jacquards, and Ahmedabad denim mills including GOTS organic certification, OEKO-TEX 100, and ZED Gold audit criteria.",
      content: "All Indian spinning and weaving mills registered on Bell24h-OS undergo three-tier auditing: 1. Physical machinery count & daily output capacity, 2. Environmental wastewater treatment compliance, 3. Real-time GST and export turnover certification."
    },
    {
      id: "doc-3",
      title: "Omnichannel Campaign Orchestration SOP",
      category: "Marketing & Growth",
      readTime: "5 min read",
      author: "Marketing Operations",
      summary: "Standard Operating Procedure for launching B2B lead generation funnels across LinkedIn InMail, WhatsApp Business verified channels, and Google Search Ads.",
      content: "When launching an export campaign targeting GCC or European apparel brands, utilize the dynamic B2B catalog integration. Always ensure the RFQ target pricing calculator is embedded in landing destination pages."
    },
    {
      id: "doc-4",
      title: "Developer REST & Webhook Integration API",
      category: "Developer",
      readTime: "10 min read",
      author: "Platform Architect",
      summary: "API specs for integrating external ERPs (SAP, Tally, Zoho) into Bell24h-OS RFQ pipelines, live inventory sync, and escrow status webhooks.",
      content: "All endpoints require Bearer API key authentication. Webhook payloads are signed using HMAC-SHA256 headers. Available webhook events include 'rfq.created', 'bid.submitted', and 'escrow.milestone_released'."
    }
  ];

  const filtered = docs.filter(d => {
    const matchCat = categoryFilter === "all" || d.category === categoryFilter;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Library, { className: "w-6 h-6 text-emerald-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Knowledge Base & SOP Repository" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Enterprise documentation, trade finance escrow guidelines, and textile export procedures" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => onNavigate && onNavigate("marketplace"), children: "Browse Marketplace →" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Search and Filters */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
          placeholder: "Search articles, SOPs, trade specs...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9 text-xs h-9 bg-gray-50 border-gray-200"
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* Category Filter */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 overflow-x-auto text-xs", children: [
        { id: "all", label: "All Topics" },
        { id: "Finance & Escrow", label: "Finance & Escrow" },
        { id: "Sourcing & Quality", label: "Sourcing & Quality" },
        { id: "Marketing & Growth", label: "Marketing" },
        { id: "Developer", label: "Developer API" }
      ].map(c => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
        onClick: () => setCategoryFilter(c.id),
        className: cn(
          "px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors whitespace-nowrap",
          categoryFilter === c.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        ),
        children: c.label
      }, c.id, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Articles Grid */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map(d => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, {
      className: "border-gray-200 hover:shadow-md transition-shadow cursor-pointer",
      onClick: () => setSelectedDoc(d),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 font-semibold", children: d.category }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-gray-400", children: d.readTime }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900 leading-snug hover:text-emerald-600 transition-colors", children: d.title }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-600 line-clamp-2 leading-relaxed", children: d.summary }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [ "By ", d.author ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-emerald-600 hover:underline", children: "Read Full Article →" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, d.id, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Article Reader Modal */
    selectedDoc && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-gray-200 max-h-[85vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3 border-b border-gray-100 pb-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-100 text-emerald-800 text-[10px] mb-1.5 border-0", children: selectedDoc.category }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "text-base font-bold text-gray-900 leading-snug", children: selectedDoc.title }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-400 mt-0.5", children: [ "Author: ", selectedDoc.author, " · ", selectedDoc.readTime ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setSelectedDoc(null), className: "text-gray-400 hover:text-gray-600 font-bold text-lg", children: "✕" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Article Body */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 text-xs text-gray-700 leading-relaxed", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-emerald-900 font-medium", children: selectedDoc.summary }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-sans space-y-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-bold text-gray-900 text-xs uppercase tracking-wider", children: "Standard Operating Procedure Details:" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: selectedDoc.content }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Footer */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2 border-t border-gray-100", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", onClick: () => setSelectedDoc(null), children: "Done Reading" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// 4. LogsPage
const logsPageCode = `
function LogsPage({ onNavigate }) {
  const [levelFilter, setLevelFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [downloadToast, setDownloadToast] = reactExports.useState("");

  const [logs] = reactExports.useState([
    { id: "log-101", level: "info", source: "escrow.engine", message: "Escrow milestone #2 (80%) released for Order #VS-9821 after SGS lab approval", timestamp: "2026-09-17 14:10:02" },
    { id: "log-102", level: "info", source: "seo.crawler", message: "XML Sitemap refreshed with 12 new textile category cluster pages", timestamp: "2026-09-17 13:45:21" },
    { id: "log-103", level: "warn", source: "rfq.matcher", message: "Tirupur Premier Mills bid deadline expiring in 6 hours for Tender #RFQ-102", timestamp: "2026-09-17 12:30:15" },
    { id: "log-104", level: "auth", source: "rbac.security", message: "Admin session authenticated from verified corporate IP [104.28.192.4]", timestamp: "2026-09-17 11:15:00" },
    { id: "log-105", level: "error", source: "webhook.crm", message: "Webhook retry attempt #1 succeeded for Dubai importer endpoint", timestamp: "2026-09-17 10:05:40" }
  ]);

  const filtered = logs.filter(l => {
    const matchLvl = levelFilter === "all" || l.level === levelFilter;
    const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase());
    return matchLvl && matchSearch;
  });

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "bell24h_audit_logs.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
    setDownloadToast("Audit logs JSON exported successfully!");
    setTimeout(() => setDownloadToast(""), 3500);
  };

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileText, { className: "w-6 h-6 text-gray-700" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Security & System Audit Logs" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Tamper-evident audit trail for escrow releases, RFQ bids, and administrative operations" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("roles"), children: "Manage RBAC Roles →" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: handleExportLogs, children: "Export JSON" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    downloadToast && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        downloadToast
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setDownloadToast(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Search and Level Filters */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative flex-1 max-w-md", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "w-4 h-4 text-gray-400 absolute left-3 top-2.5" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, {
          placeholder: "Filter by log message or system service...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "pl-9 text-xs h-9 bg-gray-50 border-gray-200"
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* Level Pills */
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 text-xs", children: [
        { id: "all", label: "All Levels" },
        { id: "info", label: "INFO" },
        { id: "warn", label: "WARN" },
        { id: "error", label: "ERROR" },
        { id: "auth", label: "AUTH" }
      ].map(lvl => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
        onClick: () => setLevelFilter(lvl.id),
        className: cn(
          "px-3 py-1.5 rounded-lg font-mono font-semibold cursor-pointer transition-colors text-[11px]",
          levelFilter === lvl.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        ),
        children: lvl.label
      }, lvl.id, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Logs Table */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-0", children:
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { children:
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-b bg-gray-50 text-gray-600 font-semibold text-left", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Level" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Source" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3", children: "Audit Message" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 py-3 text-right", children: "Timestamp" }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { className: "divide-y divide-gray-100 font-mono text-[11px]", children: filtered.map(l => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "hover:bg-gray-50", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2.5", children:
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: l.level === "error" ? "bg-red-100 text-red-800" : l.level === "warn" ? "bg-amber-100 text-amber-800" : l.level === "auth" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800", children: l.level.toUpperCase() }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2.5 font-semibold text-gray-700", children: l.source }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2.5 text-gray-900 font-sans text-xs", children: l.message }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2.5 text-right text-gray-400 whitespace-nowrap", children: l.timestamp }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, l.id, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "AdminPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// 5. PublishingCenterPage
const publishingCenterPageCode = `
function PublishingCenterPage({ onNavigate }) {
  const [activePlatform, setActivePlatform] = reactExports.useState("all");
  const [broadcastModalOpen, setBroadcastModalOpen] = reactExports.useState(false);
  const [broadcastToast, setBroadcastToast] = reactExports.useState("");
  const [newPost, setNewPost] = reactExports.useState({ title: "", content: "", platform: "LinkedIn B2B" });

  const platforms = [
    { id: "all", name: "All Channels", count: 18 },
    { id: "linkedin", name: "LinkedIn B2B", count: 6, color: "text-blue-700 bg-blue-50" },
    { id: "whatsapp", name: "WhatsApp Business", count: 5, color: "text-emerald-700 bg-emerald-50" },
    { id: "google", name: "Google Ads", count: 4, color: "text-amber-700 bg-amber-50" },
    { id: "email", name: "Email Broadcast", count: 3, color: "text-purple-700 bg-purple-50" }
  ];

  const [posts, setPosts] = reactExports.useState([
    { id: "post-1", title: "Tirupur Organic Cotton 30s/1 Export Allocation Open", platform: "LinkedIn B2B", status: "published", reach: "18,400 Impressions", engagements: 412, date: "Today at 10:30 AM" },
    { id: "post-2", title: "Direct Mill Brocade Silks Broadcast to GCC Importers", platform: "WhatsApp Business", status: "published", reach: "2,400 Verified Buyers", engagements: 184, date: "Yesterday" },
    { id: "post-3", title: "Heavy Indigo Denim 12.5 oz Twill Sourcing RFP", platform: "Google Ads", status: "scheduled", reach: "Est. 25,000 Impressions", engagements: 0, date: "Tomorrow at 09:00 AM" },
    { id: "post-4", title: "Bhilwara PV Suiting International Buyer Digest #42", platform: "Email Broadcast", status: "draft", reach: "680 Importers", engagements: 0, date: "Draft" }
  ]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!newPost.title) return;
    const p = {
      id: "post-" + Date.now(),
      title: newPost.title,
      platform: newPost.platform,
      status: "published",
      reach: "Broadcast Dispatched",
      engagements: 0,
      date: "Just now"
    };
    setPosts([p, ...posts]);
    setBroadcastModalOpen(false);
    setNewPost({ title: "", content: "", platform: "LinkedIn B2B" });
    setBroadcastToast("Content broadcast live to " + p.platform + "!");
    setTimeout(() => setBroadcastToast(""), 4000);
  };

  const filtered = posts.filter(p => {
    if (activePlatform === "all") return true;
    return p.platform.toLowerCase().includes(activePlatform);
  });

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "w-6 h-6 text-teal-600" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "Multi-Channel Publishing Center" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Syndicate mill catalogs, trade RFQs, and promotional content across LinkedIn, WhatsApp, and Google Ads" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("content"), children: "Content Planner →" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => setBroadcastModalOpen(true), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3.5 h-3.5 mr-1" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          "New Multi-Channel Broadcast"
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    broadcastToast && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        broadcastToast
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setBroadcastToast(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Platform Filters */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs", children: platforms.map(p => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
      onClick: () => setActivePlatform(p.id),
      className: cn(
        "px-3.5 py-1.5 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap",
        activePlatform === p.id ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      ),
      children: [ p.name, " (", p.count, ")" ]
    }, p.id, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Broadcast Queue Cards */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: filtered.map(post => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* Post info */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: post.status === "published" ? "bg-emerald-100 text-emerald-800 text-[10px]" : post.status === "scheduled" ? "bg-blue-100 text-blue-800 text-[10px]" : "bg-gray-100 text-gray-700 text-[10px]", children: post.status.toUpperCase() }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-semibold text-gray-500", children: post.platform }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: post.title }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-400", children: [ "Published: ", post.date ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Metrics & Actions */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-4 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-bold text-gray-900", children: post.reach }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-gray-400", children: [ post.engagements, " Interactions" ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", className: "text-xs h-8 border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("content"), children: "Edit in Planner" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, post.id, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Broadcast Modal */
    broadcastModalOpen && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Compose Multi-Channel Broadcast" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setBroadcastModalOpen(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleBroadcast, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Target Platform" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { value: newPost.platform, onChange: (e) => setNewPost({ ...newPost, platform: e.target.value }), className: "mt-1 w-full h-8 border border-gray-300 rounded-md px-2 bg-white text-xs" }, [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "LinkedIn B2B", children: "LinkedIn B2B Post" }, "li", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "WhatsApp Business", children: "WhatsApp Verified Broadcast" }, "wa", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Google Ads", children: "Google Ads Campaign Copy" }, "ga", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Email Broadcast", children: "Direct Buyer Email Blast" }, "em", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ], false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Broadcast Title / Headline" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, placeholder: "e.g., Surat Silk Brocades: Exclusive 5,000m Export Batch", value: newPost.title, onChange: (e) => setNewPost({ ...newPost, title: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Broadcast Message Content" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("textarea", { placeholder: "Include MOQ, spec details, and VyaparSethu Escrow link...", value: newPost.content, onChange: (e) => setNewPost({ ...newPost, content: e.target.value }), className: "mt-1 w-full border border-gray-300 rounded-lg p-2 text-xs h-20" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setBroadcastModalOpen(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Publish & Broadcast Now" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// 6. ContentPlannerPage
const contentPlannerPageCode = `
function ContentPlannerPage({ onNavigate }) {
  const [activeTab, setActiveTab] = reactExports.useState("kanban");
  const [createModal, setCreateModal] = reactExports.useState(false);
  const [aiGenerating, setAiGenerating] = reactExports.useState(false);
  const [toastMsg, setToastMsg] = reactExports.useState("");
  const [newContent, setNewContent] = reactExports.useState({ title: "", type: "blog_post", channel: "LinkedIn B2B", status: "ideation" });

  const [items, setItems] = reactExports.useState([
    { id: "cnt-1", title: "Why Indian Combed Cotton 30s Outperforms Global Ring Spun in 2026", type: "Technical Whitepaper", channel: "LinkedIn B2B", status: "published", date: "Jul 15" },
    { id: "cnt-2", title: "Surat Jacquard Weavers: Direct Mill Procurement Guide for Dubai Importers", type: "Buyer Guide", channel: "Blog & SEO", status: "scheduled", date: "Tomorrow" },
    { id: "cnt-3", title: "BCI Organic Single Jersey: Complete GSM & Shrinkage Specifications", type: "Spec Sheet", channel: "WhatsApp Catalog", status: "review", date: "Jul 20" },
    { id: "cnt-4", title: "Navigating Cross-Border Textile Escrow with SGS Lab Milestones", type: "Case Study", channel: "LinkedIn B2B", status: "ideation", date: "Draft" }
  ]);

  const handleAiDraft = () => {
    if (!newContent.title) return;
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setToastMsg("AI drafted structured outline, SEO meta tags, and high-converting CTA!");
      setTimeout(() => setToastMsg(""), 3500);
    }, 800);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newContent.title) return;
    const it = {
      id: "cnt-" + Date.now(),
      title: newContent.title,
      type: newContent.type,
      channel: newContent.channel,
      status: newContent.status,
      date: "Just now"
    };
    setItems([it, ...items]);
    setCreateModal(false);
    setNewContent({ title: "", type: "blog_post", channel: "LinkedIn B2B", status: "ideation" });
    setToastMsg("New content piece created in pipeline!");
    setTimeout(() => setToastMsg(""), 3500);
  };

  const moveStatus = (id, newStatus) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    setToastMsg("Content card moved to " + newStatus.toUpperCase());
    setTimeout(() => setToastMsg(""), 2500);
  };

  const statuses = [
    { id: "ideation", label: "Ideation & Drafts", color: "border-gray-200 bg-gray-50" },
    { id: "review", label: "In Review", color: "border-amber-200 bg-amber-50/30" },
    { id: "scheduled", label: "Scheduled", color: "border-blue-200 bg-blue-50/30" },
    { id: "published", label: "Published Live", color: "border-emerald-200 bg-emerald-50/30" }
  ];

  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 md:p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* Header */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileText, { className: "w-6 h-6 text-violet-600" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-xl font-bold text-gray-900 tracking-tight", children: "AI Content Studio & Planner" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-gray-500 mt-0.5", children: "Plan, generate, and review B2B whitepapers, mill catalogs, and SEO cluster assets" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", className: "text-xs border-gray-300 hover:bg-gray-50 cursor-pointer", onClick: () => onNavigate && onNavigate("publishing"), children: "Publishing Queue →" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm cursor-pointer", onClick: () => setCreateModal(true), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Plus, { className: "w-3.5 h-3.5 mr-1" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          "New Content Piece"
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    toastMsg && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheckBig, { className: "w-4 h-4 text-emerald-600" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        toastMsg
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setToastMsg(""), className: "font-bold text-emerald-900", children: "✕" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Kanban Pipeline Columns */
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: statuses.map(col => {
      const colItems = items.filter(i => i.status === col.id);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3 bg-white p-3.5 rounded-xl border " + col.color, children: [
        /* Column Header */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-bold text-xs text-gray-900", children: col.label }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] text-gray-500", children: colItems.length }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

        /* Items in column */
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2.5", children: colItems.map(item => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "border-gray-200 hover:shadow-md transition-shadow", children:
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardContent, { className: "p-3 space-y-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between text-[10px]", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[9px] bg-gray-50 border-gray-200 text-gray-700", children: item.type }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-gray-400", children: item.date }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "text-xs font-bold text-gray-900 leading-snug", children: item.title }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[10px] text-gray-500", children: [ "Channel: ", /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { className: "text-gray-700", children: item.channel }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this) ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* Quick advance action */
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end pt-1 border-t border-gray-100", children:
              item.status !== "published" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", {
                onClick: () => moveStatus(item.id, item.status === "ideation" ? "review" : item.status === "review" ? "scheduled" : "published"),
                className: "text-[10px] font-semibold text-emerald-600 hover:text-emerald-800 cursor-pointer",
                children: "Advance Stage →"
              }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        }, item.id, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)) }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, col.id, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
    }) }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),

    /* Create Modal with AI Draft */
    createModal && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children:
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-200", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "text-sm font-bold text-gray-900", children: "Create New Content Piece" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setCreateModal(false), className: "text-gray-400 hover:text-gray-600 font-bold", children: "✕" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleCreate, className: "space-y-3 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Content Title / Topic" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { required: true, placeholder: "e.g., Surat Jacquard Silks GCC Export Market Outlook", value: newContent.title, onChange: (e) => setNewContent({ ...newContent, title: e.target.value }), className: "mt-1 h-8 text-xs" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Content Format" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { value: newContent.type, onChange: (e) => setNewContent({ ...newContent, type: e.target.value }), className: "mt-1 w-full h-8 border border-gray-300 rounded-md px-2 bg-white text-xs" }, [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Technical Whitepaper", children: "Technical Whitepaper" }, "tw", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Buyer Guide", children: "Buyer Guide" }, "bg", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Spec Sheet", children: "Spec Sheet" }, "ss", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Case Study", children: "Case Study" }, "cs", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ], false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "font-medium text-gray-700", children: "Primary Channel" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("select", { value: newContent.channel, onChange: (e) => setNewContent({ ...newContent, channel: e.target.value }), className: "mt-1 w-full h-8 border border-gray-300 rounded-md px-2 bg-white text-xs" }, [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "LinkedIn B2B", children: "LinkedIn B2B" }, "li", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "Blog & SEO", children: "Blog & SEO Center" }, "bl", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "WhatsApp Catalog", children: "WhatsApp Catalog" }, "wa", false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
              ], false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
            ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* AI Draft Button */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-1", children:
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, {
              type: "button",
              variant: "outline",
              className: "w-full text-xs h-8 border-violet-200 text-violet-700 hover:bg-violet-50 cursor-pointer",
              disabled: aiGenerating,
              onClick: handleAiDraft,
              children: aiGenerating ? "AI Drafting Outline..." : "⚡ Generate AI Outline & Key Hooks"
            }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
          /* Actions */
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setCreateModal(false), className: "text-xs", children: "Cancel" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "submit", size: "sm", className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs", children: "Add to Pipeline" }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
          ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
        ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
      ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
    }, void 0, false, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this)
  ] }, void 0, true, { fileName: "MarketingPages.tsx", lineNumber: 1, columnNumber: 1 }, this);
}
`;

// Apply replacements
code = replaceBetween(code, "function RolesPage(", "function FeatureFlagsPage(", rolesPageCode);
code = replaceBetween(code, "function ReportsPage(", "function KnowledgeBasePage(", reportsPageCode);
code = replaceBetween(code, "function KnowledgeBasePage(", "function JobQueuePage(", knowledgeBasePageCode);
code = replaceBetween(code, "function LogsPage(", "function PublishingCenterPage(", logsPageCode);
code = replaceBetween(code, "function PublishingCenterPage(", "function SEOCenterPage(", publishingCenterPageCode);
code = replaceBetween(code, "function ContentPlannerPage(", "function MarketplacePage(", contentPlannerPageCode);

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("Admin & Marketing replacements completed successfully!");
