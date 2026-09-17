const fs = require("fs");

let code = fs.readFileSync("src/bundle-app.js", "utf8");

// Wire KPI cards to navigate on click
// Search where KPI cards are mapped
const oldKpiCard = 'kpi) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "hover:shadow-md transition-shadow", children:';
const newKpiCard = `kpi => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { 
  className: "hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer",
  onClick: () => {
    if (!onNavigate) return;
    if (kpi.label === "Total Budget" || kpi.label === "Total Spent") onNavigate("analytics");
    else if (kpi.label === "Campaigns") onNavigate("campaigns");
    else if (kpi.label === "Leads") onNavigate("leads");
    else if (kpi.label === "Jobs") onNavigate("jobs");
    else if (kpi.label === "Content") onNavigate("content");
  },
  children:`;

code = code.replace(oldKpiCard, newKpiCard);

// Wire Recent Jobs CardHeader to have View All link
const oldRecentJobsHeader = '/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold", children: "Recent Jobs" }, void 0, false, {';
const newRecentJobsHeader = `/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold", children: "Recent Jobs" }, void 0, false, { fileName: "/app/workspace/src/pages/Dashboard.tsx", lineNumber: 166, columnNumber: 15 }, this),
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { 
    className: "text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline ml-auto font-medium cursor-pointer",
    onClick: () => onNavigate && onNavigate("jobs"),
    children: "View All →"
  }, void 0, false, { fileName: "/app/workspace/src/pages/Dashboard.tsx", lineNumber: 166, columnNumber: 30 }, this)
] }, void 0, true, {`;
code = code.replace(oldRecentJobsHeader, newRecentJobsHeader);

// Wire Recent Activity CardHeader to have View All link
const oldRecentActivityHeader = '/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold", children: "Recent Activity" }, void 0, false, {          fileName: "/app/workspace/src/pages/Dashboard.tsx",          lineNumber: 201,          columnNumber: 13        }, this)';
const newRecentActivityHeader = `/* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CardTitle, { className: "text-sm font-semibold", children: "Recent Activity" }, void 0, false, { fileName: "/app/workspace/src/pages/Dashboard.tsx", lineNumber: 201, columnNumber: 13 }, this),
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { 
    className: "text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline font-medium cursor-pointer",
    onClick: () => onNavigate && onNavigate("admin-audit"),
    children: "Audit Log →"
  }, void 0, false, { fileName: "/app/workspace/src/pages/Dashboard.tsx", lineNumber: 201, columnNumber: 30 }, this)
] }, void 0, true, { fileName: "/app/workspace/src/pages/Dashboard.tsx", lineNumber: 201, columnNumber: 10 }, this)`;
code = code.replace(oldRecentActivityHeader, newRecentActivityHeader);

fs.writeFileSync("src/bundle-app.js", code, "utf8");
console.log("Dashboard wiring step 2 complete!");
